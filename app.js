const express=require('express');
// const ArtContact=require('./modules/contact');
const path=require('path');
const hbs=require('hbs');
const app=express();
const morgan=require('morgan');
const dotenv = require('dotenv');
dotenv.config();
//modules
const mongoose=require("mongoose");
mongoose.connect(process.env.MONGODB_SRV,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log("Connection successful!");
}).catch((e)=>{
    console.log("connection failed!",e);
});
const Product=require('./modules/product');
const Contact=require('./modules/contact');
const User=require('./modules/user');
const Cart=require('./modules/cart');
const authroute=require('./routes/auth');

const fcbk=require('./routes/facebook');
const google=require('./routes/google');
const payment=require('./routes/payment');
// const passport=require('passport');
const flash=require('connect-flash');
const session=require('express-session');
const cookieParser=require('cookie-parser');
const validator = require('express-validator');
// var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');

const cheerio = require('cheerio');
const axios=require('axios');
const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('jsondata');

require("./db/conn");
require("./seed/product-seeder");
// require("./config/passport");
// const User=require('./modules/user');
const database = require('mime-db');

// app.use(morgan('dev'));
// app.use(cookieParser());

//body parser middle ware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(validator);
// app.use(session({secret:'secretkey',resave:false,saveUninitialized:false}));

//Express session middleware

app.use(session({
    secret: 'mysupersecret', 
    resave: false, 
    saveUninitialized: true,
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { secure:true}
}));

//validator middleware

 

//Express message middleware
app.use(flash());
app.use((req,res,next)=>{
    res.locals.messages=require('express-messages')(req,res);
    next();
})

// app.use(passport.initialize());
// app.use(passport.session());


const staticPath=path.join(__dirname,'./public');
const partial_path=path.join(__dirname,'./templetes/partials')
app.use(express.static(staticPath));

app.listen(process.env.PORT || 3000,()=>{
    console.log('Server Started');
});

app.set("view engine","hbs");
app.set("views",path.join(__dirname,'./templetes/views'));
hbs.registerPartials(partial_path);

const adminpages=require('./routes/admin_pages');
const artist=require('./routes/artist');
const { requireAuth,checkUser }=require('./middleware/authMiddleware');
const product = require('./modules/product');

app.get('*',checkUser);
app.use('/',authroute);
app.use('/',payment);
app.use('/admin/pages',adminpages);
app.use('/artist',artist);

app.use('/auth/facebook',fcbk);
app.use('/auth/google',google);

// const topart=require('./routes/jsondata');
// app.use('/topart',topart);
app.get('/',(req,res)=>{
    // res.sendFile("./views/index.html",{ root: __dirname});
    res.locals.user && res.locals.user.isArtist?
    res.render("dashboard"):res.render("index");
})
app.get('/dashboard',(req,res)=>{
    res.locals.user.isArtist?
    res.render("dashboard"):res.redirect("/")
})

app.get('/about',(req,res)=>{
    // res.sendFile('./views/about.html',{root:__dirname});
    res.render("about");
})
app.get('/gallery',requireAuth,(req,res)=>{
    res.locals.user.isArtist?
    (res.redirect("/arts"))
    :(Product.find((err,doc)=>{
        res.render("gallery",{products:doc});
    }))
})

app.get('/arts',(req,res)=>{
    res.locals.user.isArtist?(Product.find({createdBy:res.locals.user.email},(err,doc)=>{
      res.render("arts",{products:doc});
    })): res.redirect("/gallery")
})
app.post('/arts',checkUser,(req,res)=>{
    const email=res.locals.user.email;
    const imagePath=req.body.imagePath;
    Product.find({imagePath:imagePath,createdBy:email},(err,result)=>{
        product.deleteOne({_id:result[0]['_id']})
        .then((result)=>{
            console.log("Product is removed Successfully!",result);
            res.redirect('/arts');
        })
        .catch((err)=>{
            res.redirect("/arts")
        })
    })
    
})
app.post('/deleteArt',(req,res)=>{
    res.redirect("/artist/arts")
})

app.get('/gallery/data',(req,res)=>{
    Product.find((err,doc)=>{
        res.send(doc);
    })
})


app.get('/contact',(req,res)=>{
    // res.sendFile("./views/contact.html",{ root: __dirname});
    res.render("contact");
})

app.post('/contact',(req,res)=>{
    Contact.findOne({name:req.params.name})
    .then(result=>{
        if(!result){
            const contact=new Contact(req.body);
            contact.save()
            .then(results=>{
                res.send(results);
                // res.sendFile('/templetes/views/contact.hbs',{ root: __dirname})
                // res.redirect('/contact');
            })
            .catch(err=>{
                console.log(err);
            })
        }
    });
    
})

app.put('/user/:name/:newName',(req,res)=>{
    const name =req.params.name;
    const newName=req.params.newName;
    User.findOne({name:name}).then(result=>{
        if(result){

            User.updateOne({name},{$set: {name:newName}},(err,resu)=>{
                console.log("Name is Updated!");
            })
            res.send(result);
        }
        else{
            res.send("Name is not Exist");
        }
    }).catch(err=>{
        res.send("Name is not Exist");
    })
})

app.get('/profile',(req,res)=>{
    res.render("profile");
})

app.get('/cart',requireAuth,(req,res)=>{
    if(res.locals.user){
        const email=res.locals.user["email"];
        Cart.find({email},(err,doc)=>{
            let amount=0
            doc.map(product=>{
                amount+=product.price;
            })
            res.render("cart",{products:doc,amount});
        });
    }

    // Cart.find((err,doc)=>{
    //     res.render("cart",{products:doc});
    // });

})

app.post('/cartdelete',checkUser,(req,res)=>{
    const email=res.locals.user["email"];
    const imagePath=req.body.imagePath;
    Cart.find({imagePath:imagePath,email:email},(err,result)=>{
        Cart.deleteOne({_id:result[0]['_id']})
        .then((result)=>{
            console.log("Product is removed Successfully!",result);
            res.redirect('/cart');
        })
    })
    
})

app.delete('/cart/:id',(req,res)=>{
    Cart.deleteOne({_id:req.params.id})
    .then(result=>{
        console.log("Product is removed")
        res.send(result);
    })
    // res.redirect('/cart');
})


app.post('/gallery',checkUser,(req,res)=>{
    const email=res.locals.user['email'];
    const imagePath=req.params.imagePath;
    const finding=Cart.findOne({imagePath:imagePath})
    .then(result=>{
        if(!result){
            const cart=new Cart({
                imagePath:req.body.imagePath,
                title:req.body.title,
                description:req.body.description,
                price:req.body.price,
                email:email,
            });
            cart.save()
            .then(result=>{
                res.redirect('/gallery');
            }).catch((error)=>{
                console.log(error);
                res.redirect('/gallery')
            });
        }
        else{
            // res.send("Product is Already Exist in the cart");
            res.redirect("/cart");
        }
    }).catch(err=>{
        res.send(err);
    })
})
