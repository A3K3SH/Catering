import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { storage } from './storage';
import { users } from '@shared/schema';
import session from 'express-session';
import ConnectPgSimple from 'connect-pg-simple';
import express from 'express';
import { pool } from '@db';

// Hash password
export async function hash(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Compare password
export async function compare(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Configure passport
export function configureAuth(app: express.Express) {
  // Set up session store
  const PgSession = ConnectPgSimple(session);
  
  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: 'session',
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || 'tasteofindia',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      },
    })
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: 'Invalid username or password' });
        }
        
        const isValid = await compare(password, user.password);
        
        if (!isValid) {
          return done(null, false, { message: 'Invalid username or password' });
        }
        
        // Don't include password in user object
        const { password: _, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, id)
      });
      
      if (!user) {
        return done(null, false);
      }
      
      // Don't include password in user object
      const { password: _, ...userWithoutPassword } = user;
      done(null, userWithoutPassword);
    } catch (error) {
      done(error);
    }
  });

  // Authentication middleware
  return {
    isAuthenticated: (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.isAuthenticated()) {
        return next();
      }
      res.status(401).json({ message: 'Unauthorized' });
    },

    isAdmin: (req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (req.isAuthenticated() && (req.user as any).isAdmin) {
        return next();
      }
      res.status(403).json({ message: 'Forbidden' });
    },
  };
}
