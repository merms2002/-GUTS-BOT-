import fetch from 'node-fetch'
let handler = async (m, { isPrems, conn }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" 
}
let grupos = [nna, nn, nnn, nnnt]
let gata = [img5, img6, img7, img8, img9]
let enlace = { contextInfo: { externalAdReply: {title: wm + ' 🐈', body: 'support group' , sourceUrl: grupos.getRandom(), thumbnail: await(await fetch(gata.getRandom())).buffer() }}}
let enlace2 = { contextInfo: { externalAdReply: { showAdAttribution: true, mediaUrl: yt, mediaType: 'VIDEO', description: '', title: wm, body: '𝑻𝒉𝒆 𝑳𝒐𝒍𝒊𝑩𝒐𝒕-𝑴𝑫', thumbnailUrl: await(await fetch(global.img)).buffer(), sourceUrl: yt }}}
let dos = [enlace, enlace2]    

let user = global.db.data.users[m.sender]
let premium = user.premium

let time = user.lastmonthly + 432000000 //432000000 5 أيام
if (new Date - user.lastmonthly < 432000000) return await conn.reply(m.chat, `لقد استلمت مكافأتك الشهرية بالفعل 🌅`, wm + `\n\nعد بعد: \n${clockString(time - new Date() * 1)}`, fkontak,  m)

user.lastmonthly = new Date * 1
}
handler.command = ['شهري', 'cadames', 'mes', 'mensual', 'entregadelmes'] 
handler.level = 10
handler.register = true
export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]}

function clockString(ms) {
  let ye = isNaN(ms) ? '--' : Math.floor(ms / 31104000000) % 10
  let mo = isNaN(ms) ? '--' : Math.floor(ms / 2592000000) % 12
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000) % 30
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return ['┃⇢ ', ye, ' *🗓️ سنوات*\n', '┃⇢ ', mo, ' *⛅ أشهر*\n', '┃⇢ ', d, ' *☀️ أيام*\n', '┃⇢ ', h, ' *⏰ ساعات*\n', '┃⇢ ', m, ' *🕐 دقائق*\n', '┃⇢ ', s, ' *⏱️ ثواني*'].map(v => v.toString().padStart(2, 0)).join('')
}