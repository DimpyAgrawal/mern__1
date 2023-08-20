const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');

const Authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // console.log(authHeader);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Unauthorized: No token provided');
        }

        const token = authHeader.split(' ')[1];
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

        const rootUser = await User.findOne({ _id: verifyToken, 'tokens.token': token });

        if (!rootUser) { throw new Error('User not Found') }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();

    } catch (err) {
        res.status(401).send('unauthorized : no token provided');
        console.log(err);
    }
}

module.exports = Authenticate;