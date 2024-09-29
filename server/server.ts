const express = require('express');
const cors = require('cors');
import todoRoutes from './routes/todoRoutes';
const { connectDB } = require('./config/db');
const payload = require('payload');
require('dotenv').config();

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
