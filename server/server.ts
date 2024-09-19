import express from 'express'; 
import cors from 'cors';  
import todoRoutes from './routes/todoRoutes';
import { connectDB } from './config/db';
import payload from 'payload';

require('dotenv').config()

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/todos', todoRoutes);

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    express: app,
    mongoURL: process.env.MONGO_URI, 
  });

  app.listen(PORT, async () => {
    console.log(`Express is now listening for incoming connections on port ${PORT}`);
  });
};

start();