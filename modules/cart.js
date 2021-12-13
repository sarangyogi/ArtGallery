const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const CartSchema= new Schema({
    imagePath:{
        type:String,
        required:false,
    },
    title:{
        type:String,
        required:false,
    },
    description:{
        type:String,
        required:false,
    },
    price:{
        type:Number,
        required:false,
    },
    email:{
        type:String,
        required:false,
    }
});

module.exports= mongoose.model('Cart',CartSchema);