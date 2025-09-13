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
    users[who].dollar += dmt

    await m.reply(`*تـــمــــت الـإضـــــافـــه..👑*
┌──────────────
▢ *إجـمـــــالــــي* ${dmt}
└──────────────`)
    conn.fakeReply(m.chat, `*هــل تـــلــــقــــيــت* \n\n *+${dmt}* الــــبــــيــــلــي`, who, m.text)
}

handler.help = ['addgold <@مستخدم>']
handler.tags = ['اقتصاد']
handler.command = ['اضف-بيلي'] 
handler.rowner = true

export default handler
