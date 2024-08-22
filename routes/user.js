import express from 'express';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js'

const router = express.Router();

// signup
router.post('/register', async (req, res) => {

    try {
        const user = new User(req.body);
        await user.save();
        res.status(200).json({
            success: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            err: err.message
        })
    }

})

//login
router.post('/login', async (req, res, next) => {
    
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "User Not Found"
            });
        }
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
        return res.json({
            loginSuccess: false,
            message: "Wrong Password"
        });
    }

     const token = await user.generateToken();
    console.log('디버깅1');
    console.log(token);
res.cookie('x_auth', token, {
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: true, // Ensures the cookie is only sent over HTTPS
    sameSite: 'none', // Allows the cookie to be sent in cross-site requests
})
.status(200)
.json({ loginSuccess: true, userId: user._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            loginSuccess: false,
            message: err.message
        });
    }
    
})

router.get('/auth', auth, (req, res, next) => {

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image

    })
});

router.get('/logout', auth, async (req, res, next) => {
    try {
        await User.findOneAndUpdate({
            _id: req.user._id
        }, { token: "" });

        res.clearCookie('x_auth');
        return res.status(200).json({
            success: true,
            message: 'Successfully logged out'
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Failed to log out'
        });

    }
});

export default router;
