const sixConstants = require("../constant/sixConstants")
const stringUtil = require("../util/stringUtil")
const axios = require('axios');
const qs = require('qs')

function getMonthlySchedule(year, month) {
    const config = {
        method: 'get',
        url: sixConstants.GET_ALL_SCHEDULE_URL.replace('{0}', year.toString() + stringUtil.pad(month.toString(), 2)),
        headers: sixConstants.HEADER
    };

    return axios(config)
        .then(function (response) {
            return Promise.resolve(response);
        })
        .catch(function (error) {
            return Promise.reject(error);
        });
}

function getSchedule(id) {
    const config = {
        method: 'get',
        url: sixConstants.GET_SCHEDULE_URL.replace('{0}', id.toString()),
        headers: sixConstants.HEADER
    };

    return axios(config)
        .then(function (response) {
            return Promise.resolve(response);
        })
        .catch(function (error) {
            return Promise.reject(error);
        });
}

function markAsAttended(id, token, returnTo) {
    const data = qs.stringify({
        'form[hadir]': '',
        'form[returnTo]': returnTo,
        'form[_token]': token
    });

    const config = {
        method: 'post',
        url: sixConstants.MARK_AS_ATTENDED_URL.replace('{0}', id.toString()) + "?returnTo=" + returnTo,
        headers: sixConstants.HEADER,
        const : data
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
    getSchedule,
    getMonthlySchedule,
    markAsAttended,
}

