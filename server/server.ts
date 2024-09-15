import express from 'express'; 
import cors from 'cors';  
import todoRoutes from './routes/todoRoutes';
import { connectDB } from './config/db';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use routes
app.use('/todos', todoRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});