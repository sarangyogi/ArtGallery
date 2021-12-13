const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const artcontactSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:false
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
},{timestamps:true})

// const ArtContact=mongoose.model('ArtContact',artcontactSchema);
module.exports= mongoose.model('Contact',artcontactSchema);
// module.exports=ArtContact;