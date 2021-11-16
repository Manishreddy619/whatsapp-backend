import express from 'express';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
import cors from 'cors';
import authenticationrouter from './models/index.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
const app = express();
const httpServer = createServer(app);

const port = process.env.PORT || 3001;

// ************************* MIDDLEWARES ********************************

app.use(cors());
app.use(express.json());

// ************************* ROUTES ************************************
app.use('/whatsapp', authenticationrouter);
// ************************** ERROR HANDLERS ***************************
const io = new Server(httpServer);

io.on('connection', (socket) => {
	console.log(socket);
	console.log('socket is active to be connected');
	socket.on('chat', (payload) => {
		console.log('what is payload');
		io.emit('chat', payload);
	});
});

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on('connected', () => {
	console.log('Successfully connected to Mongo!');
	httpServer.listen(port, () => {
		console.table(listEndpoints(app));
		console.log(`app running on port ${port}`);
	});
});

mongoose.connection.on('error', (err) => {
	console.log(err);
});
