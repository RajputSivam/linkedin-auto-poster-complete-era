import passport from 'passport';
import passportLinkedIn from 'passport-linkedin-oauth2';
import dotenv from 'dotenv';
import User from '../models/User.js';

const LinkedInStrategy = passportLinkedIn.Strategy;

dotenv.config();

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
      state: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value || '';
        const linkedinId = profile.id;
        const existingUser = await User.findOne({ linkedinId });

        if (existingUser) {
          existingUser.accessToken = accessToken;
          existingUser.name = profile.displayName || existingUser.name;
          existingUser.email = email || existingUser.email;
          await existingUser.save();
          return done(null, existingUser);
        }

        const user = await User.create({
          linkedinId,
          name: profile.displayName,
          email,
          accessToken,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
