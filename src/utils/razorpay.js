const Razorpay = require('razorpay');
const { CONFIG } = require('../config/config');

const razorpayInstance = new Razorpay({
    key_id: CONFIG.razorPayKeyId,
    key_secret: CONFIG.razorPayKeySecret,
});

const createCustomer = async (email, name, contact) => {
    try {
        const customer = await razorpayInstance.customers.create({
            name,
            email,
            contact
        });
        return customer;
    } catch (error) {
        console.error("Error creating customer:", error);
        throw new Error("Failed to create customer");
    }
};

const checkCustomer = async (customerId) => {
    try {
        const customer = await razorpayInstance.customers.fetch(customerId);
        return customer;
    } catch (error) {
        if (error.statusCode === 400 && error.error.code === 'BAD_REQUEST_ERROR') {
            console.warn("Customer not found:", error.error.description);
            return null;
        }
        console.error("Error fetching customer:", error);
        throw new Error("Failed to fetch customer");
    }
};

const createSubscription = async (planId) => {
    try {
        const startAt = Math.floor(Date.now() / 1000) + 3600;

        const subscription = razorpayInstance.subscriptions.create({
            plan_id: planId,
            customer_notify: 1,
            quantity: 1,
            total_count: 12,
        });
        
        return subscription;
    } catch (error) {
        console.error("Error creating subscription:", error);
        throw new Error("Failed to create subscription", error);
    }
};

const generateSubscriptionDetails = async (subscriptionId) => {
    try {
        const subscription = await razorpayInstance.subscriptions.fetch(subscriptionId);
        return subscription;
    } catch (error) {
        console.error("Error creating subscription:", error);
        throw new Error("Failed to create subscription");
    }
}

const generateSubscriptionLink = async (sub_id) => {
    return `https://api.razorpay.com/v1/t/subscriptions/${sub_id}`
}

module.exports = {
    createSubscription,
    createCustomer,
    checkCustomer,
    generateSubscriptionLink,
    generateSubscriptionDetails
};
