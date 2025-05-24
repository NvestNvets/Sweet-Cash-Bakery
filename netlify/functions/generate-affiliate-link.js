const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

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
        if (!data.partnerId) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: 'Missing required field: partnerId'
                })
            };
        }

        // Verify partner exists and is active
        const { data: partner, error: partnerError } = await supabase
            .from('sweet_cash_partners')
            .select('*')
            .eq('partner_id', data.partnerId)
            .eq('status', 'active')
            .single();

        if (partnerError || !partner) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error: 'Partner not found or not active'
                })
            };
        }

        // Generate a unique affiliate code
        const affiliateCode = crypto.randomBytes(4).toString('hex').toUpperCase();

        // Store the affiliate code
        const { data: affiliate, error: affiliateError } = await supabase
            .from('partner_affiliate_codes')
            .insert([
                {
                    partner_id: data.partnerId,
                    affiliate_code: affiliateCode,
                    created_at: new Date().toISOString(),
                    is_active: true
                }
            ]);

        if (affiliateError) {
            console.error('Error saving affiliate code:', affiliateError);
            return {
                statusCode: 500,
                body: JSON.stringify({
                    error: 'Error generating affiliate link',
                    details: affiliateError.message
                })
            };
        }

        // Generate the affiliate link
        const baseUrl = process.env.SITE_URL || 'https://sweetcashbakery.com';
        const affiliateLink = `${baseUrl}/?ref=${affiliateCode}`;

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Affiliate link generated successfully',
                affiliateCode: affiliateCode,
                affiliateLink: affiliateLink
            })
        };

    } catch (error) {
        console.error('Error generating affiliate link:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Error generating affiliate link',
                details: error.message
            })
        };
    }
}; 