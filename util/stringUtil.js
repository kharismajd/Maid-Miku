function pad(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

function getNumberFromString(str) {
    const num = str.replace(/[^\d]/g, '');
    return parseInt(num,10);
}

module.exports = {
    pad,
    isNumeric,
    getNumberFromString,
}