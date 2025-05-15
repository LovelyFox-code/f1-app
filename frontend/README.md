# Frontend - F1 World Champions SPA

This is the **Next.js** frontend for the Formula 1 World Champions app (2005–present).  
It shows a list of F1 champions by season and race winners per season.

---

## Features

- Displays F1 World Champions from 2005 to the current year
- Click a season to see all race winners that year
- Highlights races won by the season’s champion
- Fetches data from the backend API
- Handles loading states, errors, and empty data gracefully
- Built with Next.js 13 (app router), React, and TypeScript
- Tested with Vitest (unit + component tests)
- Styled with Tailwind CSS

---

## Getting Started

### Prerequisites

- Node.js (>=16 recommended)
- npm or yarn
- Backend API running locally or remotely

### Installation

Clone the repo and install dependencies:

```bash
cd frontend
npm install
# or
yarn install
```

Running Locally
Start the development server:

```bash
npm run dev
# or
yarn dev
```

Building for Production

```bash
npm run build
npm start
```

Project Structure

```
/src
  /app           # Next.js app router pages and layouts
    /seasons     # Season list and season-specific race winners
  /components    # Reusable UI components
  /hooks         # Custom React hooks (e.g., API calls)
  /lib           # API clients and utilities
  /context       # React Context providers for global state
  /styles        # Global styles and Tailwind CSS config
  /types         # TypeScript types and interfaces
  /tests         # Unit and component tests
/public      # Static assets (images, favicon)
```
