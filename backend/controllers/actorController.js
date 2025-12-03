import Actor from "../models/actor.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Create Actor
const createActor = asyncHandler(async (req, res) => {
  const { name, photo, bio } = req.body;
  const actor = await Actor.create({ name, photo, bio });
  res.status(201).json(actor);
});

// Get All Actors
const getAllActors = asyncHandler(async (req, res) => {
  const actors = await Actor.find({});
  res.json(actors);
});

// Get Specific Actor
const getActorById = asyncHandler(async (req, res) => {
  const actor = await Actor.findById(req.params.id).populate("movies");
  if (actor) {
    res.json(actor);
  } else {
    res.status(404);
    throw new Error("Actor not found");
  }
});

// Update Actor
const updateActor = asyncHandler(async (req, res) => {
  const actor = await Actor.findById(req.params.id);
  if (actor) {
    actor.name = req.body.name || actor.name;
    actor.photo = req.body.photo || actor.photo;
    actor.bio = req.body.bio || actor.bio;
    const updatedActor = await actor.save();
    res.json(updatedActor);
  } else {
    res.status(404);
    throw new Error("Actor not found");
  }
});

// Delete Actor
const deleteActor = asyncHandler(async (req, res) => {
  const actor = await Actor.findById(req.params.id);
  if (actor) {
    await actor.deleteOne();
    res.json({ message: "Actor removed" });
  } else {
    res.status(404);
    throw new Error("Actor not found");
  }
});

export { createActor, getAllActors, getActorById, updateActor, deleteActor };