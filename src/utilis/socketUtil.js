import RoomModel from "../models/room.js";

export const checkIfRoomExists = async (roomId) => {
  try {
    const room = await RoomModel.findById({ _id: roomId });
    if (room) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

// check if user belong to any room
export const checkIfUserBelongToRoom = async (userId) => {
  try {
    const userExistInRoom = await RoomModel.find({ users: userId });
    const rooms = userExistInRoom.map((room) => room._id);
    return rooms;
  } catch (error) {
    console.log(error);
  }
};
