const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const passport=require('passport');
const googleStrategy=require('passport-google-oauth20').Strategy;
const expressValidator = require('express-validator');
const User=require('./../modules/user');
router.use(expressValidator());


router.use(passport.initialize());

const maxAge=3*24*60*60;
const createToken=(id)=>{
    return jwt.sign({ id },'My Super Secret',{
        expiresIn:maxAge
    });
}
var tempmail="";

//facebook strategy
passport.use(new googleStrategy({

    // pull in our app id and secret from our auth.js file
    clientID        : "970905875030-q6p06hgqfequ1q1rbq22oo31v12tb127.apps.googleusercontent.com",
    clientSecret    : "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",
    callbackURL     : "http://localhost:3000/auth/google/callback",
    profileFields:['id','displayName','email']

},// facebook will send back the token and profile
async function(tok, refreshToken, profile, done) {
    // const name=profile.displayName;
    const email=profile._json['email'];
    const name=email.substr(0,email.indexOf('@'));
    tempmail=email;
    let password=profile.id;
    try{
        // password=await bcrypt.hash(password,10);
        const registerEmployee=new User({
            name:name,
            email:email,
            password:password,
        })
        // console.log(name,password,email);
        const user= await registerEmployee.save();
    }catch(error){
        return done(null,profile)
    }
    // console.log(profile)
    return done(null,profile)
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    
    return done(null,user)
});

router.get('/',passport.authenticate('google',{scope:'email'}));

router.get('/callback',passport.authenticate('google',{
    successRedirect:'/auth/google/success',
    failureRedirect:'/login'
}))

router.get('/success',async (req,res)=>{
    try{
        await User.find({email:tempmail},(err,result)=>{
            // console.log(result[0])
            const token=createToken(result[0]["_id"]);
            res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        })
        res.redirect('/');
    }
    catch(err){
        res.redirect('/login');
    }
})

router.get('/failed',(req,res)=>{
    res.redirect('/register');
    // res.send("Login failed");
})

module.exports=router;
