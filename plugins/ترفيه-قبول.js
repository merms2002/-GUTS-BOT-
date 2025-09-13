import fetch from 'node-fetch' 
import { areJidsSameUser } from '@adiwajshing/baileys'
let handler = async (m, { conn, text, participants, groupMetadata }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let grupos = [nna, nn, nnn, nnnt]
let gata = [img5, img6, img7, img8, img9]
let enlace = { contextInfo: { externalAdReply: {title: wm + ' 🐈', body: 'مجموعة الدعم' , sourceUrl: grupos.getRandom(), thumbnail: await(await fetch(gata.getRandom())).buffer() }}}
let enlace2 = { contextInfo: { externalAdReply: { showAdAttribution: true, mediaUrl: yt, mediaType: 'VIDEO', description: '', title: wm, body: 'البوت لوليبوت-MD', thumbnailUrl: await(await fetch(global.img)).buffer(), sourceUrl: yt }}}
let dos = [enlace, enlace2]

let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
var number = text.split`@`[1]

if(!text && !m.quoted) return await conn.sendButton(m.chat, `من؟🤔\n قم بالإشارة إلى الشخص أو الرد على رسالته`, wm, null, [['القائمة الرئيسية ☘️', '/menu']], fkontak, m)

try {
if(text) {
var user = number + '@s.whatsapp.net'
} else if(m.quoted.sender) {
var user = conn.getName(m.quoted.sender)
} else if(m.mentionedJid) {
var user = number + '@s.whatsapp.net'
}  
} catch (e) {
} finally {
    
let users = m.isGroup ? participants.find(v => areJidsSameUser(v.jid == user)) : {}
let yo = conn.getName(m.sender)
let tu = conn.getName(who)

if(!users) return await conn.sendButton(m.chat, `لم يتم العثور على الشخص، يجب أن يكون في هذه المجموعة`, wm, null, [['القائمة الرئيسية ☘️', '/menu']], fkontak, m)
    
if(user === m.sender) return await conn.sendButton(m.chat, `لا يمكنك أن تكون شريك نفسك 😂`, wm, null, [['القائمة الرئيسية ☘️', '/menu']], fkontak, m)
    
if(user === conn.user.jid) return await conn.sendButton(m.chat, `لا يمكنني أن أكون شريكك 😹`, wm, null, [['القائمة الرئيسية ☘️', '/menu']], fkontak, m)
    
if(global.db.data.users[user].pasangan != m.sender){ 
return await conn.sendButton(m.chat, `لا يمكنك القبول إذا لم يعلن أحد عن ذلك، قم بالإعلان مع *${tu}* حتى يوافق أو يرفض`, wm, null, [['القائمة الرئيسية ☘️', '/menu']], fkontak, m, { contextInfo: { mentionedJid: [user, tu]}})    
} else {
global.db.data.users[m.sender].pasangan = user
return await conn.sendButton(m.chat, `🥳😻 مبروك *${tu}*\n✅ لقد دخلتما في علاقة رسمية \n\nنتمنى لكم الحب والسعادة 💖😁`, `*${tu} 💞 ${yo}*\n` + wm, img5, [['القائمة الرئيسية ☘️', '/menu']], m, dos.getRandom(), { contextInfo: { mentionedJid: [user, tu, yo]}})   
}}}

handler.command = /^(قبول|موافقة)$/i
handler.group = true
export default handler