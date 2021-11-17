import { Router } from "express";
import ConversationModel from "../models/conversation.js";

const conversationRouter = Router();

//new conversation route for creating a new conversation

conversationRouter.post("/", async(req, res) => {
    const newCoversation = new ConversationModel({
        participants: [req.body.senderId, req.body.receiverId],
    })
    try {
        const savedConversation = await newCoversation.save();
        res.send(savedConversation);
    } catch (error) {
        res.status(400).send(error);
    }
});

// get user conversations route

conversationRouter.get("/:userId", async(req, res) => {
    try {
        const conversations = await ConversationModel.find({
            participants: {$in: [req.params.userId]}
        });
        res.send(conversations);
    } catch (error) {
        res.status(400).send(error);
    }
}
);


export default conversationRouter;