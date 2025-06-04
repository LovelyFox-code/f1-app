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
- Built with Next.js 15 (app router), React, and TypeScript
- Tested with Vitest (unit + component tests)
- Styled with Module CSS

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

```bash
/src
  /app           # Next.js app router pages and layouts
    /seasons     # Season list and season-specific race winners
  /components    # Reusable UI components
  /hooks         # Custom React hooks (e.g., API calls)
  /lib           # API clients and utilities
  /context       # React Context providers for global state
  /styles        # Global styles and Module CSS config
  /types         # TypeScript types and interfaces
  /tests         # Unit and component tests
/public      # Static assets (images, favicon)
```

## Architecture Overview

### Frontend Design

1. **Next.js with App Router**

   - **Decision**: Using Next.js 15 with the App Router for improved performance and SEO.
   - **Reasoning**: The App Router provides a more intuitive routing system based on the filesystem, built-in support for layouts, and improved server components. This architecture allows us to optimize rendering strategies per route and leverage React Server Components for better performance.
   - **Trade-offs**: App Router is newer and may have fewer resources compared to Pages Router, but offers better performance and more modern architecture.

2. **Module CSS**

   - **Decision**: Using module CSS for component styling.
   - **Reasoning**: Module CSS provides automatic class name scoping to prevent style conflicts while keeping the benefits of standard CSS. This approach allows us to use familiar CSS syntax without runtime overhead, and the build process optimizes the CSS for production.
   - **Trade-offs**: Module CSS provides good component encapsulation without runtime overhead, but doesn't offer the dynamic capabilities of CSS-in-JS libraries like Styled Components.

3. **React Query**

   - **Decision**: Using React Query for data fetching and caching.
   - **Reasoning**: Formula 1 data requires complex state management for fetching, caching, and synchronizing server state. React Query provides built-in solutions for loading states, error handling, refetching, and cache invalidation, which would otherwise require significant custom code.
   - **Trade-offs**: Adds a small bundle size overhead but provides significant benefits for data management, caching, and synchronization.

4. **Vitest**

   - **Decision**: Using Vitest for testing instead of Jest.
   - **Reasoning**: Vitest offers better performance and native ESM support, which aligns well with our modern JavaScript approach. It provides a similar API to Jest, making the transition easy, while offering improved speed for the test suite.
   - **Trade-offs**: Vitest is faster and works better with ESM, but has a smaller ecosystem than Jest.

5. **Component Architecture**

   - **Decision**: Building a component library with clear separation of concerns.
   - **Reasoning**: Breaking the UI into reusable components improves maintainability and consistency across the application. Components are designed to be self-contained with their own styles and tests, making them easier to develop, test, and reuse.
   - **Trade-offs**: Requires more initial setup but leads to better code organization and reusability.

6. **CSS Variables for Theming**
   - **Decision**: Using CSS variables for consistent styling and potential theme support.
   - **Reasoning**: CSS variables provide a centralized way to manage design tokens like colors, spacing, and typography. This approach ensures visual consistency and makes it easier to implement theme switching in the future.
   - **Trade-offs**: Requires more upfront planning but creates a more maintainable design system.

### Performance Considerations

- **Load More Pattern**: Implementing pagination with a "Load More" button for the seasons list to avoid loading all data at once
- **Optimized Rendering**: Using React's memo and useMemo to prevent unnecessary re-renders
- **Error Boundaries**: Implementing error boundaries to prevent the entire application from crashing due to component errors
- **Responsive Design**: Ensuring the application works well on various screen sizes without performance degradation

### Testing Strategy

- **Component Testing**: Using React Testing Library to test components in a way that resembles user interactions
- **Unit Testing**: Testing utility functions and hooks in isolation to ensure they work correctly
- **Coverage Thresholds**: Enforcing minimum test coverage (80%) to maintain code quality
- **Test Organization**: Keeping tests close to the code they test for better maintainability
- **Mock Services**: Using mocks for API services to test components without actual network requests

### Accessibility Considerations

- **Semantic HTML**: Using appropriate HTML elements for their intended purpose
- **ARIA Attributes**: Adding ARIA roles and attributes where necessary
- **Keyboard Navigation**: Ensuring all interactive elements are keyboard accessible
- **Focus Management**: Properly managing focus for improved screen reader experience
- **Color Contrast**: Ensuring sufficient contrast ratios for text and interactive elements

### Recommendations for Improvement

- Add end-to-end tests with Playwright or Cypress to catch integration issues
- Implement Storybook for component documentation and visual testing
- Enhance accessibility features and add automated accessibility testing
- Add analytics to track user behavior and identify improvement opportunities
- Implement internationalization for supporting multiple languages
- Add progressive enhancement for offline capabilities
