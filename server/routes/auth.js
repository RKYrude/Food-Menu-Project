import { Router } from "express";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const authRoute = Router();

authRoute.get("/login", (req, res) => {
    if (req.user) {
        res.status(200).json({
            user: req.user,
        })
    } else {
        res.json({
            user: null,
        });

    }
})


// Google OAuth login route (consent screen)
authRoute.get("/google", passport.authenticate("google", {
    scope: ['profile', 'email']
}));

// Google OAuth callback route
authRoute.get('/google/callback', passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_ADMIN_URL}/login?error=unauthorized`,
}), (req, res) => {
    if (req.user) {
        res.redirect(`${process.env.FRONTEND_ADMIN_URL}/admin`);
    }else{
        res.redirect(`${process.env.FRONTEND_ADMIN_URL}/login?error=${req.user.email}`)
    }

});


export default authRoute;