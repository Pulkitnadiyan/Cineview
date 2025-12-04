import mongoose from "mongoose";
import genre from "./genre.js";

const {ObjectId}=mongoose.Schema;

const reviewSchema=new mongoose.Schema({
    name:{type:String,required:true},
    rating:{type:Number,required:true},
    comment:{type:String,required:true},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }

}
,{timestamps:true}
);

const movieSchema=new mongoose.Schema({
    name:{type:String,required:true},
    image:{type:String},
    year:{type:Number,required:true},
    genre:{type:ObjectId,ref:'Genre',required:true},
    detail:{type:String,required:true   },
    reviews:[reviewSchema],
    rating:{type:Number,required:true,default:0},
    numReviews:{type:Number,required:true,default:0},
    trailer:{type:String},
    mood:[{type:String}],
    CreatedAt:{type:Date,default:Date.now},
    cast: [{ type: ObjectId, ref: "Actor" }],
}
,{timestamps:true

})

const Movie=mongoose.model('Movie',movieSchema);
export default Movie;