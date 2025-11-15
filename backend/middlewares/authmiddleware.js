import jwt from 'jsonwebtoken';
import user from '../models/user.js';
import asynchandler from './asynchandlers.js';

//check if user is authenticated
const authenticate=asynchandler(async(req,res,next)=>{
    let token;
    console.log(process.env.JWT_SECRET)

    // Read JWT from 'Authorization' header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // If token not found in header, try reading from cookies
    if (!token) {
        token = req.cookies.jwt;
    }
    
    if(token){
        try{
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await user.findById(decoded.userId).select('-password');
            next();
        }
        catch(error){
            res.status(401);
            throw new Error("Not authorized, token failed");
        }   
    }else{
        res.status(401);
        throw new Error("Not authorized, no token");
    }
});
//check if user is admin
const authorizeAdmin=asynchandler(async(req,res,next)=>{
    console.log("Admin Check: Is Admin? ->", req.user?.isAdmin); 
    console.log("User Object Exists? ->", !!req.user);
    if(req.user && req.user.isAdmin){
        next();
    }else{
        res.status(401);
        throw new Error("Not authorized as an admin");
    }
});
export {authenticate,authorizeAdmin};