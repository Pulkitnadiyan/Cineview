import express from "express";
import {
  createActor,
  getAllActors,
  getActorById,
  updateActor,
  deleteActor,
} from "../controllers/actorController.js";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(authenticate, authorizeAdmin, createActor).get(getAllActors);

router
  .route("/:id")
  .get(getActorById)
  .put(authenticate, authorizeAdmin, updateActor)
  .delete(authenticate, authorizeAdmin, deleteActor);

export default router;
