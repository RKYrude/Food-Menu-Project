import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import { Router } from "express";
import db from "./database.js";

dotenv.config();

const authRouter = Router();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails[0].value;

            try {
                const result = await db.query(
                    "SELECT * FROM admin_users WHERE admin_email = $1",
                    [email]
                );

                if (result.rows.length > 0) {
                    return done(null, result.rows[0]); // Return the user from the database
                } else {
                    return done(null, false, { message: "User Not Found" });
                }
            } catch (err) {
                console.error('Error fetching user from database:', err);
                return done(err, false);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize by user ID (or another unique identifier)
});

passport.deserializeUser(async (id, done) => {
    try {
        const result = await db.query('SELECT * FROM admin_users WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            done(null, result.rows[0]);
        } else {
            done(new Error("User not found"), null);
        }
    } catch (err) {
        done(err, null);
    }
});

// Google OAuth routes
authRouter.get('/google', passport.authenticate('google', { scope: ['email'] }));

authRouter.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        if (req.user) {
            res.redirect('/admin');
        } else {
            res.redirect('/login');
        }
    }
);

export { authRouter };