# Uber-Spani Backend

Backend services for the Uber-Spani platform, built with Express.js and TypeScript.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   npm start
   ```

## Project Structure

- `src/config/` - Configuration files (Supabase client, etc.)
- `src/controllers/` - Route controllers
- `src/routes/` - API routes
- `src/middleware/` - Express middleware
- `src/models/` - Data models
- `src/utils/` - Utility functions
- `src/app.ts` - Express app setup
- `src/server.ts` - Server entry point
