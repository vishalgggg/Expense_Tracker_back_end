const sequelize = require('../util/database');

const orderModel = require('../models/orderModel');
const paymentService = require("../services/paymentService")
require('dotenv').config();
const {Cashfree} = require('cashfree-pg');
Cashfree.XClientId = process.env.CF_CLIENT_ID;
Cashfree.XClientSecret = process.env.CF_CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;


const paymentController = {
    buyPremium: async (req, res) => {
        const { id } = req.user;
        try {
            const amount = 2500;
            const orderId = `ORDER_${Date.now()}`;
            const expiryDate = new Date(Date.now() +  60 * 60 * 1000); // 1 hour from now
            const formattedExpiryDate = expiryDate.toISOString();
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
                    return_url: `http://localhost:4000/payment/updatepremiumstatus/${orderId}`, // Set your return URL here
                    payment_methods: "ccc, upi, nb"
                    
                },
                order_expiry_time : formattedExpiryDate
            };
            // console.log("Order data being sent to Cashfree: ", order);
            const response = await Cashfree.PGCreateOrder("2025-01-01", order);
            // console.log("Response from Cashfree API: ", response.data);
            
            await orderModel.create({ orderId: orderId, status: 'pending', userId: id });
            res.send({ order_token: response.data.payment_session_id, order_id: orderId });

        } catch (error) {
            console.error("Error creating order: ", error.message);
            res.status(400).send({ message: 'some error', error: error.message }); 
       
        }
    },

    updatePremiumStatus: async (req, res) => {
        try {
        let order_id= req.params;
        let orderStatus = await paymentService(order_id,Cashfree)
        
        const findedorder = await orderModel.findOne({ where: { orderId: order_id.orderId } });
        if (!findedorder) {
            console.log("Order not found!");
            return res.status(404).send({ status: false, message: 'Order not found' });
        }
        if(orderStatus === "Success"){
            await findedorder.update({  status: 'success' });
            await req.user.update({ isPremiumUser: true }) ;
            res.send({ status: true });
            } 
        
        else if(orderStatus === "Pending"){
                await findedorder.update({ status: 'PENDING' });
                res.status(400).send({ status: false, message: 'Payment pending' });
            
        }
        else{
            await findedorder.update({ status: 'failed' });
            res.status(400).send({ status: false, message: 'Payment failed' });
            
        }

    }
    catch (error) {
        res.status(400).send({ message: 'some error', error: error.message });
    }
        
    },
    getPremiumStatus:async (req, res) =>{
        res.send({isPremiumUser: req.user.isPremiumUser});
    }
   
};

module.exports = paymentController;
