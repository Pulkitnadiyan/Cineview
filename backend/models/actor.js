import mongoose from "mongoose";

const actorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  filmography: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
  }],
});

const Actor = mongoose.model("Actor", actorSchema);

export default Actor;
