import express from "express";
const router =express.Router();

//controllers
import {createMovie,getAllmovies,getspecificmovie,updateMovie,movieReview,deleteMovie,deleteComment,getNewMovies,getTopMovies
    ,getRandomMovies,
    getTotalMovies,
    getMoviesByMood,
    getMoviesByGenre,
} from '../controllers/moviecontroller.js';
//middlewares
import {authenticate,authorizeAdmin} from '../middlewares/authmiddleware.js';
import checkId from "../middlewares/checkId.js";

//public routes
router.get('/all-movies',getAllmovies);
router.get('/specific-movie/:id',getspecificmovie);
router.get("/total", getTotalMovies);


 // RTK Query endpoints
 router.get('/new-movies',getNewMovies);
 router.get('/top-movies',getTopMovies);
 router.get('/random-movies',getRandomMovies);
 router.get('/by-mood/:moodName',getMoviesByMood);
    router.get('/by-genre/:genreName',getMoviesByGenre);


//restricted routes
router.post('/:id/reviews',authenticate,checkId,movieReview);

//admin
router.post("/create-movie",authenticate,authorizeAdmin,createMovie);
router.put("/update-movie/:id",authenticate,authorizeAdmin,updateMovie);
router.delete("/delete-movie/:id",authenticate,authorizeAdmin,deleteMovie);
// ✅ FIX APPLIED: Corrected comment deletion route to use URL parameters
router.delete('/:movieId/reviews/:reviewId',authenticate,authorizeAdmin,deleteComment); 


export default router;