const passport=require('passport');
var bCrypt = require('bcrypt-nodejs');
const User=require('../modules/user');
const flash=require('connect-flash');
const LocalStrategy= require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local.register',new LocalStrategy({
    nameField:'name',
    usernameField: 'email',
    passwordField:'password',
    passReqToCallback:true
},(req,name,email,password,done)=>{
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
           messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email':email},(err,user)=>{
        if(err){
            return done(err);
        }
        // if(user){
        //     return done(null,false,{message:"Email already exist"});
        // }
        
        let newUser=new User();
        newUser.name=name;
        newUser.email=email;
        newUser.password=newUser.encryptPassword(password);
        newUser.save((err,result)=>{
            if(err){
                return;
                // return done(err);
            }
            return done(null,newUser);
        });
    });
}));