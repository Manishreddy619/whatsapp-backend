import mongoose from "mongoose";
import { Server } from "socket.io";
import RoomModel from "./models/room.js";
import {
  checkIfRoomExists,
  checkIfUserBelongToRoom,
} from "./utilis/socketUtil.js";

const createSocketServer = (server) => {
  const io = new Server(server, { allowEIO3: true });
  io.on("connection", (socket) => {
    console.log("socket ID:", socket.id);

    // when user connect, check if user belong to any room, if yes user socket id to join room
    socket.on("userConnect", async ({ userId }) => {
      const rooms = await checkIfUserBelongToRoom(userId);
      if (rooms.length !== 0) {
        rooms.forEach((element) => {
          socket.join(element.toString());
        });
        console.log(socket.rooms);
      } else [console.log("user not belong to any room")];
    });

    //create room, add new room to database
    socket.on("createRoom", async ({ roomName, userIds }) => {
      try {
        const newRoom = new RoomModel({
          roomName,
          users: userIds.map((userId) => mongoose.Types.ObjectId(userId._id)),
        });

        const { _id } = await newRoom.save();

        socket.join(_id);
        io.emit("createdRoom", newRoom);
      } catch (error) {
        console.log(error);
      }
    });

    //send message, find room and update chatHistory
    socket.on("sendMessage", async ({ roomId, text, sender }) => {
      try {
        if (await checkIfRoomExists(roomId)) {
          const test = await RoomModel.findOneAndUpdate(
            { _id: roomId },
            {
              $push: { chatHistory: { text, sender } },
            },
            { new: true }
          );
          io.in(roomId).emit("messages", text);
        } else {
          console.log("The room not exist!");
        }
      } catch (error) {
        console.log(error);
        socket.emit("message-error", { error: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log("disconnected socket " + socket.id);
    });
  });
};

export default createSocketServer;
