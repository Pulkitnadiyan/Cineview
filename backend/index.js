//packages
import express from 'express';  
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
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
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({extended:true}));

  const PORT = process.env.PORT || 3000;
  //routes

  app.use('/api/v1/users',userRoutes);
  app.use('/api/v1/genres',genreRoutes);
  app.use('/api/v1/movies',moviesRoutes)
  app.use('/api/v1/uploads',uploadRoutes);

  const __dirname=path.resolve();
  app.use('/uploads',express.static(path.join(__dirname,'/uploads')));


  app.listen(PORT, () =>  console.log(`Server running on port ${PORT}`));
};

startServer();


