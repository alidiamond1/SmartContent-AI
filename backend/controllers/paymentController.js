import Stripe from 'stripe';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

if (!stripe) {
  console.error('⚠️  WARNING: STRIPE_SECRET_KEY is not set. Payment features will not work.');
}

// Credit packages
const creditPackages = {
  starter: {
    credits: 50,
    price: 0, // Free tier - $0
    priceId: null
  },
  basic: {
    credits: 100,
    price: 900, // $9 in cents
    priceId: 'price_basic'
  },
  pro: {
    credits: 500,
    price: 2900, // $29 in cents
    priceId: 'price_pro'
  },
  unlimited: {
    credits: 9999,
    price: 9900, // $99 in cents
    priceId: 'price_unlimited'
  }
};

// @desc    Get user credits
// @route   GET /api/payment/credits
// @access  Private
export const getUserCredits = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      credits: user.credits,
      subscriptionPlan: user.subscriptionPlan,
      totalCreditsUsed: user.totalCreditsUsed
    });
  } catch (error) {
    console.error('Get credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching credits'
    });
  }
};

// @desc    Create Stripe checkout session
// @route   POST /api/payment/create-checkout-session
// @access  Private
export const createCheckoutSession = async (req, res) => {
  try {
    const { package: packageType } = req.body;
    
    console.log('📦 Creating checkout for package:', packageType);
    console.log('🔑 Request user:', req.user);

    if (!stripe) {
      console.log('❌ Stripe not initialized!');
      return res.status(500).json({
        success: false,
        message: 'Payment system not configured. Please contact support.'
      });
    }

    if (!req.user || !req.user.id) {
      console.log('❌ No user found in request!');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    console.log('👤 Finding user by ID:', req.user.id);
    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.log('❌ User not found in database!');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!creditPackages[packageType]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package selected'
      });
    }

    const pkg = creditPackages[packageType];

    console.log('💰 Package details:', pkg);
    console.log('👤 User:', user.email);

    // Determine the frontend URL (production or development)
    // Priority: CLIENT_URL env var > Vercel detection > default production
    let frontendUrl;
    
    if (process.env.CLIENT_URL && process.env.CLIENT_URL !== 'http://localhost:5173') {
      frontendUrl = process.env.CLIENT_URL;
    } else if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      // We're on Vercel production, use live frontend URL
      frontendUrl = 'https://smart-ai-content.vercel.app';
    } else {
      // Local development
      frontendUrl = 'http://localhost:5173';
    }

    console.log('🌐 Using frontend URL:', frontendUrl);
    console.log('🔧 VERCEL env:', process.env.VERCEL);
    console.log('🔧 NODE_ENV:', process.env.NODE_ENV);
    console.log('🔧 CLIENT_URL:', process.env.CLIENT_URL);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${pkg.credits} Credits - ${packageType.charAt(0).toUpperCase() + packageType.slice(1)} Plan`,
              description: `Get ${pkg.credits} credits for SmartContent AI`,
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${frontendUrl}/dashboard?success=true&package=${packageType}`,
      cancel_url: `${frontendUrl}/dashboard?canceled=true`,
      client_reference_id: user._id.toString(),
      metadata: {
        userId: user._id.toString(),
        package: packageType,
        credits: pkg.credits
      }
    });

    console.log('✅ Stripe session created:', session.id);

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('❌ Create checkout session error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error creating checkout session',
      error: error.message
    });
  }
};

// @desc    Handle Stripe webhook
// @route   POST /api/payment/webhook
// @access  Public
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Add credits to user account
    const userId = session.metadata.userId;
    const credits = parseInt(session.metadata.credits);
    const packageType = session.metadata.package;

    try {
      await User.findByIdAndUpdate(userId, {
        $inc: { credits: credits },
        subscriptionPlan: packageType
      });

      console.log(`✅ Added ${credits} credits to user ${userId}`);
    } catch (error) {
      console.error('Error updating user credits:', error);
    }
  }

  res.json({ received: true });
};

// Track recently processed payments to prevent duplicates (in-memory cache)
const recentPayments = new Map();

// @desc    Handle successful payment callback
// @route   POST /api/payment/payment-success
// @access  Private
export const handlePaymentSuccess = async (req, res) => {
  try {
    const { packageType } = req.body;
    
    console.log('💳 Processing payment success for package:', packageType);
    console.log('👤 User ID:', req.user.id);

    if (!creditPackages[packageType]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package selected'
      });
    }

    // Check for duplicate payment processing (within last 10 seconds)
    const paymentKey = `${req.user.id}-${packageType}`;
    const lastProcessed = recentPayments.get(paymentKey);
    const now = Date.now();
    
    if (lastProcessed && (now - lastProcessed) < 10000) {
      console.log('⚠️  Duplicate payment request detected, skipping...');
      const user = await User.findById(req.user.id);
      return res.status(200).json({
        success: true,
        credits: user.credits,
        subscriptionPlan: user.subscriptionPlan,
        message: `You already have ${creditPackages[packageType].credits} credits`
      });
    }

    const pkg = creditPackages[packageType];
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add credits to user account
    user.credits += pkg.credits;
    user.subscriptionPlan = packageType;
    await user.save();

    // Mark this payment as processed
    recentPayments.set(paymentKey, now);
    
    // Clean up old entries after 30 seconds
    setTimeout(() => {
      recentPayments.delete(paymentKey);
    }, 30000);

    console.log(`✅ Added ${pkg.credits} credits to user ${user.email}. New balance: ${user.credits}`);

    res.status(200).json({
      success: true,
      credits: user.credits,
      subscriptionPlan: user.subscriptionPlan,
      message: `Successfully added ${pkg.credits} credits`
    });
  } catch (error) {
    console.error('❌ Payment success handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment success'
    });
  }
};

// @desc    Use credits
// @route   POST /api/payment/use-credits
// @access  Private
export const useCredits = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);

    if (user.credits < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits'
      });
    }

    user.credits -= amount;
    user.totalCreditsUsed += amount;
    await user.save();

    res.status(200).json({
      success: true,
      credits: user.credits,
      message: `Used ${amount} credits`
    });
  } catch (error) {
    console.error('Use credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Error using credits'
    });
  }
};
