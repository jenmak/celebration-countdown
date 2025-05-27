# Celebration Countdown

A modern web application to help you never miss a birthday celebration. Built with Next.js, React, and Tailwind CSS.

## Features

- User authentication with Auth0
- Calendar and table views for birthdays
- Real-time collaboration on birthday details
- Customizable birthday notifications
- Responsive design for all devices
- Accessibility features for older demographics and children

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Auth0 account
- PostgreSQL database

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_AUTH0_DOMAIN=your-auth0-domain
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-auth0-client-id
DATABASE_URL=your-postgresql-connection-string
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/celebration-countdown.git
cd celebration-countdown
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable React components
├── lib/             # Utility functions and shared logic
├── prisma/          # Database schema and migrations
└── types/           # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 