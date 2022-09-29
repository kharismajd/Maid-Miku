function plusHours(date, h) {
    return date.getTime() + (h * 60 * 60 * 1000)
}

module.exports = {
    plusHours
}