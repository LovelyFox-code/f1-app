# Formula 1 Backend API

This is the backend service for the Formula 1 application, providing a RESTful API to access Formula 1 data including seasons, races, and champions.

## Features

- RESTful API endpoints for Formula 1 data
- MongoDB database integration
- Swagger API documentation
- Test suite
- Error handling

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

## API Documentation

The API documentation is available at `/api/docs` when the server is running or `docs/swagger.yaml` offline. It provides detailed information about all available endpoints, request/response formats, and example usage.

### Main Endpoints

- `GET /api/seasons` - Get all seasons
- `GET /api/seasons/:season` - Get season data for a specific season
- `GET /api/seasons/:season/races` - Get races for a specific season

## Testing

The project uses Jest for testing. The test suite includes unit tests, integration tests, and API endpoint tests.

### Running Tests

```bash
# Run all tests
npm run test:backend

# Run tests in watch mode
npm run test:backend:watch

# Run tests with coverage
npm run test:backend:coverage
```

### Test Structure

- `__tests__/models/` - Model unit tests
- `__tests__/services/` - Service layer tests
- `__tests__/routes/` - API endpoint tests

## Project Structure

```
backend/
├── __tests__/           # Test files
├── docs/               # API documentation
├── models/            # Mongoose models
├── routes/            # Express routes
├── services/          # Service layer of the application
├── app.ts            # Express application setup
├── server.ts         # Server entry point
└── tsconfig.json     # TypeScript configuration
```
