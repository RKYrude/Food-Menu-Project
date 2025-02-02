import { Router } from "express";
import passport from "passport";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken'

dotenv.config();

const authRoute = Router();

authRoute.get("/login", (req, res) => {

    if (req.cookies.token) {
        try {
            const user = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            console.log("Token is valid:", user);
            res.status(200).json({
                user: user,
            });
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Session expired, please log in again" });
            }
            return res.status(403).json({ message: "Invalid token" });
        }


    } else {
        res.json({
            user: null,
        });
    }
});


// Google OAuth login route (consent screen)
authRoute.get("/google", passport.authenticate("google", {
    scope: ['profile', 'email'],
}));

// Google OAuth callback route
authRoute.get('/google/callback', passport.authenticate('google', {
    failureRedirect: `${process.env.FRONTEND_ADMIN_URL}/login?error=true`,
    session: false,
}), (req, res) => {
    if (req.user) {
        const { token } = req.user
        res.cookie('token', token, {
            httpOnly: false,
            secure: true,
            sameSite: 'none'
        });

        res.redirect(`${process.env.FRONTEND_ADMIN_URL}/admin`);
    }
});


export default authRoute;