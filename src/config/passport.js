import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
 
dotenv.config();
 
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        displayName: profile.displayName,
        emails: profile.emails,
      };
      return done(null, user);
    }
  )
);
 
passport.serializeUser((user, done) => {
  done(null, user);
});
 
passport.deserializeUser((user, done) => {
  done(null, user);
});