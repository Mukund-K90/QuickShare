const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { CONFIG } = require('../config/config');

router.post('/razorpay-webhook', async (req, res) => {
    const secret = 'quickshare';

    // Verify Razorpay signature
    const shasum = crypto.createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (shasum !== req.headers['x-razorpay-signature']) {
        return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    try {
        switch (event) {
            case 'payment.failed':
                console.log('Payment failed:', payload.payment.entity);
                // Handle payment failure (e.g., notify user, retry, etc.)
                break;

            case 'subscription.paused':
                console.log('Subscription paused:', payload.subscription.entity);
                // Update database to reflect paused status
                break;

            case 'subscription.cancelled':
                console.log('Subscription canceled:', payload.subscription.entity);
                // Update database & notify user
                break;

            default:
                console.log('Unhandled event:', event);
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ success: false, message: 'Webhook processing failed' });
    }
});

module.exports = router;
