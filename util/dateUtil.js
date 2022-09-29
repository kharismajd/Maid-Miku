function plusHours(date, h) {
    const time = date.getTime() + (h * 60 * 60 * 1000)
    const newDate = new Date()
    newDate.setTime(time)
    return newDate
}

module.exports = {
    plusHours
}