const sequelize = require('../util/database');
const axios = require('axios');
const orderModel = require('../models/orderModel');
require('dotenv').config();

const paymentController = {
    buyPremium: async (req, res) => {
        const { id } = req.user;
        try {
            const amount = 2500;
            const orderId = `ORDER_${Date.now()}`;

            const order = {
                order_id: orderId,
                order_amount: amount,
                order_currency: 'INR',
                order_note: 'Premium subscription',
                customer_details: {
                    customer_id: id.toString(), // Ensure this is a string
                    customer_email: req.user.userEmail,
                    customer_phone: req.user.userPhone
                },
                order_meta: {
                    return_url: 'https://your-return-url.com', // Set your return URL here
                    notify_url: 'https://your-notify-url.com' // Set your notify URL here
                }
            };
            console.log("Order data being sent to Cashfree: ", order);
            const response = await axios.post('https://sandbox.cashfree.com/pg/orders', order, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-id': process.env.CF_CLIENT_ID,
                    'x-client-secret': process.env.CF_CLIENT_SECRET,
                    'x-api-version':'2025-01-01'
                }
            });
            console.log("Response from Cashfree API: ", response.data);
            const orderResponse = response.data;
            if (!orderResponse.cf_order_id || !orderResponse.payment_session_id)
            { throw new Error(`Order creation failed with message: ${orderResponse.message}`); }          
            const { cf_order_id, payment_session_id } = orderResponse;
            await orderModel.create({ orderId: orderId, status: 'pending', userId: id });
            res.send({ order: orderResponse, app_id: process.env.CF_CLIENT_ID, order_token: payment_session_id });

        } catch (error) {
            if (error.response) { 
                console.error("Error creating order:", error.response.data);
                res.status(400).send({ message: 'some error', error: error.response.data }); } 
            else { 
                console.error("Error creating order:", error.message);
                res.status(400).send({ message: 'some error', error: error.message }); }
        }
    },

    updatePremiumStatus: async (req, res) => {
        let t;
        try {
            t = await sequelize.transaction();
            const { order_id, payment_id } = req.body;
            const findedorder = await orderModel.findOne({ where: { orderId: order_id } });
            await Promise.all([
                findedorder.update({ paymentId: payment_id, status: 'success' }, { transaction: t }),
                req.user.update({ isPremiumUser: true }, { transaction: t })
            ]);
            await t.commit();
            res.send({ success: true });
        } catch (error) {
            await t.rollback();
            res.status(400).send({ message: 'some error', error: error.message });
        }
    },

    updateStausToFailed: async (req, res) => {
        try {
            const { order_id } = req.body;
            const findedorder = await orderModel.findOne({ where: { orderId: order_id } });
            await findedorder.update({ status: 'failed' });
            res.status(400).send({ success: false, message: 'Payment failed' });
        } catch (error) {
            res.status(400).send({ message: 'some error', error: error.message });
        }
    }
};

module.exports = paymentController;
