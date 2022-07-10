const express=require('express');
const router=express.Router();
// const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const passport=require('passport');
const facebookStrategy=require('passport-facebook').Strategy;
// const session=require('express-session');
const expressValidator = require('express-validator');
// const { requireAuth,checkUser }=require('./../middleware/authMiddleware');
const User=require('./../modules/user');
router.use(expressValidator());
const JWT_SECRET=process.env.JWT_SECRET_KEY
router.use(passport.initialize());
// router.use(passport.session());
// router.use(session({secret:JWT_SECRET}))

const maxAge=3*24*60*60;
const createToken=(id)=>{
    return jwt.sign({ id },JWT_SECRET,{
        expiresIn:maxAge
    });
}
var tempmail="";

//facebook strategy
passport.use(new facebookStrategy({
    // pull in our app id and secret from our auth.js file
    clientID        : process.env.FACEBOOK_CLIENT_ID,
    clientSecret    : process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL     : "http://localhost:3000/auth/facebook/callback",
    profileFields:['id','displayName','email']

},// facebook will send back the token and profile
async function(tok, refreshToken, profile, done) {
    const name=profile.displayName;
    const email=profile._json['email'];
    tempmail=email;
    let password=profile._json['id'];
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

router.get('/',passport.authenticate('facebook',{scope:'email'}));

router.get('/callback',passport.authenticate('facebook',{
    successRedirect:'/auth/facebook/success',
    failureRedirect:'/login'
}))

router.get('/success',async (req,res)=>{
    try{
        await User.find({email:tempmail},(err,result)=>{
            console.log(result,tempmail)
            if(err){
                res.redirect('/')
            }
            if(result.length==0){
                res.redirect('/login')
            }
            else{
                const token=createToken(result[0]["_id"]);
                res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
            }
        })
        res.redirect('/');
    }
    catch(err){
        res.redirect('/login');
    }   
    // console.log(idt);
    // const token=createToken(idt);
    // res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
    
})

router.get('/failed',(req,res)=>{
    res.redirect('/register');
    // res.send("Login failed");
})

module.exports=router;