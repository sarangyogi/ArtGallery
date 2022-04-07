const express=require("express");
const { checkUser } = require("../middleware/authMiddleware");
const router=express.Router();
const path = require("path")
const hbs=require('hbs');
const multer=require("multer")
const fileUpload = require('express-fileupload');
const morgan=require("morgan")
const Product=require("./../modules/product")
const requireAuth=require("./../middleware/authMiddleware")
router.use(morgan('dev'));

const staticPath=path.join(__dirname,'./../public');
router.use(express.static(staticPath));
router.get('*',checkUser);

var storage = multer.diskStorage({
    destination: path.join(__dirname, "./../public/assets/"),
    filename: function(req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    },
})

const upload = multer({ storage: storage }).single('file')
router.get('/upload',(req,res)=>{
    res.locals.user.isArtist?
    res.render("upload"):res.redirect("/")
})
router.post("/upload",upload,async(req, res) => {
  // console.log(req.file.originalname,req.body)
  // imagePath: `assets/${req.file.fieldname}-${req.body.email}${path.extname(req.file.originalname)}`,
  try{
    const Art=new Product({
      imagePath: `assets/${req.file.filename}`,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      createdBy: req.body.email,
    })
    console.log(Art)
    const art=await Art.save()
    res.redirect("/artist/upload")
  }catch(err){
    console.log(err)
    res.redirect('/')
  }
  
})

module.exports=router;