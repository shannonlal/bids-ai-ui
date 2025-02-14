# Technical Context

## Technology Stack

### Core Technologies

1. Frontend Framework

   - Next.js (React framework)
   - TypeScript for type safety
   - TailwindCSS for styling

2. Backend Services

   - Next.js API Routes
   - MongoDB for data persistence
   - OpenAI integration for AI features

3. Testing Framework
   - Vitest for unit and component testing
   - React Testing Library for component tests
   - Custom test utilities and mocks

## Development Environment

### Node Version

- .nvmrc specifies the Node.js version requirement
- Project uses modern Node.js features

### Package Management

- PNPM as package manager
- pnpm-lock.yaml for dependency versioning
- Structured workspace configuration

### Code Quality Tools

1. ESLint Configuration

   ```
   .eslintrc.json
   .eslintignore
   ```

   - TypeScript-specific rules
   - React hooks rules
   - Import sorting
   - Accessibility rules

2. Prettier Configuration
   ```
   .prettierrc
   .prettierignore
   ```
   - Consistent code formatting
   - Integration with ESLint

### TypeScript Configuration

- tsconfig.json with strict mode
- Next.js specific configuration
- Path aliases
- Type checking settings

## Project Dependencies

### Production Dependencies

1. Core Framework

   - next
   - react
   - react-dom
   - typescript

2. Styling

   - tailwindcss
   - postcss
   - autoprefixer

3. Database

   - mongodb
   - mongoose (types)

4. Utilities
   - gsap for animations
   - axios for HTTP requests
   - date-fns for date handling

### Development Dependencies

1. Testing

   - vitest
   - @testing-library/react
   - @testing-library/user-event
   - jsdom

2. Code Quality

   - eslint
   - prettier
   - typescript-eslint
   - various eslint plugins

3. Types
   - @types/react
   - @types/node
   - other type definitions

## API Integration

### OpenAI Integration

- Story generation
- Question generation
- Response validation
- Configuration through environment variables

### MongoDB Integration

1. Connection

   - Environment-based configuration
   - Connection pooling
   - Error handling

2. Models
   - User model
   - Story model
   - Answer model
   - GradeLevel model

## Environment Configuration

### Environment Variables

```
# Sample from .env-sample
DATABASE_URL=
OPENAI_API_KEY=
NEXT_PUBLIC_API_URL=
```

### Configuration Files

1. next.config.js

   - Next.js specific configuration
   - Environment variable exposure
   - Build optimization settings

2. postcss.config.js

   - PostCSS plugins
   - TailwindCSS configuration

3. tailwind.config.js
   - Custom theme configuration
   - Plugin configuration
   - Content paths

## Build & Deployment

### Build Configuration

- TypeScript compilation
- Next.js optimization
- Static file handling
- API route bundling

### Testing Setup

1. Vitest Configuration

   ```
   vitest.config.ts
   src/test/setup.ts
   ```

   - Test environment setup
   - Mock configurations
   - Coverage settings

2. Test Utilities
   - Custom test hooks
   - Mock implementations
   - Test helpers

This technical context serves as a reference for understanding the technical foundation and requirements of the Bids AI platform.
