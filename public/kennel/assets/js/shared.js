// Shared functionality for all K9 tools

// SMS functionality
async function sendSMS(phoneNumber, message) {
    try {
        const response = await fetch('/.netlify/functions/sendSMS', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: phoneNumber,
                message: message
            })
        });

        if (!response.ok) {
            throw new Error('SMS sending failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw error;
    }
}

// Logging functionality
async function logUsage(k9Name, action, details = {}) {
    try {
        const response = await fetch('/.netlify/functions/logUsage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                k9Name,
                action,
                details,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error('Usage logging failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error logging usage:', error);
        throw error;
    }
}

// Language detection and management
function detectLanguage() {
    const userLang = navigator.language || navigator.userLanguage;
    return userLang.startsWith('es') ? 'es' : 'en';
}

// Error handling
function handleError(error, userMessage) {
    console.error(error);
    // Log the error
    logUsage('system', 'error', {
        error: error.message,
        stack: error.stack
    }).catch(console.error);
    
    // Show user-friendly message
    alert(userMessage || 'An error occurred. Please try again.');
}

// Export functions
window.K9Shared = {
    sendSMS,
    logUsage,
    detectLanguage,
    handleError
}; 