import mongoose from "mongoose";
const { Schema, model } = mongoose;

const MessageSchema = new Schema(
  {
    text: { type: String },
    sender: { type: mongoose.ObjectId, ref: "whatsappUser", required: true },
  },
  {
    timestamps: true,
  }
);

const RoomSchema = new Schema({
  roomName: { type: String, required: true },
  chatHistory: {
    type: [MessageSchema],
    required: true,
    default: [],
  },
  users: [{ type: mongoose.ObjectId, ref: "whatsappUser", required: true }],
});

export default model("Rooms", RoomSchema);
