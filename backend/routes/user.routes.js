import express from 'express';
//controllers
import {createUser,loginuser,logoutcurrentuser,getAllUsers,getcurrentuserprofile,updatecurrentuserprofile, addFavoriteMovie, removeFavoriteMovie, getFavoriteMovies, addMovieToWatchlist, removeMovieFromWatchlist, getWatchlist} from '../controllers/usercontroller.js';
//middlewares
import { authenticate,authorizeAdmin } from '../middlewares/authmiddleware.js';

const router=express.Router();
router.route('/').post(createUser).get(authenticate,authorizeAdmin,getAllUsers);
router.post("/auth",loginuser);
router.post("/logout",logoutcurrentuser);
router.route('/profile').get(authenticate,getcurrentuserprofile).put(authenticate,updatecurrentuserprofile);
router.route('/profile/favorites').post(authenticate,addFavoriteMovie).delete(authenticate,removeFavoriteMovie).get(authenticate,getFavoriteMovies);
router.route('/profile/watchlist').post(authenticate,addMovieToWatchlist).delete(authenticate,removeMovieFromWatchlist).get(authenticate,getWatchlist);
export default router;