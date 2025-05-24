const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

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

        const { partner_id, product_name } = JSON.parse(event.body);

        // Generate unique affiliate code
        const affiliateCode = crypto.randomBytes(4).toString('hex');
        
        // Generate three different types of links
        const links = {
            product: `https://sweetcashbakery.com/products/${product_name}?ref=${affiliateCode}`,
            kit: `https://sweetcashbakery.com/kits/${product_name}?ref=${affiliateCode}`,
            catering: `https://sweetcashbakery.com/catering/${product_name}?ref=${affiliateCode}`
        };

        // Store the affiliate code in Supabase
        const { error } = await supabase
            .from('partner_affiliate_codes')
            .insert([
                {
                    partner_id,
                    product_name,
                    affiliate_code: affiliateCode,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Affiliate links generated successfully",
                links
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