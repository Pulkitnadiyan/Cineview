import express from "express";
import Movie from "../models/movie.js";import asynchandler from '../middlewares/asynchandlers.js';

const createMovie=async(req,res)=>{
try{

    const newMovie=new Movie(req.body);
    const savedMovie=await newMovie.save();
    res.json(savedMovie);
}
catch(error){
res.status(500).json({message:error.message})
}


}

const getAllmovies=async(req,res)=>{
    try{
        const movies=await Movie.find({});
        res.json(movies);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}
const getspecificmovie=async(req,res)=>{
    try{
        const {id}=req.params;
        const specificmovie=await Movie.findById(id);
            if(!specificmovie){
                res.status(404).json({message:"Movie not found"});
            }
        res.json(specificmovie);
    }
catch(error){
    res.status(500).json({message:error.message});
}
}
const updateMovie=async(req,res)=>{
    try{
        const {id}=req.params;
        const updatedMovie=await Movie.findByIdAndUpdate(id,req.body,{new:true});
        if(!updatedMovie){
            res.status(404).json({message:"Movie not found"});
        }
        res.json(updatedMovie);}
        catch(error){
        res.status(500).json({message:error.message});
    }
}
const movieReview= async(req,res)=>{
    try{
        const {rating,comment}=req.body;
        const movie=await Movie.findById(req.params.id);
        if(movie){
            const alreadyReviewed=movie.reviews.find((r)=>r.user.toString()===req.user._id.toString());
            if(alreadyReviewed){
                res.status(400).json({message:"Movie already reviewed"});
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
                res.status(404).json({message:"Movie not found"});
            }
        }
        catch(error){
            res.status(500).json({message:error.message})
        }
        }

        const deleteMovie=async(req,res)=>{
            try{
                const {id}=req.params;
                const deleteMovie=await Movie.findByIdAndDelete(id);  
                if(!deleteMovie){
                    res.status(404).json({message:"Movie not found"});
                }
                res.json({message:"Movie deleted"});
                } 
                catch(error){
                res.status(500).json({message:error.message});
            }
        }   

            const deleteComment=async(req,res)=>{
                try{
                    const {movieId,reviewId  }=req.params;
                    const movie=await Movie.findById(movieId);
                    if(!movie){
                        res.status(404).json({message:"Movie not found"});
                    }
                    const reviewIndex=movie.reviews.findIndex((r)=>r._id.toString());
                    if(reviewIndex===-1){
                        res.status(404).json({message:"Review not found"});
                    }
                    movie.reviews.splice(reviewIndex,1);
                    movie.numReviews=movie.reviews.length;
                    movie.rating=movie.reviews.length>0 ? movie.reviews.reduce((acc,item)=>item.rating+acc,0)/movie.reviews.length:0;
                    await movie.save();
                    res.json({message:"Review deleted"});
                    
                }
                catch(error){
                    res.status(500).json({message:error.message});
                }
            }

            const getNewMovies=async(req,res)=>{
                try{
                    const newMovies=await Movie.find({}).sort({createdAt:-1}).limit(10);
                    res.json(newMovies);
                }
                catch(error){
                    res.status(500).json({message:error.message});
                }
            }
            
            const getTopMovies=async(req,res)=>{
                try{
                    const topRatedMovies=await Movie.find({}).sort({rating:-1}).limit(10);
                    res.json(topRatedMovies);

                }
                catch(error){
                    res.status(500).json({message:error.message});
                }
            }

            const getRandomMovies=async(req,res)=>{
                try{
                    const randomMovies=await Movie.aggregate([{$sample:{size:10}}]);
                    res.json(randomMovies);
                }
                catch(error){
                    res.status(500).json({message:error.message});
                }
            }

            const getTotalMovies = async (req, res) => {
                try {
                  const totalMovies = await Movie.countDocuments();
                  res.json({ totalMovies });
                } catch (error) {
                  res.status(500).json({ message: error.message });
                }
              };

export {createMovie,getAllmovies,getspecificmovie,updateMovie,movieReview,deleteMovie,deleteComment,getNewMovies,getTopMovies,
    getRandomMovies,
    getTotalMovies
};

