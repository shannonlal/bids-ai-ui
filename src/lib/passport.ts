import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import { IUserDocument } from '../models/User';

// Configure Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (
      email: string,
      password: string,

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      } catch (err) {
        return done(err);
      }
    }
  )
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: IUserDocument, done: (err: any, id?: string) => void) => {
  done(null, user._id.toString());
});

passport.deserializeUser(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (id: string, done: (err: any, user?: IUserDocument | false) => void) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        return done(new Error('User not found'));
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  }
);

export default passport;
