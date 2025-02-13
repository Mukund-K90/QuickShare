const express = require('express');
const router = express.Router();
const crypto = require('crypto');

router.post('/razorpay-webhook', async (req, res) => {
    try {
        const secret = 'quickshare';
        const signature = req.headers['x-razorpay-signature'];

        if (!signature) {
            return res.status(400).json({ success: false, message: 'Signature missing' });
        }

        const shasum = crypto.createHmac('sha256', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (shasum !== signature) {
            return res.status(400).json({ success: false, message: 'Invalid signature' });
        }

        const { event, payload } = req.body;

        console.log(`✅ Webhook Event: ${event}`);
        console.log(`📌 Event Payload:`, JSON.stringify(payload, null, 2));

        return res.status(200).json({ success: true, message: `Received event: ${event}` });
    } catch (error) {
        console.error('❌ Webhook Processing Error:', error);
        return res.status(500).json({ success: false, message: 'Webhook processing failed' });
    }
});

module.exports = router;
