const tokopediaConstants = require("../constant/tokopediaConstants")
const axios = require("axios");

function getOrders(status) {
    var data = JSON.stringify([
        {
          "operationName": tokopediaConstants.GET_ORDER_OPERATION,
          "variables": {
            "VerticalCategory": "",
            "Status": status,
            "SearchableText": "",
            "CreateTimeStart": "",
            "CreateTimeEnd": "",
            "Page": 1,
            "Limit": 20
          },
          "query": tokopediaConstants.GET_ORDER_QUERY
        }
    ]);

    var config = {
        method: 'post',
        url: tokopediaConstants.GET_ORDER_URL,
        headers: tokopediaConstants.HEADER,
        data : data
    };
      
    return axios(config)
        .then(function (response) {
            return Promise.resolve(response);
        })
        .catch(function (error) {
            return Promise.reject(error);
        });
}

function getOrderTracking(orderId) {
    var data = JSON.stringify([
        {
          "operationName": tokopediaConstants.GET_ORDER_TRACKING_OPERATION,
          "variables": {
            "input": {
              "order_id": orderId,
              "from": "buyer",
              "lang": "id",
              "nocache": "1"
            }
          },
          "query": tokopediaConstants.GET_ORDER_TRACKING_QUERY
        }
    ]);
      
    var config = {
        method: 'post',
        url: tokopediaConstants.GET_ORDER_TRACKING_URL,
        headers: tokopediaConstants.HEADER,
        data : data
    };
      
    return axios(config)
        .then(function (response) {
            return Promise.resolve(response);
        })
        .catch(function (error) {
            return Promise.reject(error);
        });
}

module.exports = {
    getOrders,
    getOrderTracking
}

