import passport from 'passport';
import jwt from 'jsonwebtoken'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import db from './database.js';

dotenv.config();

passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,

        scope: ["profile", "email"],
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails[0].value;

            try {
                const result = await db.query(
                    "SELECT * FROM admin_users WHERE admin_email = $1",
                    [email]
                );

                if (result.rows.length > 0) {

                    const token = jwt.sign(
                        {
                            given_name: profile._json.given_name,
                            family_name: profile._json.family_name,
                            picture: profile._json.picture,
                            email: profile._json.email,
                        },
                        process.env.JWT_SECRET,
                        { expiresIn: '7d' }
                    );

                    return done(null, { user: result.rows[0], token });
                } else {
                    return done(null, false);

                }
            } catch (err) {
                console.error('Error fetching user from database :- ', err);
                return done(err, false);
            }
        }
    )
);