const express=require('express');
const mongoose=require('mongoose');
// const ArtContact=require('./modules/contact');
const path=require('path');
const hbs=require('hbs');
const app=express();
const morgan=require('morgan');
//modules
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
// mongodb+srv://user:<password>@nodecrash.x5lyq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// const dbURI="mongodb+srv://user:easypassword@nodecrash.x5lyq.mongodb.net/nodecrash?retryWrites=true&w=majority";
// mongoose.connect(dbURI,{useNewUrlParser:true,useUnifiedTopology:true})
// .then((result)=>{
//     console.log('Connected to DB');
// })
// .catch((error)=>{
//     console.log(error);
// });

app.listen(3000,()=>{
    console.log('Listening on port 3000');
});

app.set("view engine","hbs");
app.set("views",path.join(__dirname,'./templetes/views'));
hbs.registerPartials(partial_path);

const adminpages=require('./routes/admin_pages');
const { requireAuth,checkUser }=require('./middleware/authMiddleware');
const product = require('./modules/product');

app.use('/',authroute);
app.use('/',payment);
app.use('/admin/pages',adminpages);

app.use('/auth/facebook',fcbk);
app.use('/auth/google',google);

// const topart=require('./routes/jsondata');
// app.use('/topart',topart);
app.get('*',checkUser);
app.get('/',(req,res)=>{
    // res.sendFile("./views/index.html",{ root: __dirname});
    res.render("index");
})
app.get('/about',(req,res)=>{
    // res.sendFile('./views/about.html',{root:__dirname});
    res.render("about");
})
app.get('/gallery',requireAuth,(req,res)=>{
    Product.find((err,doc)=>{
        res.render("gallery",{products:doc});
    });
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
    // const user=User.find(e=>e.name==name);
    // user.name=newName;
    // res.send(user);
    // console.log(name,newName);
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
    // console.log(res.locals.user)
    if(res.locals.user){
        const email=res.locals.user["email"];
        Cart.find({email},(err,doc)=>{
            // console.log(doc.length);
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
        // console.log(result,email,imagePath);
        Cart.deleteOne({_id:result[0]['_id']})
        .then((result)=>{
            console.log("Product is removed Successfully!",result);
            res.redirect('/cart');
        })
    })
    
})

app.delete('/cart/:id',(req,res)=>{
    // console.log(req.params.imagePath);
    Cart.deleteOne({_id:req.params.id})
    .then(result=>{
        console.log("Product is removed")
        console.log(result);
        res.send(result);
    })
    // res.redirect('/cart');
})


app.post('/gallery',checkUser,(req,res)=>{
    console.log(res.locals.user);
    const email=res.locals.user['email'];
    const imagePath=req.params.imagePath;
    const finding=Cart.findOne({imagePath:imagePath})
    .then(result=>{
        console.log(result)
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
                // res.send(result)
                // res.redirect('/cart');
                res.redirect('/gallery');
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


// app.get('/set-cookies',(req,res)=>{
//     res.cookie('newUser',false);
//     res.send("You got the cookies!");
// })

// app.get('/read-cookies',(req,res)=>{
//     const cookies=req.cookies;
//     res.json(cookies);
// })

// app.get('/register',(req,res)=>{
//     res.render("register");
// })
// app.use(express.urlencoded({extended:true}));
// app.post('/register',async (req,res)=>{
//     try{
//         const name=req.body.name;
//         const email=req.body.email;
//         const password=req.body.password;
//         const registerEmployee=new User({
//             name:name,
//             email:email,
//             password:password,
//         })
//         // console.log(name,password,email);
//         const user= await registerEmployee.save();

//         res.redirect('/register');
//     }catch(error){
//         res.status(400).send(error);
//     }
// })
// app.get('/login',(req,res)=>{
//     res.render("login");
// })

// app.post('/login',async (req,res)=>{
//     try{
//         const email=req.body.email;
//         const password=req.body.password;

//         const useremail=await Register.findOne({email:email});
//         const databasepassword=useremail.password;
//         // console.log(useremail);
//         if(databasepassword===password){
//             res.redirect('/');
//         }else{
//             res.sendStatus(400).redirect('/login');
//         }
        
//     }catch(error){
//         res.sendStatus(400).redirect("/login");
//     }
    
// })

// app.use(express.urlencoded({extended:true}));
// app.post('/contactme',(req,res)=>{
//     const artContact=new ArtContact(req.body);
//     artContact.save()
//     .then(result=>res.sendFile('./views/contact.html',{ root: __dirname}))
//     .catch(err=>console.log(err));
// })


// async function jsondata(){
//     try{
//         const siteUrl="https://en.wikipedia.org/wiki/List_of_most-visited_art_museums";
//         const { data }=await axios({
//             method: "GET",
//             url:siteUrl,
//         })
//         const $=cheerio.load(data);
//         const textselector='#mw-content-text > div.mw-parser-output > table > tbody > tr'

//         const keys=[
//             'N.',
//             'Museum',
//             'City',
//             'Visitors annually',
//             'Image',
//         ]
//         let artArray=[];

//         $(textselector).each((index,element)=>{
//             let keyIndex=0
//             const artObj={}

//             if(index<=10 && index>=1){
//                 // console.log(index);
//                 $(element).children().each((childindex,childelement)=>{
//                     let value=$(childelement).text();

//                     if(keyIndex==4){
//                         value="Image URL"
//                     }
//                     if(value){
//                         // console.log(value)
//                         artObj[keys[keyIndex]]=value;
//                         keyIndex++
//                     }
//                 })
//                 if(artObj){
//                     artArray.push(artObj);
//                 }
//             }
//             // return index;
//         })
//         return artArray
//     }catch(err){
//         console.log(err)
//     }
// }
// const headingColumnNames = [
//     'N.',
//     'Museum',
//     'City',
//     'Visitors annually',
//     'Image',
// ]
// let headingColumnIndex = 1;
// headingColumnNames.forEach(heading => {
//     ws.cell(1, headingColumnIndex++)
//         .string(heading)
// });

// app.get("/topart",async (req,res)=>{
//     try{
//         const toparts=await jsondata();

//         let rowIndex = 2;
//         toparts.forEach( record => {
//             let columnIndex = 1;
//             Object.keys(record ).forEach(columnName =>{
//                 ws.cell(rowIndex,columnIndex++)
//                     .string(record [columnName])
//             });
//             rowIndex++;
//         });
//         wb.write('jsondata.xlsx');

//         return res.status(200).json({
//             result:toparts,
//         })
//     }catch(err){
//         return err
//     }
// })
