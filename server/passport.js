import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv";
import db from "./database.js";

dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "https://food-menu-project.onrender.com/auth/google/callback",
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
                    return done(null, result.rows[0]);
                } else {
                    return done(null, false, { message: "User Not Found" });
                }
            } catch (err) {
                console.error('Error fetching user from database :- ', err);
                return done(err, false);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user); // Serialize by user ID (or another unique identifier)
});
passport.deserializeUser((user, done) => {
    done(null, user); // Deserialize by user ID (or another unique identifier)
});

export default passport;