import User from '../models/User.js';

export const auth = async (req, res, next) => {
    //authentication process

    const token = req.cookies.x_auth;
    
    console.log(token);
    try {
        const user = await User.findByToken(token);
        if (!user) {
            return res.status(401).json({
                isAuth: false,
                error: true,
                message: 'Authentication failed, user not found.'
            });
        }
        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({
            isAuth: false,
            error: true,
            message: 'Internal Server Error.'
        })
   }

}
