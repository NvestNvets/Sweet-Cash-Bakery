const { createClient } = require('@supabase/supabase-js');
const twilio = require('twilio');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Twilio client
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse the request body
        const data = JSON.parse(event.body);

        // Validate required fields
        const requiredFields = ['productName', 'quantity', 'customerName', 'customerPhone', 'customerEmail'];
        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Missing required fields',
                    fields: missingFields
                })
            };
        }

        // Generate a unique order ID
        const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Find an available partner
        const { data: partners, error: partnerError } = await supabase
            .from('sweet_cash_partners')
            .select('*')
            .eq('status', 'active')
            .order('last_order_time', { ascending: true })
            .limit(1);

        if (partnerError) {
            console.error('Error finding partner:', partnerError);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: 'Error finding available partner',
                    details: partnerError.message
                })
            };
        }

        if (!partners || partners.length === 0) {
            return {
                statusCode: 503,
                body: JSON.stringify({
                    error: 'No available partners at the moment'
                })
            };
        }

        const partner = partners[0];

        // Calculate order total
        const productPrices = {
            'Cash Cookie': 4.99,
            'Brookie': 5.99,
            'Muffin': 6.99,
            'Granola': 12.99,
            'Fruit Box': 24.99
        };

        const unitPrice = productPrices[data.productName] || 0;
        const total = unitPrice * data.quantity;

        // Insert the order into the database
        const { data: order, error: orderError } = await supabase
            .from('sweet_cash_orders')
            .insert([
                {
                    order_id: orderId,
                    product_name: data.productName,
                    quantity: data.quantity,
                    unit_price: unitPrice,
                    total_amount: total,
                    customer_name: data.customerName,
                    customer_phone: data.customerPhone,
                    customer_email: data.customerEmail,
                    partner_id: partner.partner_id,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }
            ]);

        if (orderError) {
            console.error('Error saving order:', orderError);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: 'Error saving order',
                    details: orderError.message
                })
            };
        }

        // Update partner's last order time
        await supabase
            .from('sweet_cash_partners')
            .update({ last_order_time: new Date().toISOString() })
            .eq('partner_id', partner.partner_id);

        // Calculate partner earnings
        const commissionRate = 0.15; // 15% commission
        const commission = total * commissionRate;

        // Record partner earnings
        await supabase
            .from('partner_earnings')
            .insert([
                {
                    partner_id: partner.partner_id,
                    order_id: orderId,
                    amount: commission,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }
            ]);

        // Send SMS notifications
        try {
            // Send to customer
            await twilioClient.messages.create({
                body: `Thank you for your order at Sweet Ca$h Bakery! Your order #${orderId} has been received and is being processed.`,
                to: data.customerPhone,
                from: process.env.TWILIO_PHONE_NUMBER
            });

            // Send to partner
            await twilioClient.messages.create({
                body: `New order #${orderId} has been assigned to you. Please check your dashboard for details.`,
                to: partner.phone,
                from: process.env.TWILIO_PHONE_NUMBER
            });
        } catch (smsError) {
            console.error('Error sending SMS:', smsError);
            // Continue processing even if SMS fails
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Order processed successfully',
                orderId: orderId,
                partnerId: partner.partner_id,
                total: total
            })
        };

    } catch (error) {
        console.error('Error processing order:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Error processing order',
                details: error.message
            })
        };
    }
}; 