const Product=require('./../modules/product');
const mongoose=require('mongoose');

// mongoose.connect('mongodb://localhost:27017/ArtGallery/');

const products=[
    new Product({
        imagePath:"assets/Antique/1.jpg",
        title:'Antique Painting',
        description:'lorem Ipsum',
        price:100,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/BlackAndWhite/1.jpeg",
        title:'Antique Painting',
        description:'lorem Ipsum',
        price:200,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/BlackAndWhite/2.jpeg",
        title:'Antique Painting',
        description:'lorem Ipsum',
        price:1300,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/BlackAndWhite/3.jpeg",
        title:'Antique Painting',
        description:'lorem Ipsum',
        price:1400,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/BlackAndWhite/4.jpeg",
        title:'Antique Painting',
        description:'lorem Ipsum',
        price:1500,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/BlackAndWhite/5.jpeg",
        title:'Antique Painting',
        description:'lorem Ipsum',
        price:1600,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/Colourful/1.jpeg",
        title:'Antique Painting',
        description:'lorem Ipsum',
        price:1700,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/Colourful/2.jpg",
        title:'Antique Painting',
        description:'lorem Ipsum',
        price:1800,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/Colourful/3.jpeg",
        title:'Antique Painting',
        description:'lorem Ipsum',
        price:1900,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/Colourful/4.jpeg",
        title:'Antique Painting',
        description:'lorem Ipsum',
        price:1000,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/Decorative/1.jpg",
        title:'Decorative',
        description:'lorem Ipsum',
        price:1001,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/Decorative/2.jpg",
        title:'Decorative',
        description:'lorem Ipsum',
        price:1003,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/Decorative/3.jpg",
        title:'Decorative',
        description:'lorem Ipsum',
        price:1004,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/IndianTradition/1.jpeg",
        title:'IndianTradition',
        description:'lorem Ipsum',
        price:1005,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/IndianTradition/2.jpeg",
        title:'IndianTradition',
        description:'lorem Ipsum',
        price:1006,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/IndianTradition/3.jpeg",
        title:'IndianTradition',
        description:'lorem Ipsum',
        price:1007,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/IndianTradition/4.jpeg",
        title:'IndianTradition',
        description:'lorem Ipsum',
        price:1008,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/IndianTradition/5.jpeg",
        title:'IndianTradition',
        description:'lorem Ipsum',
        price:1009,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/IndianTradition/6.jpeg",
        title:'IndianTradition',
        description:'lorem Ipsum',
        price:10001,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/Paintings/1.jpg",
        title:'Painting',
        description:'lorem Ipsum',
        price:10011,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/Paintings/2.jpg",
        title:'Painting',
        description:'lorem Ipsum',
        price:10012,
        createdBy:"test@gmail.com"
    }),
    new Product({
        imagePath:"assets/Paintings/3.jpg",
        title:'Painting',
        description:'lorem Ipsum',
        price:10013,
        createdBy:"test@gmail.com"
    }),
]

let done=0;

for(let i=0;i<products.length;i++){
    Product.findOne({imagePath:products[i].imagePath})
    .then(result=>{
        if(!result){
            products[i].save(function(){
                done++;
                if(done==products.length){
                    exit();
                }
            });
        }
    })
}
function exit(){
    mongoose.disconnect();
}