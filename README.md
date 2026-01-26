# Process Pilot

A modern SaaS platform for AI-powered business process automation, built with React, TypeScript, and Supabase.

## Overview

Process Pilot helps businesses automate repetitive tasks using Make.com integrations. Customers submit automation requests, pay for implementation, and receive fully configured solutions.

**Website:** [processpilot.co.uk](https://processpilot.co.uk)

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui, Radix UI
- **State Management:** TanStack React Query
- **Forms:** React Hook Form + Zod validation
- **Backend:** Supabase (PostgreSQL + Edge Functions)
- **Payments:** Stripe
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/J88SXN/Process_Pilot_LIVE.git
   cd Process_Pilot_LIVE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

   Fill in the required values:
   ```
   VITE_SUPABASE_PROJECT_ID=your_project_id
   VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
   VITE_SUPABASE_URL=https://your_project.supabase.co
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:8080`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run build:dev` | Create development build with sourcemaps |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── ui/          # shadcn/ui component library
├── hooks/           # Custom React hooks
├── integrations/    # External service integrations (Supabase)
├── layouts/         # Page layout components
├── lib/             # Utility functions
├── pages/           # Route page components
└── types/           # TypeScript type definitions

supabase/
├── functions/       # Edge functions (serverless backend)
└── migrations/      # Database migrations
```

## Key Features

- **User Authentication:** Secure sign-up/login via Supabase Auth
- **Request Management:** Submit and track automation requests
- **Admin Dashboard:** Manage all customer requests
- **Payment Processing:** Stripe integration for secure payments
- **Dark/Light Mode:** Theme switching support
- **Responsive Design:** Mobile-first approach

## Pages & Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/about` | About page |
| `/pricing` | Pricing calculator |
| `/request` | Submit automation request |
| `/dashboard` | User dashboard |
| `/auth` | Authentication |
| `/admin` | Admin dashboard |

## Database Schema

The app uses Supabase with the following main tables:

- `profiles` - User profile information
- `user_roles` - Role-based access control
- `requests` - Automation requests
- `payments` - Payment records
- `platform_credentials` - Encrypted API credentials

## Edge Functions

- `create-payment-intent` - Stripe payment processing
- `send-request-confirmation` - Email confirmations
- `send-request-update` - Status update notifications
- `send-meeting-request` - Meeting scheduling
- `handle-credentials` - Secure credential management

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our development process and how to submit pull requests.

## License

This project is private and proprietary.
