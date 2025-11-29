import express from 'express';

const router = express.Router();

//controllers
import { createGenre,updateGenre,removeGenre,listgenres,readGenre,getTotalGenres } from '../controllers/genrecontroller.js';
//Middlewares

import { authenticate, authorizeAdmin } from '../middlewares/authmiddleware.js';
router.route('/').post(authenticate, authorizeAdmin, createGenre);
router.route('/').get(listgenres);
router.route('/total').get(getTotalGenres);
router.route('/:id').put(authenticate, authorizeAdmin, updateGenre);
router.route('/:id').delete(authenticate, authorizeAdmin, removeGenre);

router.route('/:id').get(readGenre);



export default router;