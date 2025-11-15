//packages
import express from 'express';  
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
//files
import connectDB from './config/db.js';
import userRoutes from './routes/user.routes.js';
import genreRoutes from './routes/genreroutes.js';
import moviesRoutes from './routes/moviesRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

//config
dotenv.config();

const startServer = async () => {
  await connectDB();
  const app = express();
  //middleware
  const corsOptions = {
    origin: 'https://cineview-ecru.vercel.app',
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({extended:true}));

  const PORT = process.env.PORT || 5000;
  //routes

  app.use('/api/v1/users',userRoutes);
  app.use('/api/v1/genres',genreRoutes);
  app.use('/api/v1/movies',moviesRoutes)
  app.use('/api/v1/uploads',uploadRoutes);

  // ES Module compatible __dirname definition:
  const __filename = fileURLToPath(import.meta.url); 
  const __dirname = path.dirname(__filename); // __dirname will now point to '.../backend' folder
  
  // Static path fix: '..' use karke root folder tak pahunche
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'))); // <-- FIX

  app.listen(PORT, '0.0.0.0', () =>  console.log(`Server running on port ${PORT}`));
};

startServer();


