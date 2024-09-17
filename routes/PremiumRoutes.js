const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middlewares/is_authenticated.middleware'); // Adjust the path if needed
const stripe = require('stripe')('sk_test_51Pt9J2HdZ7eeB3thayfy9Oztxo09WnDYlIaJFNcDa4e4ASJEUC18oxu1HWTvj9grGoy0Muza0oTTchWxJtCjZnLm00Vid2hfbt');
const User = require('../models/user'); // Adjust the path to your User model
const PaymentPlans = require('../models/PaymentPlans');
const Payment = require('../models/Payment');

// Route to render premium page
router.get('/', isAuthenticated, (req, res) => {
    res.render('premium'); // Ensure this EJS file is named 'premium.ejs'
});

// Route to handle payment initiation
router.post('/pay', isAuthenticated, async (req, res) => {
    try {
        const user_id = req.user.id;
        
        // Fetch the premium plan details (assuming there's only one plan)
        const plan = await PaymentPlans.findOne({
            where: { id: 1 } // Replace with the actual plan ID or logic to fetch the active plan
        });

        if (!plan) {
            return res.status(404).send('Premium plan not found.');
        }

        // Create a payment entry
        const payment = await Payment.create({
            user_id: user_id,
            amount: plan.price, // Store the plan price
            payment_status: 'pending'
        });

        // Prepare line item for Stripe
        const line_item = {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Vibe Stream Premium',
                    description: 'Access to all premium features of Vibe Stream, including exclusive content, ad-free listening, and more.',
                },
                unit_amount: Math.round(plan.price * 100), // Stripe amount should be in cents
            },
            quantity: 1,
        };

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            line_items: [line_item],
            mode: 'payment',
            success_url: `http://localhost:3000/Premium/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/cancel`,
        });

        res.redirect(session.url);
    } catch (error) {
        console.error('Error creating Stripe payment session:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle payment success
router.get('/success', isAuthenticated, async (req, res) => {
    try {
        const user_id = req.user.id;
        const session_id = req.query.session_id;

        // Fetch the user details
        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).send('User not found.');
        }

        // Verify the Stripe session to ensure payment was successful
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);

        if (paymentIntent.status === 'succeeded') {
            // Update the user's premium status
            await User.update({ premium: true }, { where: { id: user_id } });

            // Update the payment record to completed
            await Payment.update({ payment_status: 'completed' }, { where: { user_id: user_id } });

            // Render the success page with user details
            res.render('success', {
                username: user.name || 'User', // Default to 'User' if username is not available
                message: 'Thank you for your purchase! Your payment was successful, and your account has been upgraded to premium.'
            });
        } else {
            res.status(400).send('Payment not completed.');
        }
    } catch (error) {
        console.error('Error handling payment success:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
