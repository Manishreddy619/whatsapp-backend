import express from 'express';
import {
	login,
	register,
	forgotpassword,
	resetpassword,
} from '../controllers/auth.js';
import getUserChat from '../controllers/getUserChat.js';
import protect from '../middlewares/protect.js';
const authenticationrouter = express.Router();
authenticationrouter.get('/', protect, getUserChat);
authenticationrouter.post('/register', register);
authenticationrouter.post('/login', login);
authenticationrouter.post('/forgotpassword', forgotpassword);
authenticationrouter.put('/passwordreset/:resetToken', resetpassword);

export default authenticationrouter;
