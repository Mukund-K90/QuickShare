const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    planId: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subscriptionId: String,
}, { timestamps: true });

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;