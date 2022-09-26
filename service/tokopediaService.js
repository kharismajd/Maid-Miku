const tokopediaOutbound = require("../outbound/tokopediaOutbound")
const lineBotService = require("./lineBotService")
const db = require('cyclic-dynamodb')
const dotenv = require("dotenv")

dotenv.config()

const items = db(process.env.CYCLIC_DB).collection("items")

async function getOrders(status) {
    const orderResult = await tokopediaOutbound.getOrders(status);
    const orders = orderResult.data[0].data.uohOrders.orders

    var orderSummary = []
    orders.forEach(order => {
        var productNames = [];
        const products = order.metadata.products
        products.forEach(product => {
            productNames.push(product.title)
        })
        orderSummary.push({ orderId: order.verticalID, items: productNames })
    });
    console.log(orderSummary)
    return orderSummary
}

async function getOrderTracking(orderId) {
    const orderTrackingResult = await tokopediaOutbound.getOrderTracking(orderId);
    const orderTrackings = orderTrackingResult.data[0].data.logistic_tracking.data.track_order.track_history
    
    var orderTrackingSummary = []
    orderTrackings.forEach(orderTracking => {
        orderTrackingSummary.push({time:orderTracking.date_time, status:orderTracking.status})
    })

    console.log(orderTrackingSummary)
    return orderTrackingSummary
}

async function insertProcessedOrdersToDb() {
    const processedOrder = await getOrders("diproses");
    
    var response = [];
    await Promise.all(processedOrder.map(async (order) => {
        const existingItem = await items.get(order.orderId)
        if (existingItem === null) {
            await items.set(order.orderId, { tracking_count: 9 })
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
        const existingItem = await items.get(order.orderId);
        if (existingItem === null || orderTracking.length > existingItem.props.tracking_count) {
            await items.set(order.orderId, { tracking_count: orderTracking.length })
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
        const existingItem = await items.get(order.orderId)
        if (existingItem !== null) {
            await items.delete(order.orderId)
            response.push(order);
        }
    }))

    return response;
}

async function getAllOrders(notify) {
    try {
        const arrived = await insertArrivedOrdersToDb();
        const shipped = await insertShippedOrdersToDb();
        const processed = await insertProcessedOrdersToDb();
        const orders = {arrived, shipped, processed};
        await lineBotService.notifyOrders(orders, notify);
    } catch(error) {
        console.log(error)
        if (notify) {
            await lineBotService.notifyError();
        }
    }
}

module.exports = {
    getAllOrders
}
