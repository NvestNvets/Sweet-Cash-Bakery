const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
    // Only allow POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const { product_name, quantity, zip_code, delivery_option, customer_name, customer_phone } = JSON.parse(event.body);

        // First, find a partner in the customer's zip code
        const { data: partners, error: partnerError } = await supabase
            .from('sweet_cash_partners')
            .select('id')
            .eq('zip_code', zip_code)
            .eq('is_verified', true)
            .limit(1);

        if (partnerError) throw partnerError;

        const partner_id = partners.length > 0 ? partners[0].id : null;

        // Log the order
        const { data, error } = await supabase
            .from('sweet_cash_orders')
            .insert([
                {
                    product_name,
                    quantity,
                    zip_code,
                    delivery_option,
                    customer_name,
                    customer_phone,
                    partner_id
                }
            ])
            .select();

        if (error) throw error;

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Order logged successfully",
                order: data[0]
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message
            })
        };
    }
};