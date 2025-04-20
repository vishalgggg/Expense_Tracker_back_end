
async function paymentService(order_id, Cashfree) {
try{
const response = await Cashfree.PGOrderFetchPayments("2025-01-01",order_id.orderId);
let getOrderResponse = response.data; //Get Order API Response
let orderStatus;
console.log("Response from Cashfree API: ", response.data);
if(getOrderResponse.filter(transaction => transaction.payment_status === "SUCCESS").length > 0){
    orderStatus = "Success"
}else if(getOrderResponse.filter(transaction => transaction.payment_status === "PENDING").length > 0){
    orderStatus = "Pending"
}else{
    orderStatus = "Failure"
}
return orderStatus;
}
catch (error) {
    console.error("Error fetching payment status: got errorrr", error.message);
    // throw new Error("Error fetching payment status");
}
}
module.exports = paymentService;