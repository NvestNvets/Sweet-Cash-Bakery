const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { k9Name, action, details, timestamp } = JSON.parse(event.body);

        // Initialize Supabase client
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_API_KEY
        );

        // Insert usage log
        const { data, error } = await supabase
            .from('k9_usage_logs')
            .insert([
                {
                    k9_name: k9Name,
                    action: action,
                    details: details,
                    timestamp: timestamp || new Date().toISOString()
                }
            ]);

        if (error) throw error;

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                data: data
            })
        };
    } catch (error) {
        console.error('Error logging usage:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to log usage',
                details: error.message
            })
        };
    }
}; 