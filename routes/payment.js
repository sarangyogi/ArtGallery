const express=require('express');
const bodyParser=require('body-parser');
const router=express.Router();
const Cart=require('./../modules/cart');
const { requireAuth,checkUser }=require('./../middleware/authMiddleware');

var Publishable_Key = process.env.STRIPE_Publishable_Key;
var Secret_Key = process.env.STRIPE_Secret_Key;

const stripe = require('stripe')(Secret_Key);

router.get('/payment',checkUser,(req,res)=>{
    if(res.locals.user){
        const email=res.locals.user["email"];
        Cart.find({email},(err,doc)=>{
            // console.log(doc.length);
            let amount=0
            doc.map(product=>{
                amount+=product.price;
            })
            res.render("checkout",{amount,key: Publishable_Key,stripeAmount:amount*100});
        });
    }
})

router.post('/charge',checkUser,async (req, res) => {
  const amount = await req.body.price;
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken,
    name: req.body.name,
    address: {
      line1: req.body.address,
      postal_code: req.body.postal,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
    },
  })
  .then(customer => stripe.charges.create({
    amount: amount*100,
    description: 'Art Gallery Painting',
    currency: 'inr',
    customer: customer.id
  }))
  .then(charge => res.render('success'))
  .catch((error)=>{
    console.log(error);
    res.render('cart');
  });
});

// router.use(express.urlencoded({extended:true}));
// router.get('/checkout-session', async (req, res) => {
//     const { sessionId } = req.query;
//     const session = await stripe.checkout.sessions.retrieve(sessionId);
//     res.send(session);
// });
  
// router.post('/create-checkout-session', async (req, res) => {
//     // const domainURL = process.env.DOMAIN;
//     const domainURL= "http://localhost:3000";
//     const pmTypes ='card';
//     const product = await stripe.products.create({
//         name: 'Starter Setup',
//     });
//     const price = await stripe.prices.create({
//         product: product['id'],
//         unit_amount: 2000,
//         currency: 'usd',
//     });
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: pmTypes,
//       mode: 'payment',
//       line_items: [{
//         price:price['id'],
//         quantity: 1,
//       }],
//       success_url: `${domainURL}/gallery`,
//       cancel_url: `${domainURL}/cart`,
//       // automatic_tax: { enabled: true }
//     });
  
//     return res.redirect(303, session.url);
// });
// router.post('/webhook', async (req, res) => {
//     let event;
//     if (process.env.STRIPE_WEBHOOK_SECRET) {
//       let signature = req.headers['stripe-signature'];
  
//       try {
//         event = stripe.webhooks.constructEvent(
//           req.rawBody,
//           signature,
//           process.env.STRIPE_WEBHOOK_SECRET
//         );
//       } catch (err) {
//         console.log(`⚠️  Webhook signature verification failed.`);
//         return res.sendStatus(400);
//       }
//     } else {
//       event = req.body;
//     }
  
//     if (event.type === 'checkout.session.completed') {
//       console.log(`🔔  Payment received!`);
//     }
  
//     res.sendStatus(200);
// });

module.exports=router;