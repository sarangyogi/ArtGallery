const mongoose=require('mongoose');
const { isEmail }=require('validator');
const bcrypt=require('bcryptjs');


const employeeSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: [isEmail,'Please enter a valid email']
    },
    password:{
        type:String,
        required:true,
        minlength:[4,'Minimum password length is 4 characters']
    },
    isArtist:{
        type:Boolean,
        required:true,
    }
})
// employeeSchema.methods.encryptPassword= (password)=>{
//     return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null);
// }
// employeeSchema.methods.validPassword=(password)=>{
//     return bcrypt.compareSync(password,this.password);
// }

employeeSchema.pre('save', async function(next){
    const salt=await bcrypt.genSaltSync();
    this.password=await bcrypt.hashSync(this.password,salt);
    next();
})

//static method to login user
employeeSchema.statics.login=async function(email,password){
    const user=await this.findOne({email});
    if(user){
        const auth=bcrypt.compareSync(password,user.password);
        if(auth){
            return user;
        }
        throw Error("Incorrect password");
    }
    throw Error("Incorrect Email");
}


const User= new mongoose.model("User",employeeSchema);
module.exports=User;