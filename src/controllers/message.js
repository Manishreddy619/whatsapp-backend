import { Router } from "express";
import MessageModel from "../models/messages.js";

const messageRouter = Router();

// add message  to database

messageRouter.post("/", async(req, res) => {
    const mewMessage = new MessageModel(req.body)
    try {
        
        const savedMessage = await mewMessage.save();
        res.status(201).send(savedMessage);
    } catch (error) {
       
        res.status(400).send({ message: error.message });
    }
});

// get all messages from database

messageRouter.get("/", async(req, res) => {

    try {
        const messages = await MessageModel.find({});
        res.send(messages);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
);

// get message by id from database

messageRouter.get("/:conversationId", async(req, res) => {
    const id = req.params.conversationId;
    try {
        const message = await MessageModel.findById(id);
        res.send(message);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

export default messageRouter;



