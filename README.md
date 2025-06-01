# Formula 1 World Champions

A web application that displays Formula 1 World Champions from 2005 to the present year, along with race winners and championship details.

[Mermaid diagram](https://www.mermaidchart.com/raw/9c200bce-45e1-4dd7-b734-e4fb2d554713?theme=light&version=v0.1&format=svg)

## Features

- View Formula 1 World Champions from 2005 to present
- See all grand prix winners for each season
- Highlighted race winners who are also season champions
- Responsive design for both desktop and mobile
- Real-time data from the Ergast Developer API
- Local data persistence with MongoDB

## Prerequisites

- Docker and Docker Compose
- Node.js 20 or later (for local development)

## Getting Started

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd formula-1
   ```

2. Start the application using Docker Compose:

   ```bash
   docker-compose up
   ```

   This will start:

   - Frontend (Next.js) on http://localhost:3000
   - Backend (Express) on http://localhost:5001
   - MongoDB on localhost:27017

3. For local development without Docker:

   ```bash
   # Start the backend
   cd backend
   npm install
   npm run dev

   # Start the frontend
   cd frontend
   npm install
   npm run dev
   ```

## Project Structure

```
formula-1/
├── frontend/           # Next.js frontend application
├── backend/           # Express.js backend API
├── infrastructure/    # Infrastructure and deployment configs
└── docker-compose.yml # Docker Compose configuration
```

## API Endpoints

- `GET /api/seasons` - Get all seasons from 2005 to present
- `GET /api/seasons/:season` - Get details for a specific season
- `GET /api/seasons/:season/races` - Get all races for a season

## Development

### Backend

The backend is built with:

- Express.js
- TypeScript
- MongoDB with Mongoose
- Swagger for API documentation

### Frontend

The frontend is built with:

- Next.js
- TypeScript
- Module CSS
