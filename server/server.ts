import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db'
import payload from 'payload'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware setup
app.use(cors())
app.use(express.json())

// Connect to MongoDB
connectDB()

const start = async () => {
  try {
    if (!process.env.PAYLOAD_SECRET) {
      throw new Error('PAYLOAD_SECRET is not defined in .env')
    }
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env')
    }

    console.log("Initializing Payload...");
    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      express: app
    })
    console.log("Payload initialized successfully.");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Express is now listening for incoming connections on port ${PORT}`)
    })
  } catch (error) {
    console.error('Error starting the server:', error)
    process.exit(1)
  }
}

// Start the server
start()
