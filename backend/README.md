# Formula 1 Backend API

This is the backend service for the Formula 1 application, providing a RESTful API to access Formula 1 data including seasons and races.

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

## Running the Backend from root

```bash
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

## Architecture Overview

### Backend Design

1. **Express.js**

   - **Decision**: Using Express.js for the API server.
   - **Reasoning**: Express provides a minimal, flexible framework that allows for precise control over the application structure while maintaining high performance. Its widespread adoption ensures good community support and a rich ecosystem of middleware.
   - **Trade-offs**: Express is lightweight and has a large ecosystem, but requires more manual setup compared to full frameworks like NestJS.

2. **MongoDB**

   - **Decision**: Using MongoDB for data storage.
   - **Reasoning**: The Formula 1 data model has hierarchical relationships (seasons > races > results) that map well to MongoDB's document structure. The schema flexibility allows us to easily accommodate changes in the external API's data format over time.
   - **Trade-offs**: MongoDB provides flexibility for schema evolution and good performance for read-heavy workloads, but lacks the strict consistency guarantees of relational databases.

3. **Service Layer Architecture**

   - **Decision**: Using a clear separation between routes, services, and models.
   - **Reasoning**: This separation of concerns improves maintainability by isolating business logic from request handling and data access. It also facilitates testing by allowing components to be tested in isolation.
   - **Trade-offs**: Increases code organization and maintainability but adds some boilerplate code.

4. **Rate Limiting and Retry Logic**

   - **Decision**: Implementing custom retry logic with exponential backoff for external API calls.
   - **Reasoning**: The Ergast F1 API has rate limits, and our application needs to be resilient to temporary network issues. The exponential backoff strategy prevents overwhelming the external API during recovery from outages.
   - **Trade-offs**: Improves resilience but adds complexity to the codebase.

5. **Data Caching Strategy**
   - **Decision**: Storing F1 data in MongoDB rather than fetching it on demand.
   - **Reasoning**: Formula 1 data is relatively static (especially for past seasons), making it ideal for caching. This approach reduces dependency on the external API, improves response times, and allows the application to function even if the external API is temporarily unavailable.
   - **Trade-offs**: Requires additional storage and synchronization logic but significantly improves performance and reliability.

### Performance Considerations

- **MongoDB Indexing**: Strategic indexes on frequently queried fields (season, round) to optimize query performance
- **Pagination**: Support for paginated results to handle large data sets efficiently
- **Batch Processing**: Using p-limit to control concurrency when fetching data from external APIs
- **Efficient Data Fetching**: Minimizing external API calls by fetching only what's needed and storing results

### Recommendations for Improvement

- Implement more comprehensive API validation with a schema validation library like Zod
- Add request logging middleware for better debugging and monitoring
- Implement more sophisticated caching for external API calls with TTL-based invalidation
- Add health check endpoints for monitoring application status
- Implement API versioning to support future changes without breaking existing clients
- Add more comprehensive error handling with custom error classes

## Request Validation

The API uses express-validator for request validation. This ensures that all incoming requests meet the expected format and contain valid data before they reach the controllers.

### How it works

1. Validation rules are defined in the `middleware` directory:

   - `validation.ts`: Contains the core validation middleware
   - `season-validators.ts`: Contains validation rules for season-related endpoints
   - `race-validators.ts`: Contains validation rules for race-related endpoints

2. The validation middleware is applied to routes in `routes/seasons-routes.ts`

3. When a request fails validation, a 400 Bad Request response is sent with detailed error information
