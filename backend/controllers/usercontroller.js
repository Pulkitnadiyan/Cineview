import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import asynchandler from '../middlewares/asynchandlers.js';
import createToken from '../utils/createtoken.js';
import e from 'express';

const createUser = asynchandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please fill all the inputs.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).send("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    const token = createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: token, // Add the token to the response
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginuser = asynchandler(async (req, res) => {
  const { email, password } = req.body;
 const existingUser = await User.findOne({ email });
  if(existingUser){
    const ispassowrdcorrect=await bcrypt.compare(password,existingUser.password);
    if(ispassowrdcorrect){
      const token = createToken(res, existingUser._id);

      res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
        token: token,
      });
    }else{
      res.status(401).json({message:"Invalid email or password"});
    }
}
else{
  res.status(400).json({message:"user not found"});
}
});
  
const logoutcurrentuser=asynchandler(async(req,res)=>{
  res.cookie('jwt','',{
    httpOnly:true,
    expires:new Date(0)
  });
  res.status(200).json({message:"user logged out successfully"});
  
});

const getAllUsers=asynchandler(async(req,res)=>{
  const users=await User.find({});
  res.json(users);
});

const getcurrentuserprofile=asynchandler(async(req,res)=>{
  const user=await User.findById(req.user._id);
  if(user){
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  }else{
    res.status(404);
    throw new Error("User not found");
  }

} );
const updatecurrentuserprofile=asynchandler(async(req,res)=>{
  const user=await User.findById(req.user._id);
  if(user){
    user.username=req.body.username || user.username;
    user.email=req.body.email || user.email;
    if(req.body.password){
      const salt=await bcrypt.genSalt(10);
      const hashedPassword=await bcrypt.hash(req.body.password,salt);
      user.password=hashedPassword;
    }
const updateduser=await user.save();
res.json({
  _id: updateduser._id,
  username: updateduser.username,
  email: updateduser.email,
  isAdmin: updateduser.isAdmin,
});
  }
  else{
    res.status(404);
    throw new Error("User not found");
    }
 
    });
export { createUser, loginuser,logoutcurrentuser,getAllUsers ,getcurrentuserprofile,updatecurrentuserprofile};
