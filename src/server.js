import express from 'express'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import authenticationrouter from './models/index.js'
import messageRouter from './controllers/message.js'
import conversationRouter from './controllers/conversation.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
const app = express()


const port = process.env.PORT || 3001

// ************************* MIDDLEWARES ********************************

app.use(cors())
app.use(express.json())

// ************************* ROUTES ************************************
app.use('/whatsapp', authenticationrouter)
app.use('/whatsapp/messages', messageRouter)
app.use('/whatsapp/conversations', conversationRouter)
// ************************** ERROR HANDLERS ***************************

const httpServer = createServer(app)

const io = new Server(httpServer, {allowEIO3: true})

let users = []

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({userId, socketId})
}

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
  return users.find((user) => user.userId === userId)
}


io.on('connection', (socket) => {
  console.log('a user connected')
  console.log(socket.id)

  socket.on("addUser", (userId) => {
    addUser(userId, socket.id)
    
    io.emit("getUsers", users)
    })

socket.on("sendMessage", ({senderId, receiverId, message}) => {
  const user = getUser(receiverId)
  if (user) {
    io.to(user.socketId).emit("getMessage", {senderId, message}
    )
  } else {
    console.log("user not found")
  }
})
  
  socket.on('disconnect', () => {
    console.log('user disconnected')
    removeUser(socket.id)
    io.emit("getUsers", users)
  })
})
mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on('connected', () => {
  console.log('Successfully connected to Mongo!')
  httpServer.listen(port, () => {
    console.table(listEndpoints(app))
    console.log(`app running on port ${port}`)
  })
})


mongoose.connection.on('error', (err) => {
  console.log(err)
})

