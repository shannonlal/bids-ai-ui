# Effort Diary Feature Documentation

## Overview

The Effort Diary feature allows users to track and manage their daily efforts through a simple, intuitive interface. This feature integrates with the platform's authentication system (see [Authentication Feature](./authentication.md)) and follows the established architectural patterns of the Bids AI platform.

## Architecture

### Database Schema

```typescript
const EffortSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
```

### API Design

#### Endpoints

1. POST /api/efforts

   - Creates a new effort entry
   - Protected by authentication
   - Request body: { description: string, date?: string }
   - Response: { status: number, effort: EffortType }

2. GET /api/efforts
   - Retrieves efforts for a specific date
   - Protected by authentication
   - Query params: date (optional, defaults to current date)
   - Response: { status: number, efforts: EffortType[] }

### Component Structure

```
src/
├── components/
│   └── effort-diary/
│       ├── EffortDiaryContext.tsx
│       ├── EffortDiaryView.tsx
│       ├── EffortInput.tsx
│       └── EffortList.tsx
├── pages/
│   └── effort-diary/
│       └── index.tsx
├── services/
│   └── effortService.ts
├── models/
│   └── Effort.ts
└── types/
    └── effort.ts
```

## Implementation Plan

### Phase 1: Database and Core Models (1-2 days)

- Implement Effort model
- Define TypeScript interfaces
- Set up database schema

### Phase 2: API Layer Implementation (2-3 days)

- Create effort service
- Implement API routes with authentication
- Add validation middleware

### Phase 3: UI Components (3-4 days)

- Create EffortDiaryContext
- Build core components
- Implement state management

### Phase 4: Pages and Integration (2-3 days)

- Create main pages
- Integrate with layout
- Add navigation
- Implement authentication checks

### Phase 5: Testing and Documentation (2-3 days)

- Write comprehensive tests
- Add API documentation
- Update project documentation

### Phase 6: Optimization and Polish (2-3 days)

- Performance optimization
- UX improvements
- Mobile responsiveness

Total Estimated Time: 12-18 days

## Technical Considerations

### State Management

- Uses React Context for feature-specific state
- Implements custom hooks for business logic
- Follows established patterns for API interactions

### Security

- Protected routes using authentication middleware
- User-specific data isolation
- Input validation and sanitization

### Testing Strategy

- Unit tests for services and utilities
- Component testing with React Testing Library
- API route testing
- Integration tests for key workflows

### Performance

- Optimized database queries
- Proper loading states
- Error boundaries
- Caching implementation

## Integration Points

### Authentication System

- Uses isAuthenticated middleware from authentication feature
- Integrates with user session management
- Leverages user context for identification

### UI/UX

- Consistent with existing design system
- Uses shared UI components
- Mobile-first responsive design
- Follows established navigation patterns

## Example Implementation

### EffortDiaryContext

```typescript
// src/components/effort-diary/EffortDiaryContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { EffortType } from '../../types/effort';

interface EffortDiaryContextType {
  efforts: EffortType[];
  loading: boolean;
  error: string | null;
  addEffort: (description: string) => Promise<void>;
  loadEfforts: (date?: string) => Promise<void>;
}

const EffortDiaryContext = createContext<EffortDiaryContextType | undefined>(undefined);

export const EffortDiaryProvider: React.FC = ({ children }) => {
  const [efforts, setEfforts] = useState<EffortType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEfforts = useCallback(async (date?: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/efforts${date ? `?date=${date}` : ''}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setEfforts(data.efforts);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addEffort = useCallback(async (description: string) => {
    try {
      const response = await fetch('/api/efforts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setEfforts(prev => [data.effort, ...prev]);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  return (
    <EffortDiaryContext.Provider value={{
      efforts,
      loading,
      error,
      addEffort,
      loadEfforts
    }}>
      {children}
    </EffortDiaryContext.Provider>
  );
};

export const useEffortDiary = () => {
  const context = useContext(EffortDiaryContext);
  if (context === undefined) {
    throw new Error('useEffortDiary must be used within an EffortDiaryProvider');
  }
  return context;
};
```

### Protected API Route

```typescript
// src/pages/api/efforts/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import middleware from '../../../middleware';
import { isAuthenticated } from '../../../middleware/authenticate';
import sessionMiddleware from '../../../lib/session';
import { effortService } from '../../../services/effortService';

const handler = nextConnect().use(middleware).use(sessionMiddleware).use(isAuthenticated);

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const effort = await effortService.createEffort(req.user._id, req.body);
    res.status(201).json({ status: 201, effort });
  } catch (error) {
    res.status(500).json({ status: 500, error: 'Failed to create effort' });
  }
});

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const date = req.query.date ? new Date(req.query.date as string) : new Date();
    const efforts = await effortService.getEffortsByDate(req.user._id, date);
    res.status(200).json({ status: 200, efforts });
  } catch (error) {
    res.status(500).json({ status: 500, error: 'Failed to fetch efforts' });
  }
});

export default handler;
```

## Future Considerations

### Feature Enhancements

1. Advanced filtering and search
2. Effort categories/tags
3. Analytics and reporting
4. Batch operations
5. Export functionality

### Scalability Considerations

1. Database indexing strategy
2. Query optimization
3. Caching implementation
4. Load balancing preparation

This documentation serves as a comprehensive guide for implementing and maintaining the Effort Diary feature within the Bids AI platform.
