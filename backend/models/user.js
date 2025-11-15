import e from "express";
import mongoose from "mongoose";

const Userschema=mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },

    isAdmin:{
        type:Boolean,
        required:true,
        default:false,
    },
},{timestamps:true});
const User=mongoose.model("User",Userschema);   
export default User;