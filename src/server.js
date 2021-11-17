import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import authenticationrouter from "./models/index.js";
import { createServer } from "http";
import createSocketServer from "./socket.js";

const app = express();
const httpServer = createServer(app);
createSocketServer(httpServer);

const port = process.env.PORT || 3001;

// ************************* MIDDLEWARES ********************************

app.use(cors());
app.use(express.json());

// ************************* ROUTES ************************************
app.use("/whatsapp", authenticationrouter);
// ************************** ERROR HANDLERS ***************************
// const io = new Server(httpServer)

console.table(listEndpoints(app));
mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  httpServer.listen(port, () => {
    console.log(`app running on port ${port}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
