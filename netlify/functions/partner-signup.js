const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
        const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
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

        // Generate a unique partner ID
        const partnerId = `PARTNER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Insert the partner application into the database
        const { data: partner, error } = await supabase
            .from('sweet_cash_partners')
            .insert([
                {
                    partner_id: partnerId,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    email: data.email,
                    phone: data.phone,
                    business_name: data.businessName || null,
                    business_type: data.businessType || null,
                    website: data.website || null,
                    instagram: data.instagram || null,
                    facebook: data.facebook || null,
                    twitter: data.twitter || null,
                    experience: data.experience || null,
                    goals: data.goals || null,
                    referral_source: data.referral || null,
                    status: 'pending',
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) {
            console.error('Supabase error:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: 'Error saving partner application',
                    details: error.message
                })
            };
        }

        // Send confirmation email (implement your email service here)
        // Example using SendGrid or similar service
        // await sendConfirmationEmail(data.email, partnerId);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Partner application submitted successfully',
                partnerId: partnerId
            })
        };

    } catch (error) {
        console.error('Error processing partner signup:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Error processing partner signup',
                details: error.message
            })
        };
    }
}; 