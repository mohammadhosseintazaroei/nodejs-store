 const router = require("express");
const paymentController = require("../../http/controllers/api/payment.controller");
const { verifyAccessToken } = require("../../http/middlewares/verifyAccessToken");
 
 router.post("payment" ,verifyAccessToken, paymentController.PaymentGateway)
 router.post("verify" , ()=>{})

 module.exports = {
    ApiPamnet:router
 }