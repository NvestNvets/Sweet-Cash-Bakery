// Sends SMS confirmations to customer and baker

const twilio = require('twilio');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { to, message } = JSON.parse(event.body);

        // Initialize Twilio client
        const client = twilio(
            process.env.TWILIO_SID,
            process.env.TWILIO_TOKEN
        );

        // Send SMS
        const result = await client.messages.create({
            body: message,
            to: to,
            from: process.env.TWILIO_PHONE
        });

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                messageId: result.sid
            })
        };
    } catch (error) {
        console.error('Error sending SMS:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to send SMS',
                details: error.message
            })
        };
    }
};