const dotenv = require("dotenv")

dotenv.config()

const SIX_SID = process.env.SIX_SID
const SIX_USER_ID = process.env.SIX_USER_ID
const SIX_NIM = process.env.SIX_NIM

module.exports = {
    SIX_URL: "https://akademik.itb.ac.id",
    GET_ALL_SCHEDULE_URL: "https://akademik.itb.ac.id/app/K/mahasiswa:" + SIX_NIM.toString() + "/kelas/jadwal/mahasiswa/" + SIX_USER_ID.toString() + "?bulan={0}",
    GET_SCHEDULE_URL: "https://akademik.itb.ac.id/app/K/mahasiswa:" + SIX_NIM.toString() + "/kelas/pertemuan/{0}/mhs/" + SIX_USER_ID.toString(),
    MARK_AS_ATTENDED_URL: "https://akademik.itb.ac.id/app/K/mahasiswa:" + SIX_NIM.toString() + "/kelas/pertemuan/{0}/mhs/" + SIX_USER_ID.toString(),
    MARK_AS_ATTENDED_RETURN_TO_URL: "/app/K/mahasiswa:" + SIX_NIM.toString() + "/kelas/jadwal/mahasiswa",

    HEADER: {
        'authority': 'akademik.itb.ac.id',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'accept-language': 'en-US,en;q=0.9',
        'cookie': SIX_SID,
        'sec-ch-ua': '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
    }
}