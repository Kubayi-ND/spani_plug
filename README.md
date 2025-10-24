# Uber-Spani Platform

A comprehensive service provider marketplace platform built with React, TypeScript, Express.js, and Supabase.

## Project Structure

```
uber-spani/
├── backend/              # Express.js API server
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Express middleware
│   │   ├── models/      # Data models
│   │   ├── utils/       # Utility functions
│   │   ├── app.ts       # Express app setup
│   │   └── server.ts    # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
├── frontend/            # React + Vite application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # API service layer
│   │   ├── utils/       # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
├── docs/                # Documentation and migrations
│   └── migrations/      # Database migrations
├── .gitignore
└── README.md
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` with your Supabase credentials

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example` with your Supabase credentials

4. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-ui
- **State Management**: React Hooks + React Query

## Features

- Service provider discovery and ratings
- Location-based search
- User profiles (customers and providers)
- Service request management
- Social review feed
- Admin dashboard

## Development

### Backend Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Frontend Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

### Backend (.env)
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
PORT=3000
NODE_ENV=development
```

### Frontend (.env)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Push to your branch
4. Create a pull request

## License

MIT
