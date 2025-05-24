const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
    // Only allow GET
    if (event.httpMethod !== "GET") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_SERVICE_ROLE_KEY
        );

        const zip_code = event.queryStringParameters.zip_code;

        if (!zip_code) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "ZIP code is required"
                })
            };
        }

        // Find verified partners in the ZIP code
        const { data: partners, error } = await supabase
            .from('sweet_cash_partners')
            .select('id, name, phone, email')
            .eq('zip_code', zip_code)
            .eq('is_verified', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return {
            statusCode: 200,
            body: JSON.stringify({
                partners: partners || []
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