const express = require('express');
const router = express.Router();
const { authentication } = require('../../middleware/auth.middleware');
const paymentController = require('../../controller/v1/user/subscriptionController');

router.post('/subscribe', authentication, paymentController.buySubscription);
router.post('/paymentverification', authentication, paymentController.verifySubscription);
module.exports = router;
