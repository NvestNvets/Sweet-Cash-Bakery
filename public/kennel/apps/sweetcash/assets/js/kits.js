// Shared functionality for kit pages
const K9Kits = {
    // Chat functionality
    chat: {
        drawer: null,
        input: null,
        messages: [],
        assistant_id: null,

        init(assistant_id) {
            this.assistant_id = assistant_id;
            this.drawer = document.getElementById('chatDrawer');
            this.input = this.drawer.querySelector('input');
            
            // Add event listeners
            this.drawer.querySelector('button.cta-button').addEventListener('click', () => this.sendMessage());
            this.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
        },

        open() {
            this.drawer.classList.add('open');
            this.input.focus();
        },

        close() {
            this.drawer.classList.remove('open');
        },

        async sendMessage() {
            const message = this.input.value.trim();
            if (!message) return;

            // Add user message to chat
            this.addMessage('user', message);
            this.input.value = '';

            try {
                // Placeholder for API call
                const response = await this.mockResponse(message);
                this.addMessage('assistant', response);
            } catch (error) {
                console.error('Error sending message:', error);
                this.addMessage('assistant', 'Sorry, I encountered an error. Please try again.');
            }
        },

        addMessage(role, content) {
            const messagesContainer = this.drawer.querySelector('.h-[400px]');
            const messageDiv = document.createElement('div');
            messageDiv.className = `mb-4 ${role === 'user' ? 'text-right' : 'text-left'}`;
            
            const bubble = document.createElement('div');
            bubble.className = `inline-block px-4 py-2 rounded-2xl ${
                role === 'user' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-100 text-gray-800'
            }`;
            bubble.textContent = content;
            
            messageDiv.appendChild(bubble);
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        },

        // Mock response for development
        async mockResponse(message) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(`I'm K9 Cooks, your baking assistant for ${this.assistant_id}. I'll help you with your baking questions!`);
                }, 1000);
            });
        }
    },

    // Share functionality
    share: {
        async shareKit(title, text, url) {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title,
                        text,
                        url
                    });
                } catch (error) {
                    console.error('Error sharing:', error);
                    this.copyToClipboard(url);
                }
            } else {
                this.copyToClipboard(url);
            }
        },

        copyToClipboard(text) {
            const dummy = document.createElement('input');
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            alert('Link copied to clipboard!');
        }
    },

    // Analytics
    analytics: {
        async logPageView(page, product, assistant_id) {
            try {
                await window.K9Shared.logUsage('Cooks', 'page_view', {
                    page,
                    product,
                    assistant_id
                });
            } catch (error) {
                console.warn('Failed to log page view:', error);
            }
        },

        async logAction(action, product, details = {}) {
            try {
                await window.K9Shared.logUsage('Cooks', action, {
                    product,
                    ...details
                });
            } catch (error) {
                console.warn('Failed to log action:', error);
            }
        }
    },

    // Initialize page
    initPage(options) {
        const {
            assistant_id,
            product_id,
            page_type,
            translations,
            defaultLang
        } = options;

        // Initialize chat
        this.chat.init(assistant_id);

        // Set up language toggle
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[defaultLang][key]) {
                element.textContent = translations[defaultLang][key];
            }
        });

        // Log page view
        this.analytics.logPageView(page_type, product_id, assistant_id);

        // Add event listeners
        document.querySelectorAll('button[onclick^="toggleLanguage"]').forEach(button => {
            button.addEventListener('click', (e) => {
                const lang = e.target.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.toggleLanguage(lang, translations);
            });
        });
    },

    // Language toggle
    toggleLanguage(lang, translations) {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }
}; 