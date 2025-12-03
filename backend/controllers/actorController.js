import Actor from "../models/actor.js";
import asynchandler from '../middlewares/asynchandlers.js';

const createActor = asynchandler(async (req, res) => {
  const { name, photo, bio } = req.body;

  if (!name || !photo || !bio) {
    res.status(400);
    throw new Error("Please fill all required fields: name, photo, and bio.");
  }

  const newActor = new Actor(req.body);
  const savedActor = await newActor.save();
  res.json(savedActor);
});

const getAllActors = asynchandler(async (req, res) => {
  const actors = await Actor.find({});
  res.json(actors);
});

const getActorById = asynchandler(async (req, res) => {
  const { id } = req.params;
  const actor = await Actor.findById(id);
  if (!actor) {
    res.status(404);
    throw new Error("Actor not found");
  }
  res.json(actor);
});

const updateActor = asynchandler(async (req, res) => {
  const { id } = req.params;
  const updatedActor = await Actor.findByIdAndUpdate(id, req.body, { new: true });
  if (!updatedActor) {
    res.status(404);
    throw new Error("Actor not found");
  }
  res.json(updatedActor);
});

const deleteActor = asynchandler(async (req, res) => {
  const { id } = req.params;
  const deletedActor = await Actor.findByIdAndDelete(id);
  if (!deletedActor) {
    res.status(404);
    throw new Error("Actor not found");
  }
  res.json({ message: "Actor deleted" });
});

export {
  createActor,
  getAllActors,
  getActorById,
  updateActor,
  deleteActor,
};
