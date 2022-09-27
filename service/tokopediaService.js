const tokopediaOutbound = require("../outbound/tokopediaOutbound")
const lineBotService = require("./lineBotService")
const Order = require("../model/orderModel");
const dotenv = require("dotenv")

dotenv.config()

async function getOrders(status) {
    const orderResult = await tokopediaOutbound.getOrders(status);
    const orders = orderResult.data[0].data.uohOrders.orders

    const orderSummary = []
    orders.forEach(order => {
        const productNames = [];
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
    const orderTracking = orderTrackingResult.data[0].data.logistic_tracking.data.track_order.track_history
    
    const orderTrackingSummary = []
    orderTracking.forEach(orderTracking => {
        orderTrackingSummary.push({time:orderTracking.date_time, status:orderTracking.status})
    })

    return orderTrackingSummary
}

async function insertProcessedOrdersToDb() {
    const processedOrder = await getOrders("diproses");

    const response = [];
    await Promise.all(processedOrder.map(async (order) => {
        const existingItem = await Order.findOne({ orderId: order.orderId })
        if (existingItem === null) {
            const newOrder = new Order({
                orderId: order.orderId,
                trackingCount: 0,
            });
            await newOrder.save();
            response.push(order);
        }
    }));

    return response;
}

async function insertShippedOrdersToDb() {
    const shippedOrder = await getOrders("dikirim")

    const response = [];
    await Promise.all(shippedOrder.map(async (order) => {
        const orderTracking = await getOrderTracking(order.orderId);
        const existingItem = await Order.findOne({ orderId: order.orderId })

        if (existingItem === null || orderTracking.length > existingItem.trackingCount) {
            if (existingItem === null) {
                const newOrder = new Order({
                    orderId: order.orderId,
                    trackingCount: orderTracking.length,
                });
                await newOrder.save()

            } else if (orderTracking.length > existingItem.trackingCount) {
                existingItem.trackingCount = orderTracking.length
                await existingItem.save()
            }

            order.log = orderTracking[0].status;
            response.push(order);
        }
    }));

    return response;
}

async function insertArrivedOrdersToDb() {
    const arrivedOrder = await getOrders("tiba_di_tujuan")

    const response = []
    await Promise.all(arrivedOrder.map(async (order) => {
        const existingItem = await Order.findOneAndRemove({ orderId: order.orderId })
        if (existingItem !== null) {
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
