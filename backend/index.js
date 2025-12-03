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
import chatRoutes from './routes/chatRoutes.js';
import actorRoutes from './routes/actorRoutes.js';

//config
dotenv.config();

const startServer = async () => {
  await connectDB();
  const app = express();
  //middleware
  const allowedOrigins = ['https://cineview-ecru.vercel.app', 'https://cineview-xk68.onrender.com'];

  const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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
  app.use('/api/v1/chat',chatRoutes);
  app.use('/api/v1/actors',actorRoutes);

  // ES Module compatible __dirname definition:
  const __filename = fileURLToPath(import.meta.url); 
  const __dirname = path.dirname(__filename); // __dirname will now point to '.../backend' folder
  
  // Static path fix: '..' use karke root folder tak pahunche
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads'))); // <-- FIX
  app.use('/videos', express.static(path.join(__dirname, '..', 'videos'))); 

  // Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

  app.listen(PORT, '0.0.0.0', () =>  console.log(`Server running on port ${PORT}`));
};

startServer();


