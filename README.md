# Sweet Ca$h Bakery Platform

A scalable, mobile-first food commerce platform for Sweet Ca$h Bakery, featuring product pages, DIY kits, catering options, and partner management.

## Features

- 🍪 5 flagship product pages with beautiful UI
- 🎁 3-tier product flow (Buy Fresh, DIY Kit, Catering)
- 👥 Partner earnings & onboarding system
- 📱 SMS notifications for customers and partners
- 🔗 Affiliate link generation and tracking
- 📊 Order logging and analytics

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Netlify Functions
- Database: Supabase
- SMS: Twilio
- Deployment: Netlify

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sweet-cash-bakery.git
cd sweet-cash-bakery
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_API_KEY=your_supabase_api_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
PAYPAL_LINK=your_paypal_link
```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL commands from `supabase/schema.sql`
   - Enable the required extensions

5. Local development:
```bash
npm run dev
```

## Deployment

1. Push to GitHub:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

2. Deploy to Netlify:
```bash
netlify deploy --prod
```

3. Import environment variables to Netlify:
```bash
netlify env:import .env
```

## Project Structure

```
sweet-cash-bakery/
├── public/
│   └── sweetcash/
│       ├── assets/
│       │   ├── css/
│       │   └── images/
│       ├── components/
│       ├── products/
│       ├── kits/
│       └── catering/
├── netlify/
│   └── functions/
├── supabase/
│   └── schema.sql
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 