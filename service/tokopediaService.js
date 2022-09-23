const tokopediaOutbound = require("../outbound/tokopediaOutbound")
const lineBotService = require("./lineBotService")
const dotenv = require("dotenv")

dotenv.config()

orderData = {}

async function getOrders(status) {
    const orderResult = await tokopediaOutbound.getOrders(status);
    const orders = orderResult.data[0].data.uohOrders.orders

    orderSummary = []
    orders.forEach(order => {
        var productNames = [];
        const products = order.metadata.products
        products.forEach(product => {
            productNames.push(product.title)
        })
        orderSummary.push({ orderId: order.verticalID, items: productNames })
    });
    return orderSummary
}

async function getOrderTracking(orderId) {
    const orderTrackingResult = await tokopediaOutbound.getOrderTracking(orderId);
    const orderTrackings = orderTrackingResult.data[0].data.logistic_tracking.data.track_order.track_history
    
    var orderTrackingSummary = []
    orderTrackings.forEach(orderTracking => {
        orderTrackingSummary.push({time:orderTracking.date_time, status:orderTracking.status})
    })
    return orderTrackingSummary
}

async function insertProcessedOrdersToDb() {
    const processedOrder = await getOrders("diproses");
    
    var response = [];
    await Promise.all(processedOrder.map(async (order) => {
        const existingItem = orderData.orderId
        console.log(existingItem)
        if (!existingItem) {
            orderData.orderId = 0
            response.push(order);
        }
    }));

    return response;
}

async function insertShippedOrdersToDb() {
    const shippedOrder = await getOrders("dikirim")

    var response = [];
    await Promise.all(shippedOrder.map(async (order) => {
        const orderTracking = await getOrderTracking(order.orderId);
        const existingItem = orderData.orderId
        if (!existingItem || orderTracking.length > existingItem.orderData.orderId) {
            orderData.orderId = orderTracking.length
            order.log = orderTracking[0].status;
            response.push(order);
        }
    }));

    return response;
}

async function insertArrivedOrdersToDb() {
    const arrivedOrder = await getOrders("tiba_di_tujuan")

    var response = []
    await Promise.all(arrivedOrder.map(async (order) => {
        const existingItem = orderData.orderId
        if (existingItem) {
            delete orderData.orderId
            response.push(order);
        }
    }))

    return response;
}

async function getAllOrders() {
    try {
        const arrived = await insertArrivedOrdersToDb();
        const shipped = await insertShippedOrdersToDb();
        const processed = await insertProcessedOrdersToDb();
        const orders = {arrived, shipped, processed};
        lineBotService.notifyOrders(orders);
    } catch(error) {
        console.log(error)
        lineBotService.notifyError();
    }
}

module.exports = {
    getAllOrders
}
