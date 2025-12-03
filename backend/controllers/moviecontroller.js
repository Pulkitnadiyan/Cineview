import Movie from "../models/movie.js";
import asynchandler from '../middlewares/asynchandlers.js';
import Genre from "../models/genre.js";
import Actor from "../models/actor.js";

const createMovie = asynchandler(async (req, res) => {
  const { name, year, genre, detail, cast } = req.body;

  if (!name || !year || !genre || !detail || !cast || cast.length === 0) {
    res.status(400);
    throw new Error(
      "Please fill all required fields: name, year, genre, detail, and cast."
    );
  }

  const castIds = await Promise.all(
    cast.map(async (actorName) => {
      let actor = await Actor.findOne({
        name: { $regex: new RegExp(`^${actorName.trim()}$`, "i") },
      });
      if (!actor) {
        actor = await Actor.create({ name: actorName.trim() });
      }
      return actor._id;
    })
  );

  const newMovie = new Movie({ ...req.body, cast: castIds });
  const savedMovie = await newMovie.save();
  res.json(savedMovie);
});

// FIX 2: Wrap getAllmovies and remove manual try/catch
const getAllmovies = asynchandler(async(req,res)=>{
    const movies=await Movie.find({});
    res.json(movies);
});

// FIX 3: Wrap getspecificmovie and remove manual try/catch
const getspecificmovie = asynchandler(async(req,res)=>{
    const {id}=req.params;
    // NOTE: Added populate('genre') for frontend display.
    const specificmovie=await Movie.findById(id).populate('genre').populate('cast'); 
    if(!specificmovie){
        res.status(404); // Using asynchandler, we set status and throw an Error
        throw new Error("Movie not found"); 
    }
    res.json(specificmovie);
});

// FIX 4: Wrap updateMovie and remove manual try/catch
const updateMovie = asynchandler(async (req, res) => {
  const { id } = req.params;
  const { cast, ...updateData } = req.body;

  if (cast && Array.isArray(cast)) {
    const castIds = await Promise.all(
      cast.map(async (actorName) => {
        // Find actor by name, case-insensitive
        let actor = await Actor.findOne({
          name: { $regex: new RegExp(`^${actorName.trim()}$`, "i") },
        });

        // If actor doesn't exist, create a new one
        if (!actor) {
          actor = await Actor.create({ name: actorName.trim() });
        }
        return actor._id;
      })
    );
    updateData.cast = castIds;
  }

  const updatedMovie = await Movie.findByIdAndUpdate(id, updateData, {
    new: true,
  });

  if (!updatedMovie) {
    res.status(404);
    throw new Error("Movie not found");
  }

  res.json(updatedMovie);
});

// FIX 5: Added validation for movieReview fields
const movieReview = asynchandler(async(req,res)=>{
    if (!req.user || !req.user._id) {
        res.status(401);
        throw new Error("Not authorized, user information incomplete");
    }
    const {rating,comment}=req.body;
    const movie=await Movie.findById(req.params.id);
    
    // 🛑 FIX: Explicit validation for required fields for review
    if (!comment || rating === undefined || comment.trim() === "" || rating < 1 || rating > 5) {
        res.status(400);
        throw new Error("Please provide a rating between 1 and 5, and a comment.");
    }
    
    if(movie){
        const alreadyReviewed=movie.reviews.find((r)=>r.user && r.user.toString()===req.user._id.toString());
        if(alreadyReviewed){
            res.status(400);
            throw new Error("Movie already reviewed");
        }
        const review={
            name:req.user.username,
            rating:Number(rating),
            comment,
            user:req.user._id,
        };
        movie.reviews.push(review);
        movie.numReviews=movie.reviews.length;
        movie.rating=movie.reviews.reduce((acc,item)=>item.rating+acc,0)/movie.reviews.length;
        await movie.save();
        res.status(201).json({message:"Review added"});
    }
    else{
        res.status(404);
        throw new Error("Movie not found"); // Throw error for asynchandler to catch
    }
});

// FIX 6: Wrap deleteMovie and remove manual try/catch
const deleteMovie = asynchandler(async(req,res)=>{
    const {id}=req.params;
    const deletedMovie=await Movie.findByIdAndDelete(id);  
    if(!deletedMovie){
        res.status(404);
        throw new Error("Movie not found");
    }
    res.json({message:"Movie deleted"});
});

// FIX 7: Corrected comment deletion logic
const deleteComment = asynchandler(async(req,res)=>{
    const {movieId,reviewId}=req.params;
    const movie=await Movie.findById(movieId);
    if(!movie){
        res.status(404);
        throw new Error("Movie not found");
    }
    
    // 🛑 FIX: Corrected logic to find the review by comparing _id with reviewId
    const reviewIndex=movie.reviews.findIndex((r)=>r._id.toString()===reviewId); 
    
    if(reviewIndex===-1){
        res.status(404);
        throw new Error("Review not found");
    }
    
    movie.reviews.splice(reviewIndex,1);
    movie.numReviews=movie.reviews.length;
    movie.rating=movie.reviews.length>0 ? movie.reviews.reduce((acc,item)=>item.rating+acc,0)/movie.reviews.length:0;
    await movie.save();
    res.json({message:"Review deleted"});
});

// FIX 8: Wrap read-only routes for consistency
const getNewMovies = asynchandler(async(req,res)=>{
    const newMovies=await Movie.find({}).sort({createdAt:-1}).limit(10);
    res.json(newMovies);
});

const getTopMovies = asynchandler(async(req,res)=>{
    const topRatedMovies=await Movie.find({}).sort({rating:-1}).limit(10);
    res.json(topRatedMovies);
});

const getRandomMovies = asynchandler(async(req,res)=>{
    const randomMovies=await Movie.aggregate([{$sample:{size:10}}]);
    res.json(randomMovies);
});

const getMoviesByGenre = asynchandler(async (req, res) => {
    const { genreName } = req.params;

    // Find the genre by name
    const genre = await Genre.findOne({ name: new RegExp(`^${genreName}$`, 'i') });

    if (!genre) {
        res.status(404);
        throw new Error(`Genre '${genreName}' not found`);
    }

    // Find movies that belong to this genre
    const movies = await Movie.find({ genre: genre._id }).populate('genre');

    if (movies.length === 0) {
        res.status(404);
        throw new Error(`No movies found for genre '${genreName}'`);
    }

    res.json(movies);
});

const getTotalMovies = asynchandler(async (req, res) => {
    const totalMovies = await Movie.countDocuments();
    res.json({ totalMovies });
});

const getMoviesByMood = asynchandler(async (req, res) => {
    const { moodName } = req.params;

    const movies = await Movie.find({ mood: { $regex: moodName, $options: 'i' } }).populate('genre');

    if (movies.length === 0) {
        res.status(404);
        throw new Error(`No movies found for mood '${moodName}'`);
    }

    res.json(movies);
});

export {
    createMovie,
    getAllmovies,
    getspecificmovie,
    updateMovie,
    movieReview,
    deleteMovie,
    deleteComment,
    getNewMovies,
    getTopMovies,
    getRandomMovies,
    getMoviesByGenre, // Export the new function
    getTotalMovies,
    getMoviesByMood,
};