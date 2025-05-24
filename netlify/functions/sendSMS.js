// Sends SMS confirmations to customer and baker

const twilio = require('twilio');

exports.handler = async function(event, context) {
    // Only allow POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const client = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );

        const { customer_phone, partner_phone, order_details } = JSON.parse(event.body);

        // Send SMS to customer
        await client.messages.create({
            body: `Thank you for your order at Sweet Ca$h Bakery! Your ${order_details.product_name} will be ready soon. Order #${order_details.id}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: customer_phone
        });

        // Send SMS to partner if available
        if (partner_phone) {
            await client.messages.create({
                body: `New order received! ${order_details.quantity}x ${order_details.product_name} for ${order_details.customer_name}. Order #${order_details.id}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: partner_phone
            });
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "SMS notifications sent successfully"
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