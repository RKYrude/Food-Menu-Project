import { Router } from "express";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const authRoute = Router();


authRoute.get('/login/success', (req, res) => {

    if(req.user){
        res.status(200).json({
            message: "Logged in successfully",
            user: req.user
        })
    }else{
        res.status(403).json({
            message: "Not authorised"
        });
    }
});


// Google OAuth callback route
authRoute.get(
    '/google/admin',
    passport.authenticate('google', {
        failureRedirect: `${process.env.FRONTEND_ADMIN_URL}/login`,
    }),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_ADMIN_URL}/admin`);
    }
);

// Google OAuth login route
authRoute.get("/google", passport.authenticate("google", { scope: ['profile', 'email'] }));

export { authRoute };