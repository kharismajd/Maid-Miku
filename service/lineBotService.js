const line = require('@line/bot-sdk')
const dotenv = require("dotenv")

dotenv.config()

const configuration = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
}

const client = new line.Client(configuration)
const userId = process.env.USER_ID;

function replyText(text, replyToken) {
    client.replyMessage(replyToken, {type: 'text', text: text}, false)
}

function notifyOrders(orders) {
    var text = "Hello master, there is no update from Miku today. Have a good day XD"
    if (orders.arrived.length === 0 || orders.shipped.length == 0 || orders.processed.length == 0) {
        client.pushMessage(userId, {type: 'text', text: text})
        return
    }

    text = "Hello master, here's some update from Miku about master's order on Tokopedia :3\n\n----------------------------------------"
    orders.arrived.forEach(order => {
        order.items.forEach(item => {
            text += "\n- " + item
        })
        text += "\n\nStatus: Arrived at destination :D"
        text += "\n----------------------------------------"
    });

    orders.shipped.forEach(order => {
        order.items.forEach(item => {
            text += "\n- " + item
        })
        text += "\n\nStatus: " + order.log
        text += "\n----------------------------------------"
    });

    orders.processed.forEach(order => {
        order.items.forEach(item => {
            text += "\n- " + item
        })
        text += "\n\nStatus: Processed :)"
        text += "\n----------------------------------------"
    })

    text += "\n\nThat's all, Have a good day XD"
    client.pushMessage(userId, {type: 'text', text: text})
}

function notifyError() {
    const text = "Sorry master, There seems to be an error in Miku's system :(\n\nPlease help to fix it so Miku can give her best to help master :D"
    client.pushMessage(userId, {type: 'text', text: text})
}

module.exports = {
    replyText,
    notifyOrders,
    notifyError,
    configuration
}
