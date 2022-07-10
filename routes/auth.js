const express=require('express');
const router=express.Router();
const expressValidator = require('express-validator');
router.use(expressValidator());
const mongoose=require('mongoose');
// const passport = require('passport');
const User=require('./../modules/user');
// const csrf=require('csurf');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const { requireAuth,checkUser }=require('./../middleware/authMiddleware');



require("./../db/conn");
const JWT_SECRET=process.env.JWT_SECRET_KEY

const handleError=(err)=>{
    console.log(err.message);
    let error={email:"",password:""};

    //validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties})=>{
            error[properties.path]=properties.message;
        });
    }
    return error
}
const maxAge=3*24*60*60;
const createToken=(id)=>{
    return jwt.sign({ id },JWT_SECRET,{
        expiresIn:maxAge
    });
}

// const csrfProtection=csrf();
// router.use(csrfProtection);
router.get('/register',(req,res,next)=>{
    // res.render("register",{csrfToken:req.csrfToken()});
    res.render("register");
})

router.use(express.urlencoded({extended:true}));
router.post('/register',async (req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const isArtist=req.body.isArtist;
    let password=req.body.password;
    try{
        // password=await bcrypt.hash(password,10);
        const registerEmployee=new User({
            name:name,
            email:email,
            password:password,
            isArtist:isArtist,
        })
        const user= await registerEmployee.save();
        const token=createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});

        res.redirect('/login');
    }catch(error){
        if(error.code===11000){
            return res.json({ststus:"error", error:"You are already registered! Email is already exist"});
        }
        else{
            const err=handleError(error);
            return res.redirect('/register');
        }
    }
})

// router.post('/register',passport.authenticate('local.register',{
//     successRedirect:'/profile',
//     failureRedirect:'/register',
//     failureFlash:true
// }))


router.get('/login',(req,res)=>{
    res.render("login");
})

router.post('/login',async (req,res)=>{
    const email=req.body.email;
    const password=req.body.password;

    try{
        const user=await User.login(email,password);
        const token=createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});

        res.redirect('/');
    }catch(error){
        const err=handleError(error);
        res.status(400).redirect("/login");
    }
    
})

router.get('/logout',requireAuth,(req,res)=>{
    res.cookie("jwt","",{maxAge:1});
    res.redirect('/');
})

module.exports=router;