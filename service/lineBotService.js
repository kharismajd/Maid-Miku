const line = require('@line/bot-sdk')
const dotenv = require("dotenv")
const stringUtil = require("../util/stringUtil")
const sixService = require("./sixService")
const tokopediaService = require("./tokopediaService")

dotenv.config()

const configuration = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
}

const client = new line.Client(configuration)
const userId = process.env.USER_ID;

async function replyText(text, replyToken) {
    await client.replyMessage(replyToken, {type: 'text', text: text}, false)
}

function createLeftBoxContent(classes) {
    const startTime = stringUtil.pad(classes.startDate.getHours(), 2) + ":" + stringUtil.pad(classes.startDate.getMinutes(), 2)
    const endTime = stringUtil.pad(classes.endDate.getHours(), 2) + ":" + stringUtil.pad(classes.endDate.getMinutes(), 2)

    const leftBoxContent = []
    leftBoxContent.push({
        'type': 'text',
        'text': startTime,
        'gravity': 'top',
        'align': 'end',
        'weight': 'bold',
        'size': 'xs'
    })
    leftBoxContent.push({
        'type': 'text',
        'text': '~',
        'gravity': 'top',
        'align': 'end',
        'size': 'xxs'
    })
    leftBoxContent.push({
        'type': 'text',
        'text': endTime,
        'gravity': 'top',
        'align': 'end',
        'weight': 'bold',
        'size': 'xs'
    })
    return leftBoxContent
}

function createRightBoxContent(classes) {
    const rightBoxContent = []
    rightBoxContent.push({
        'type': 'text',
        'text': classes.name,
        'gravity': 'top',
        'size': 'xs',
        'color': '#101010',
        'wrap': true
    })
    rightBoxContent.push({
        'type': 'text',
        'text': classes.location,
        'gravity': 'bottom',
        'size': 'xxs',
        'color': '#999999'
    })
    return rightBoxContent
}

function wrapClassRow(leftBoxContent, rightBoxContent) {
    return {
        'type': 'box',
        'layout': 'horizontal',
        'spacing': 'md',
        'contents': [
            {
                'type': 'separator'
            },
            {
                'type': 'box',
                'layout': 'vertical',
                'contents': leftBoxContent,
                'flex': 2
            },
            {
                'type': 'box',
                'layout': 'vertical',
                'contents': rightBoxContent,
                'flex': 8
            }
        ]
    }
}

function wrapClassMessage(contents) {
    return {
        'type': 'flex',
        'altText': 'Your classes for today!',
        'contents': {
            'type': 'bubble',
            'body': {
                'type': 'box',
                'layout': 'vertical',
                'spacing': 'md',
                'contents': contents
            }
        }
    }
}

async function notifyError(message) {
    const text = "Sorry master, There seems to be an error in Miku's system :(. Please help to fix it so Miku can give her best to help master :D"
    text += "\n\nError message: " + message
    await client.pushMessage(userId, {type: 'text', text: text}, false)
}

async function notifyOrders() {
    try {
        const orders = await tokopediaService.getAllOrders()

        var text = "Hello master, there are updates about master's order on Tokopedia :3\n\n----------------------------------------"

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

        text += "\n\nThat's all, keep your spirit for the rest of the day :D"

        await client.pushMessage(userId, {type: 'text', text: text}, false)
    } catch(error) {
        console.log(error.message)
        notifyError("Cannot get all orders")
        return
    }
}

async function notifyTodaySchedule() {
    try {
        const schedule = await sixService.getTodaySchedule()

        if (!schedule) {
            return
        }

        const text = "Good morning master, have you woken up yet? Here's your class schedule for today. Do your best and don't be late :3"
        const rows = []
        schedule.classes.forEach(classes => {
            const leftBoxContents = createLeftBoxContent(classes)
            const rightBoxContents = createRightBoxContent(classes)
            const content = wrapClassRow(leftBoxContents, rightBoxContents)
            rows.push(content)
        })
        const message = wrapClassMessage(rows)

        const classesMessage = [
            {
                'type': 'text',
                'text': text
            },
            message
        ]

        await client.pushMessage(userId, classesMessage, false)
    } catch(error) {
        console.log(error.message)
        notifyError("Cannot get today schedule")
        return
    }
}

async function notifySleep() {
    const text = "Hello master, Miku will sleep now. Please refrain from waking me up so Miku will be ready to help you tomorrow \n\nGood night ;)"
    await client.pushMessage(userId, {type: 'text', text: text}, false)
}

module.exports = {
    replyText,
    notifyOrders,
    notifySleep,
    notifyTodaySchedule,
    configuration,
}
