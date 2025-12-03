import mongoose from "mongoose";

const actorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, required: true }, // URL to image
  bio: { type: String, required: true },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }], // Filmography
}, { timestamps: true });

export default mongoose.model("Actor", actorSchema);