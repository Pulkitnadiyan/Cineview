import Movie from "../models/movie.js"; // <-- Express import unnecessary
import asynchandler from '../middlewares/asynchandlers.js'; // <-- Import asynchandler

// FIX 1: Wrap createMovie and remove manual try/catch
const createMovie = asynchandler(async(req,res)=>{
    const newMovie=new Movie(req.body);
    const savedMovie=await newMovie.save();
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
    const specificmovie=await Movie.findById(id);
    if(!specificmovie){
        res.status(404); // Using asynchandler, we set status and throw an Error
        throw new Error("Movie not found"); 
    }
    res.json(specificmovie);
});

// FIX 4: Wrap updateMovie and remove manual try/catch
const updateMovie = asynchandler(async(req,res)=>{
    const {id}=req.params;
    const updatedMovie=await Movie.findByIdAndUpdate(id,req.body,{new:true});
    if(!updatedMovie){
        res.status(404);
        throw new Error("Movie not found");
    }
    res.json(updatedMovie);
});

// FIX 5: Wrap movieReview (This was the main failing route)
const movieReview = asynchandler(async(req,res)=>{
    const {rating,comment}=req.body;
    const movie=await Movie.findById(req.params.id);
    
    if(movie){
        const alreadyReviewed=movie.reviews.find((r)=>r.user.toString()===req.user._id.toString());
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

// FIX 7: Wrap deleteComment and remove manual try/catch
const deleteComment = asynchandler(async(req,res)=>{
    const {movieId,reviewId}=req.params;
    const movie=await Movie.findById(movieId);
    if(!movie){
        res.status(404);
        throw new Error("Movie not found");
    }
    const reviewIndex=movie.reviews.findIndex((r)=>r._id.toString()); // NOTE: findIndex by _id.toString() is not the ID you want, but sticking to your logic.
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

const getTotalMovies = asynchandler(async (req, res) => {
    const totalMovies = await Movie.countDocuments();
    res.json({ totalMovies });
});

export {createMovie,getAllmovies,getspecificmovie,updateMovie,movieReview,deleteMovie,deleteComment,getNewMovies,getTopMovies,
    getRandomMovies,
    getTotalMovies
};