const mongoose = require("mongoose");
const {Schema} = mongoose;

const scoreSchema = new Schema({
    name:{type:String,required:true},
    duration:{type:String,required:true},
    score:{type:Number,required:true}
},{collection:"Scores"})

const Scores = mongoose.model("Scores",scoreSchema);
module.exports = Scores;