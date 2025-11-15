
import express from 'express';
//controllers
import {createUser,loginuser,logoutcurrentuser,getAllUsers,getcurrentuserprofile,updatecurrentuserprofile} from '../controllers/usercontroller.js';
//middlewares
import { authenticate,authorizeAdmin } from '../middlewares/authmiddleware.js';

const router=express.Router();
router.route('/').post(createUser).get(authenticate,authorizeAdmin,getAllUsers);
router.post("/auth",loginuser);
router.post("/logout",logoutcurrentuser);
router.route('/profile').get(authenticate,getcurrentuserprofile).put(authenticate,updatecurrentuserprofile);
export default router;