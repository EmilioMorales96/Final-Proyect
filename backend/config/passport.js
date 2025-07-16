import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import db from '../models/index.js';

const { User } = db;

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({
      where: { googleId: profile.id }
    });

    if (user) {
      // User exists, return user
      return done(null, user);
    }

    // Check if user exists with same email
    user = await User.findOne({
      where: { email: profile.emails[0].value }
    });

    if (user) {
      // Link Google account to existing user
      user.googleId = profile.id;
      if (!user.avatar && profile.photos?.[0]?.value) {
        user.avatar = profile.photos[0].value;
      }
      await user.save();
      return done(null, user);
    }

    // Create new user
    user = await User.create({
      googleId: profile.id,
      username: profile.displayName || `user_${profile.id}`,
      email: profile.emails[0].value,
      firstName: profile.name?.givenName || '',
      lastName: profile.name?.familyName || '',
      avatar: profile.photos?.[0]?.value || null,
      isActive: true,
      // Users from Google OAuth are automatically verified
      emailVerified: true
    });

    return done(null, user);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
