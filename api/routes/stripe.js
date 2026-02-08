const router = require('express').Router();
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_KEY); // sk_test_...

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { name, amount, currency = 'usd' } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: name || 'Test Product' },
            unit_amount: amount, // in smallest unit (cents for USD)
          },
          quantity: 1,
        },
      ],
      // these URLs must be reachable from your browser
      success_url: 'https://ecommerce-s-reactside.vercel.app/success',
      cancel_url: 'http://localhost:5173/cancel',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;



