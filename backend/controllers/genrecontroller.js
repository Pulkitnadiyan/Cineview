import Genre from '../models/genre.js';

import asyncHandler from '../middlewares/asynchandlers.js';

const createGenre = asyncHandler(async (req, res) => {
    try{
        const { name } = req.body;
        if(!name)
        {
            res.status(400);
            throw new Error("Genre name is required");
        }
        const genreExists = await Genre.findOne({ name });
        if(genreExists)
        {
            res.status(400);
            throw new Error("Genre already exists");
        }
        const newGenre = new Genre({ name });
        await newGenre.save();
        res.status(201).json({ message: "Genre created successfully", genre: newGenre });
    }
    catch(error)
    {
        res.status(500);
        throw new Error("Server Error: Unable to create genre");
    }
});

const updateGenre = asyncHandler(async (req, res) => {
    try{
       
        const { name } = req.body;
        const {id} = req.params;

        const genre = await Genre.findById(id);
        if(!genre)
        {
            res.status(404);
            throw new Error("Genre not found");
        }
        genre.name = name ;
        const updatedGenre = await genre.save();
        res.json(updatedGenre);}
    catch(error)
    {
        res.status(500);
        throw new Error("Server Error: Unable to update genre");
    }
});


const removeGenre = asyncHandler(async (req, res) => {
    try{
        const {id} = req.params;
        const removed = await Genre.findByIdAndDelete(id);
        if(!removed)
        {
            res.status(404);
            throw new Error("Genre not found");
        }
       res.json(removed); 

    }catch(error)
    {
        res.status(500);
        throw new Error("Server Error: Unable to delete genre");
    }
});
const listgenres = asyncHandler(async (req, res) => {
    try{
        const all= await Genre.find({});
        res.json(all);
    }
    catch(error)
    {
        res.status(500);
        throw new Error("Server Error: Unable to list genres");
    }
});

const readGenre = asyncHandler(async (req, res) => {
    try{
        const genre= await Genre.findOne({_id:req.params.id});
        res.json(genre);
    }
    catch(error)
    {
        res.status(500);
        throw new Error("Server Error: Unable to read genre");
    }
});

const getTotalGenres = asyncHandler(async (req, res) => {
    try {
      const totalGenres = await Genre.countDocuments();
      res.json({ totalGenres });
    } catch (error) {
      console.error("Error in getTotalGenres:", error); // Log the full error object
      res.status(500).json({ message: error.message });
    }
  });


export { createGenre ,updateGenre,removeGenre,listgenres,readGenre,getTotalGenres };
