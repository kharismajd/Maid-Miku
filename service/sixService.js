const JSSoup = require("jssoup").default
const sixOutbound = require("../outbound/sixOutbound")
const stringUtil = require("../util/stringUtil")
const sixConstant = require("../constant/sixConstants")

async function getMonthlySchedule(year, month) {
    const rawSchedule = await sixOutbound.getMonthlySchedule(year, month)
    const rawScheduleHtml = new JSSoup(rawSchedule.data)

    const schedulesHtml = rawScheduleHtml.findAll("td");

    const schedules = []
    for (let i = 0; i < schedulesHtml.length; i++) {
        const dateHtml = schedulesHtml[i].find("div", {"class": ""})
        const linksHtml = schedulesHtml[i].findAll("a", {"class": "linkpertemuan"})
        const classesHtml = schedulesHtml[i].findAll("small")

        let classDate = stringUtil.getNumberFromString(dateHtml.text)

        let dateMonth = month
        if (schedules.length === 0 && classDate > 7) {
            dateMonth -= 1
        }

        if (schedules.length > 0 && classDate < schedules[i - 1].date.getDate()) {
            dateMonth += 1
        }

        const classes = []
        for (let j = 0; j < linksHtml.length; j++) {

            const classesText = classesHtml[j].text.trim()
            const classHour = classesText.split("\n")[0]

            const startDate = new Date()
            startDate.setMonth(dateMonth, classDate)
            startDate.setHours(parseInt(classHour.split("-")[0].split(":")[0]), parseInt(classHour.split("-")[0].split(":")[1]), 0, 0)

            const endDate = new Date()
            endDate.setMonth(dateMonth, classDate)
            endDate.setHours(parseInt(classHour.split("-")[1].split(":")[0]), parseInt(classHour.split("-")[1].split(":")[1]), 0, 0)

            const name = linksHtml[j].attrs["data-kuliah"]
            const url = sixConstant.SIX_URL + linksHtml[j].attrs["data-url"].split("?")[0]
            let location = classesText.split("\n")[3].trim()
            location = location.replace("(", "")
            location = location.replace(")", "")

            classes.push({ name, url, startDate, endDate, location })
        }

        const date = new Date()
        date.setMonth(dateMonth, classDate)
        date.setHours(0, 0, 0, 0)

        schedules.push({ date, classes })
    }

    return schedules
}

async function getTodaySchedule() {
    const date = new Date()
    const schedules = await getMonthlySchedule(date.getFullYear(), date.getMonth())
    const todaySchedule = schedules.find(x => {
        return x.date.getMonth() === date.getMonth() && x.date.getDate() === date.getDate()
    })

    return todaySchedule
}

module.exports = {
    getTodaySchedule
}