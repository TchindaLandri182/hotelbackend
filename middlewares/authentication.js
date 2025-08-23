const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const verifyJWT = async (req, res, next) => {
    const authHeader = req?.authorization || req.headers?.authorization;
    
    if(!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({messageCode: 'MSG_0061', message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    if(!token){
        return res.status(403).json({messageCode: 'MSG_0095', message: 'Forbidden' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'Access_token_secret');
        const user = await User.findById(decoded.userId).select('-password');

        if(!user || user?.deleted) return res.status(403).json({messageCode: 'MSG_0053', message: 'User not found' });
        if(user?.blocked) return res.status(403).json({messageCode: 'MSG_0096', message: 'Your account have been blocked contack your administrator for more detailed'});
        
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({messageCode: 'MSG_0095', message: 'Forbidden' });
    }
};

module.exports = verifyJWT;