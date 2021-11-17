import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: String,
    },
    senderId: {
        type: String,
    },
    message: {
        type: String,
    },
},
    {timestamps: true}
); 

export default mongoose.model('Message', messageSchema);

