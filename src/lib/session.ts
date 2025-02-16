import { NextApiRequest, NextApiResponse } from 'next';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './passport';
import { IUserDocument } from '../models/User';
import { Request, Response, NextFunction } from 'express';

// Extend NextApiRequest to include session
declare module 'next' {
  interface NextApiRequest {
    session: session.Session & {
      user?: IUserDocument;
    };
  }
}

// Create session configuration
const sessionConfig = session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: 'french-idol',
    ttl: 30 * 24 * 60 * 60, // 30 days
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
});

type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

// Create middleware wrapper for Next.js API routes
const withSession = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
      await new Promise<void>((resolve, reject) => {
        const expressReq = req as unknown as Request;
        const expressRes = res as unknown as Response;
        const next: NextFunction = err => (err ? reject(err) : resolve());

        sessionConfig(expressReq, expressRes, err => {
          if (err) return next(err);
          passport.initialize()(expressReq, expressRes, err => {
            if (err) return next(err);
            passport.session()(expressReq, expressRes, next);
          });
        });
      });

      return handler(req, res);
    } catch (error) {
      console.error('Session middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

export default withSession;
