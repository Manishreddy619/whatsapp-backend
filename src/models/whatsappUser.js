import crypto from 'crypto';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const whatsappUserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'Please provide username'],
	},
	email: {
		type: String,
		required: [true, 'Please provide email address'],
		unique: true,
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			'Please provide a valid email',
		],
	},
	password: {
		type: String,
		required: [true, 'Please add a password'],
		minlength: 6,
		select: false,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
});

whatsappUserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

whatsappUserSchema.methods.matchPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

whatsappUserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});
};

whatsappUserSchema.methods.toJSON = function () {
	const whatsappUserDoc = this;
	const userObj = whatsappUserDoc.toObject();
	delete userObj.password;
	return userObj;
};
whatsappUserSchema.methods.getResetPasswordToken = function () {
	const resetToken = crypto.randomBytes(20).toString('hex');

	// Hash token (private key) and save to database
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	// Set token expire date
	this.resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes

	return resetToken;
};

const WhatsappUser = mongoose.model('WhatsappUser', whatsappUserSchema);

export default WhatsappUser;
