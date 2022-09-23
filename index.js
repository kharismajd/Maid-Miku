const express = require('express');
const line = require('@line/bot-sdk')
const scheduler = require('node-schedule');
const lineBotService = require("./service/lineBotService");
const tokopediaService = require("./service/tokopediaService");

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', function(req, res){
  res.status(200).send('OK')
})

app.post('/callback', line.middleware(lineBotService.configuration), function(req, res){
  req.body.events.map(event => {
      const replyText = "Hello master, these are the features that master has given to Miku XD:\n\n- Miku will give updates about master's order on Tokopedia every 9AM\n\nThat's all, please give Miku more features in the future :3";
      lineBotService.replyText(replyText, event.replyToken)
  })
  res.status(200).send('OK')
})

scheduler.scheduleJob({hour: process.env.TOKOPEDIA_ORDER_NOTIFY_HOUR, minute: process.env.TOKOPEDIA_ORDER_NOTIFY_MINUTE}, function() {
  tokopediaService.getAllOrders()
});
scheduler.scheduleJob('*/5 * * * * *', function() {
  console.log("this test");
})

// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
