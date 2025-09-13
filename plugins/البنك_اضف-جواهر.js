//import db from '../lib/database.js'

let handler = async (m, { conn, text }) => {
    let who
    if (m.isGroup) who = m.mentionedJid[0]
    else who = m.chat
    if (!who) throw '*إعـــمــــل مــنــشــن يـ بــاكــا..🗿*'
    let txt = text.replace('@' + who.split`@`[0], '').trim()
    if (!txt) throw '*قـــم بــإدخــال الـــــكــمـــيـه..🚩*'
    if (isNaN(txt)) throw '*الـــأرقــام فــقـــط الــــمـــســمـــوح بــهـا..🔢*'
    let dmt = parseInt(txt)
    let diamond = dmt

    if (diamond < 1) throw '*الــــــحــــد الــأدنـي..1*'
    let users = global.db.data.users
   users[who].diamond += dmt

    await m.reply(`*عـــمــلـــيــه إضـــافــــه مــــاس...💎* 

┌──────────────
▢ *Total:* ${dmt}
└──────────────`)
   conn.fakeReply(m.chat, `▢ 
يحصل \n\n *+${dmt}* الحد`, who, m.text)
}

handler.help = ['adddi <@user>']
handler.tags = ['econ']
handler.command = ['adddi', 'ضيف_جواهر'] 
handler.owner = true

export default handler

