# Authentication Feature Documentation

## Overview

The Authentication feature provides secure user authentication using Passport.js integrated with Next.js. This feature serves as the foundation for protecting routes and managing user sessions across the application.

## Authentication Implementation

### Passport.js Integration

#### 1. Dependencies

```bash
npm install passport passport-local @types/passport @types/passport-local next-auth bcryptjs @types/bcryptjs express-session @types/express-session connect-mongo
```

#### 2. Authentication Setup

```typescript
// src/lib/passport.ts
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (
      email: string,
      password: string,
      done: (error: any, user?: any, options?: { message: string }) => void
    ) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password' });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: IUserDocument, done: (err: any, id?: string) => void) => {
  done(null, user._id.toString()); // Convert ObjectId to string
});

passport.deserializeUser(
  async (id: string, done: (err: any, user?: IUserDocument | false) => void) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(new Error('User not found'));
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

export default passport;
```

#### 3. Session Configuration

```typescript
// src/lib/session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import session from 'express-session';
import MongoStore from 'connect-mongo';

declare module 'next' {
  interface NextApiRequest {
    session: any;
    user?: any;
  }
}

const sessionMiddleware = nextConnect()
  .use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        collection: 'sessions',
      }),
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      },
    })
  )
  .use(passport.initialize())
  .use(passport.session());

export default sessionMiddleware;
```

#### 4. API Routes

```typescript
// src/pages/api/auth/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import passport from '../../../lib/passport';
import sessionMiddleware from '../../../lib/session';

const handler = nextConnect()
  .use(sessionMiddleware)
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (!user) {
          return res.status(401).json({ error: info.message });
        }
        req.logIn(user, err => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          return res.status(200).json({ user });
        });
      })(req, res);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

export default handler;
```

```typescript
// src/pages/api/auth/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import sessionMiddleware from '../../../lib/session';

const handler = nextConnect()
  .use(sessionMiddleware)
  .post((req: NextApiRequest, res: NextApiResponse) => {
    req.logout();
    res.status(200).json({ message: 'Logged out successfully' });
  });

export default handler;
```

#### 5. Authentication Middleware

```typescript
// src/middleware/authenticate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';

export function isAuthenticated(req: NextApiRequest, res: NextApiResponse, next: NextHandler) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
}
```

#### 6. Login Component

```typescript
// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      router.push('/dashboard'); // Redirect after login
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Sign In
      </button>
    </form>
  );
};
```

### Environment Variables

Add these variables to your `.env` file:

```
SESSION_SECRET=your-secure-session-secret
MONGODB_URI=your-mongodb-connection-string
```

### TypeScript Best Practices

#### Type Safety in Authentication

1. **Callback Types**

   - Use specific types for Passport.js callbacks instead of the generic `Function` type
   - Define return types for all async functions
   - Properly type error and success cases

2. **User Types**

   - Use `IUserDocument` interface extending MongoDB's `Document` type
   - Avoid using `any` type for user objects
   - Convert MongoDB ObjectId to string when serializing

3. **Error Handling**
   - Type error cases explicitly
   - Include proper error messages in return types
   - Handle null/undefined cases with proper type guards

Example of proper typing:

```typescript
// User document interface
interface IUserDocument extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  // ... other fields
}

// Passport callback types
type DoneCallback = (error: any, user?: any, options?: { message: string }) => void;
type SerializeCallback = (err: any, id?: string) => void;
type DeserializeCallback = (err: any, user?: IUserDocument | false) => void;
```

### Implementation Steps

1. Install Dependencies

   ```bash
   npm install passport passport-local @types/passport @types/passport-local next-auth bcryptjs @types/bcryptjs express-session @types/express-session connect-mongo
   ```

2. Set up Environment Variables

   - Add SESSION_SECRET to .env
   - Ensure MONGODB_URI is configured

3. Implement Authentication Files

   - Create passport.ts configuration
   - Set up session middleware
   - Implement authentication middleware
   - Create login/logout API routes

4. Create Login Page

   - Implement LoginForm component
   - Create login page route
   - Add authentication state management

5. Protect API Routes

   - Add session middleware to API routes
   - Implement isAuthenticated checks
   - Update protected routes to use authentication

6. Testing
   - Test login flow
   - Verify session persistence
   - Test protected routes
   - Validate error handling

## Integration Points

### Protected Routes

Any route requiring authentication should:

1. Import the isAuthenticated middleware
2. Use sessionMiddleware
3. Apply the isAuthenticated check

Example:

```typescript
import { isAuthenticated } from '../middleware/authenticate';
import sessionMiddleware from '../lib/session';

const handler = nextConnect().use(sessionMiddleware).use(isAuthenticated);
```

### User Context

Components can access the authenticated user through the session:

```typescript
// Example of accessing user in an API route
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const userId = req.user._id;
  // Use userId to fetch user-specific data
});
```

## Future Considerations

1. Additional Authentication Strategies

   - OAuth providers (Google, GitHub, etc.)
   - JWT authentication
   - Two-factor authentication

2. Security Enhancements

   - Rate limiting
   - CSRF protection
   - Password reset functionality
   - Email verification

3. User Management
   - User roles and permissions
   - Account settings
   - Profile management

This documentation serves as a comprehensive guide for implementing and maintaining the authentication system within the Bids AI platform.
