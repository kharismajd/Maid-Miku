const line = require('@line/bot-sdk')
const dotenv = require("dotenv")

dotenv.config()

const configuration = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
}

const client = new line.Client(configuration)
const userId = process.env.USER_ID;

async function sleep() {
    const text = "Hello master, Miku will sleep now. Please refrain from waking me up so Miku will be ready to help you tomorrow \n\nGood night ;)"
    await client.pushMessage(userId, {type: 'text', text: text})
}

async function replyText(text, replyToken) {
    await client.replyMessage(replyToken, {type: 'text', text: text}, false)
}

async function notifyOrders(orders, notify) {
    var text = "Hello master, there is no update from Miku today. Have a good day XD"

    if (notify) {
        if (orders.arrived.length === 0 || orders.shipped.length == 0 || orders.processed.length == 0) {
            await client.pushMessage(userId, {type: 'text', text: text})
            return
        }
    }

    text = "Hello master, here's some update from Miku about master's order on Tokopedia :3\n\n----------------------------------------"
    if (notify) {
        text = "Hello master, there is an update about master's order on Tokopedia :3\n\n----------------------------------------"
    }

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

    if (notify) {
        text += "\n\nThat's all, Have a great day day XD"
    }
    else {
        text += "\n\nThat's all, Have a good day XD"
    }
    await client.pushMessage(userId, {type: 'text', text: text})
}

async function notifyError() {
    const text = "Sorry master, There seems to be an error in Miku's system :(\n\nPlease help to fix it so Miku can give her best to help master :D"
    await client.pushMessage(userId, {type: 'text', text: text})
}

module.exports = {
    replyText,
    notifyOrders,
    notifyError,
    sleep,
    configuration
}
