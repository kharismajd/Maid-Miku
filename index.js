const express = require('express');
const line = require('@line/bot-sdk');
const cors = require("cors");
const lineBotService = require("./service/lineBotService");
const tokopediaService = require("./service/tokopediaService");
const db = require("./config/db")
const dotenv = require("dotenv")

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors());

app.get('/', function(req, res){
  res.status(200).send('OK')
})

app.post('/callback', function(req, res) {
  req.body.events.map(async (event) => {
      const replyText = "Hello master, these are the features that master has given to Miku XD:\n\n- Miku will give updates about master's order on Tokopedia every 9AM\n\nThat's all, please give Miku more features in the future :3";
      await lineBotService.replyText(replyText, event.replyToken)
  })
  res.status(200).send('OK')
})

app.post('/miku-tokped-update', async function(req, res) {
  await lineBotService.notifyOrders();
  res.status(200).send('OK');
})

app.post('/miku-today-schedule', async function(req, res) {
  await lineBotService.notifyTodaySchedule();
  res.status(200).send('OK');
})

app.post('/miku-sleep', async function(req, res) {
  await lineBotService.notifySleep();
  res.status(200).send('OK');
})

const port = process.env.PORT || 3001
db.connectToDB().then((_) => {
  app.listen(port, (_) => {
    console.log(`index.js listening on ${port}`)
  })
})
