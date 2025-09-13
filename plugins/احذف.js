let handler = async (m, { conn, usedPrefix, command }) => {	
if (!m.quoted) throw `*فين الرسالة اللي هتمسحها HØST🍃*`
try {
let delet = m.message.extendedTextMessage.contextInfo.participant
let bang = m.message.extendedTextMessage.contextInfo.stanzaId
return conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
} catch {
return conn.sendMessage(m.chat, { delete: m.quoted.vM.key })
}}
handler.help = ['del', 'delete']
handler.tags = ['group']
handler.command = /^حذف|مسح$/i
handler.group = true
handler.admin = true
handler.botAdmin = true
export default handler

/*let handler = function (m) {
if (!m.quoted) throw false
let { chat, fromMe, isBaileys } = m.quoted
if (!fromMe) throw false
if (!isBaileys) throw '*فين الرسالة اللي هتمسحها🤷🏻‍♂️*'
conn.sendMessage(chat, { delete: m.quoted.vM.key })
}
handler.help = ['del', 'delete']
handler.tags = ['tools']
handler.command = /^حذف|مسح$/i
handler.group = true
handler.admin = true
export default handler*/