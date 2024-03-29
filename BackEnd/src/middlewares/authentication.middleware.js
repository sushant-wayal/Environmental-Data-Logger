import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const isLoggedIn = async (req, res, next) => {
	const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
	if (token) {
        try {
            const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = decoded;
            return next();
        } catch (error) {
            throw new ApiError(401, 'Invalid token');
        }
	}
  	return res.status(401).json(new ApiResponse(401, null, 'You are not logged in'));
};

export { isLoggedIn };