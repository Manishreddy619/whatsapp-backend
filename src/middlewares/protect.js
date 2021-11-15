import jwt from 'jsonwebtoken';
import ErrorResponse from '../utilis/errorResponse.js';
import WhatsappUser from '../models/whatsappUser.js';
const protect = async (req, res, next) => {
	// console.log(req.headers.authorization);
	// if (req.headers.authorization) {
	// 	const token = req.headers.authorization.replace('Bearer ', '');
	// 	console.log(token);

	// 	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	// 	console.log(decoded);
	// 	const user = await WhatsappUser.findById(decoded.id);
	// 	console.log(user);
	// 	next();
	// }
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(new ErrorResponse('Not authorized to access this route', 401));
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await WhatsappUser.findById(decoded.id);

		if (!user) {
			return next(new ErrorResponse('No user found with this id', 404));
		}

		req.user = user;

		next();
	} catch (err) {
		return next(new ErrorResponse('Not authorized to access this router', 401));
	}
};
export default protect;
