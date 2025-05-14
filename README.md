# SaaSify Pro - Link Shortener Service

SaaSify Pro is a modern, full-featured link shortener service built with Next.js, Supabase, and React. It allows users to create, manage, and track shortened URLs for marketing campaigns, social media, or any other use case requiring concise links.

## Features

- **User Authentication**: Secure sign-up/sign-in with email/password and OAuth providers
- **Link Management**: Create, update, delete, and view shortened links
- **Link Analytics**: Track clicks and device usage (mobile vs desktop)
- **Custom Short URLs**: Choose your own custom short paths for better branding
- **Dashboard**: Visualize link performance with interactive charts
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Multi-Factor Authentication**: Enhanced security for user accounts
- **Internationalization**: Support for multiple languages

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **Backend**: Next.js API routes, Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **State Management**: React Query (TanStack Query)
- **Form Management**: React Hook Form with Zod validation
- **UI Components**: Shadcn UI with Radix primitives
- **Charts**: Recharts for data visualization

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account and project

### Environment Setup

1. Copy the `.env.example` file to `.env.local` and update the values:
   ```
   cp .env .env.local
   ```

2. Update the following environment variables:
   - `NEXT_PUBLIC_SITE_URL`: Your site URL (http://localhost:3000 for development)
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Installation

```bash
# Install dependencies
pnpm install

# Start Supabase local development
pnpm supabase:start

# Generate TypeScript types from Supabase
pnpm supabase:typegen

# Run the development server
pnpm dev
```

### Database Setup

The application requires a Supabase database with the appropriate schema. Run the migrations with:

```bash
pnpm supabase:reset
```

## Project Structure

- `/app`: Next.js application routes
  - `/(marketing)`: Marketing/landing pages
  - `/auth`: Authentication pages
  - `/home`: Application dashboard and features
  - `/api`: API routes
  - `/go`: Link redirection service
- `/components`: Reusable React components
- `/config`: Application configuration
- `/hooks`: Custom React hooks
- `/lib`: Utility functions and server-side logic
- `/public`: Static assets and localization files
- `/supabase`: Supabase migrations and configuration

## Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build the application
- `pnpm start`: Start production server
- `pnpm lint`: Run linting
- `pnpm typecheck`: Run type checking
- `pnpm supabase:start`: Start local Supabase
- `pnpm supabase:stop`: Stop local Supabase
- `pnpm supabase:reset`: Reset Supabase database
- `pnpm supabase:typegen`: Generate TypeScript types

## Deployment

### Build for Production

```bash
pnpm build
```

### Deploy to Production

The application can be deployed to Vercel, Netlify, or any other Next.js-compatible hosting service.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some feature'`)
5. Push to the branch (`git push origin feature/your-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License. See the LICENSE file for details.
