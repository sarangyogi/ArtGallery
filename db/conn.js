const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://user:easypassword@nodecrash.x5lyq.mongodb.net/ArtGallery?retryWrites=true&w=majority/ArtGallery",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
}).then(()=>{
    console.log("Connection successful!");
}).catch((e)=>{
    console.log("connection failed!");
});