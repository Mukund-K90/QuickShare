const { CONFIG } = require("../../../config/config");
const Payment = require('../../../model/payment');
const { createSubscription, createCustomer, generateSubscriptionLink, } = require("../../../utils/razorpay");
const crypto = require('crypto');

//buySubscription
exports.buySubscription = async (req, res) => {

    try {
        const { plan, planId } = req.body;

        const user = req.user;
        // Create a subscription
        const subscription = await createSubscription(planId);

        if (subscription) {
            user.plan = plan;
            user.subscription.id = subscription.id;
            user.subscription.status = subscription.status;
            user.save();
        }
        const redirect_link = subscription.short_url;

        res.json({
            success: true, redirectLink: redirect_link, subscriptionId: subscription.id,
            subscriptionKey: subscription.key_id,
            shortUrl: subscription.short_url,
            planAmount: subscription.amount
        });
        req.flash('success', "Please refresh for plan details !!");
    } catch (error) {
        console.error("Subscription error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

//verifySubscription
exports.verifySubscription = async (req, res) => {

    try {
        const { razorpay_signature, razorpay_payment_id, razorpay_subscription_id } = req.params;
        const user = req.user;
        const subscription_id = user.subscription.id;

        const generated_signature = crypto.createHmac("sha256", CONFIG.razorPayKeySecret).update(razorpay_payment_id + "|" + subscription_id, 'utf-8').digest("hex")

        const isAuthentic = generated_signature === razorpay_signature;

        if (!isAuthentic) {
            return res.send("PAYMENT FAILED");
        }
        await Payment.create({
            razorpay_signature,
            razorpay_payment_id,
            razorpay_subscription_id
        });
        user.subscription.status = "active";
        await user.save();
        res.send("PAYMENT DONE");
    } catch (error) {
        console.error("Subscription error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};