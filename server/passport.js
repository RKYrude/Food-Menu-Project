import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import db from "./database.js";

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
    console.log("serialise: ",user);  //logs
    
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {

        const result = await db.query(
            "SELECT * FROM admin_users WHERE id = $1",
            [id]
        );

        console.log("deserialize", result.rows);

        if (result.rows.length > 0) {
            done(null, result.rows[0]);
        } else {
            console.log("deserialise: ",user);  //logs
            done(new Error('User not found'), null);
        }
    } catch (err) {
        done(err);
    }
});