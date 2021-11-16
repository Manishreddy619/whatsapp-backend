import express from 'express'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import authenticationrouter from './models/index.js'
import { createServer } from 'http'
import { Server } from 'socket.io'
const app = express()
const httpServer = createServer()

const port = process.env.PORT || 3001

// ************************* MIDDLEWARES ********************************

app.use(cors())
app.use(express.json())

// ************************* ROUTES ************************************
app.use('/whatsapp', authenticationrouter)
// ************************** ERROR HANDLERS ***************************
const io = new Server(httpServer)
mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on('connected', () => {
  console.log('Successfully connected to Mongo!')
  app.listen(port, () => {
    console.table(listEndpoints(app))
    console.log(`app running on port ${port}`)
  })
})

mongoose.connection.on('error', (err) => {
  console.log(err)
})
