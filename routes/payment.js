const express=require('express');
const bodyParser=require('body-parser');
const router=express.Router();
const Cart=require('./../modules/cart');
const { requireAuth,checkUser }=require('./../middleware/authMiddleware');

var Publishable_Key = 'pk_test_51K08A5SFuW4CQ0ZGjrVDlI3t2rbE2TAq8UdOX5S3Nl9byxsLyp5ueKusql4qI6XJxPTBxfcFyTXZpPeU4Bq3RK1G00Mi436IXV'
var Secret_Key = 'sk_test_51K08A5SFuW4CQ0ZGXPhwSLeeQBsvl45ZAzLxHjpbjqjC9cM3oD3dlxsFCOeINpMYKA3yCYW3EeskVCDuK2tt1XkW00zRdlHRMh'

const stripe = require('stripe')(Secret_Key) 

router.get('/payment',checkUser,(req,res)=>{
    if(res.locals.user){
        const email=res.locals.user["email"];
        Cart.find({email},(err,doc)=>{
            // console.log(doc.length);
            let amount=0
            doc.map(product=>{
                amount+=product.price;
            })
            res.render("checkout",{amount,key: Publishable_Key});
        });
    }
})
router.use(express.urlencoded({extended:true}));
router.get('/checkout-session', async (req, res) => {
    const { sessionId } = req.query;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.send(session);
});
  
router.post('/create-checkout-session', async (req, res) => {
    // const domainURL = process.env.DOMAIN;
    const domainURL= "http://localhost:3000";
    // The list of supported payment method types. We fetch this from the
    // environment variables in this sample. In practice, users often hard code a
    // list of strings for the payment method types they plan to support.
    // const pmTypes = (process.env.PAYMENT_METHOD_TYPES || 'card').split(',').map((m) => m.trim());
    const pmTypes ='card';
    const product = await stripe.products.create({
        name: 'Starter Setup',
    });
    const price = await stripe.prices.create({
        product: product['id'],
        unit_amount: 2000,
        currency: 'usd',
    });
    // console.log(product);
    // Create new Checkout Session for the order
    // Other optional params include:
    // For full details see https://stripe.com/docs/api/checkout/sessions/create
    const session = await stripe.checkout.sessions.create({
      payment_method_types: pmTypes,
      mode: 'payment',
      line_items: [{
        // price: process.env.PRICE,
        price:price['id'],
        quantity: 1,
      }],
      // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
      success_url: `${domainURL}/gallery`,
      cancel_url: `${domainURL}/cart`,
      // automatic_tax: { enabled: true }
    });
  
    return res.redirect(303, session.url);
});
router.post('/webhook', async (req, res) => {
    let event;
  
    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let signature = req.headers['stripe-signature'];
  
      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `.env`,
      // retrieve the event data directly from the request body.
      event = req.body;
    }
  
    if (event.type === 'checkout.session.completed') {
      console.log(`🔔  Payment received!`);
  
      // Note: If you need access to the line items, for instance to
      // automate fullfillment based on the the ID of the Price, you'll
      // need to refetch the Checkout Session here, and expand the line items:
      //
      // const session = await stripe.checkout.sessions.retrieve(
      //   'cs_test_KdjLtDPfAjT1gq374DMZ3rHmZ9OoSlGRhyz8yTypH76KpN4JXkQpD2G0',
      //   {
      //     expand: ['line_items'],
      //   }
      // );
      //
      // const lineItems = session.line_items;
    }
  
    res.sendStatus(200);
});

module.exports=router;