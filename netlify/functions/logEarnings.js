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

        const { partner_id, order_amount, sales_tax } = JSON.parse(event.body);

        // Get current earnings record
        const { data: currentEarnings, error: fetchError } = await supabase
            .from('partner_earnings')
            .select('*')
            .eq('partner_id', partner_id)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

        if (currentEarnings) {
            // Update existing record
            const { error: updateError } = await supabase
                .from('partner_earnings')
                .update({
                    ytd_earnings: currentEarnings.ytd_earnings + order_amount,
                    sales_tax_collected: currentEarnings.sales_tax_collected + sales_tax,
                    orders_completed: currentEarnings.orders_completed + 1,
                    last_updated: new Date().toISOString()
                })
                .eq('partner_id', partner_id);

            if (updateError) throw updateError;
        } else {
            // Create new record
            const { error: insertError } = await supabase
                .from('partner_earnings')
                .insert([
                    {
                        partner_id,
                        ytd_earnings: order_amount,
                        sales_tax_collected: sales_tax,
                        orders_completed: 1
                    }
                ]);

            if (insertError) throw insertError;
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Earnings logged successfully"
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