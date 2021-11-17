import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    participants: {
        type: Array
    },
},
    { timestamps: true }
);


export default mongoose.model('Conversation', conversationSchema);
