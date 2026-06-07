import passport from 'passport';
import OpenIDConnectStrategy from 'passport-openidconnect';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

passport.use(
  new OpenIDConnectStrategy(
    {
      issuer: 'https://www.linkedin.com/oauth',
      authorizationURL: 'https://www.linkedin.com/oauth/v2/authorization',
      tokenURL: 'https://www.linkedin.com/oauth/v2/accessToken',
      userInfoURL: 'https://api.linkedin.com/v2/userinfo',
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL,
      scope: ['openid', 'profile', 'email', 'w_member_social'],
    },
    async (issuer, profile, context, idToken, accessToken, refreshToken, params, done) => {
      try {
        const email = profile.emails?.[0]?.value || profile._json?.email || '';
        const linkedinId = profile.id || profile._json?.sub || '';
        const name = profile.displayName || profile._json?.name || '';
        const expiresInSeconds = Number(params?.expires_in || 0);
        const accessTokenExpiresAt = expiresInSeconds > 0
          ? new Date(Date.now() + expiresInSeconds * 1000)
          : null;

        const existingUser = await User.findOne({ linkedinId });

        if (existingUser) {
          existingUser.accessToken = accessToken;
          existingUser.refreshToken = refreshToken || existingUser.refreshToken;
          existingUser.accessTokenExpiresAt = accessTokenExpiresAt;
          existingUser.name = name || existingUser.name;
          existingUser.email = email || existingUser.email;
          await existingUser.save();
          return done(null, existingUser);
        }

        const user = await User.create({
          linkedinId,
          name,
          email,
          accessToken,
          refreshToken,
          accessTokenExpiresAt,
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
