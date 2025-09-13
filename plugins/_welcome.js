import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup || !m.messageStubParameters?.[0]) return !0

  const jid = m.messageStubParameters[0]
  const user = `@${jid.split('@')[0]}`
  const pp = await conn.profilePictureUrl(jid, 'image').catch(() => 'https://raw.githubusercontent.com/The-King-Destroy/Adiciones/main/Contenido/1745522645448.jpeg')
  const img = await fetch(pp).then(r => r.buffer())
  const chat = global.db.data.chats[m.chat] || {}
  const total = m.messageStubType == 27 ? participants.length + 1 : participants.length - 1

  const contacto = {
    key: { participants: "0@s.whatsapp.net", remoteJid: "status@broadcast", fromMe: false, id: "Halo" },
    message: { contactMessage: { vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Bot;;;\nFN:Bot\nTEL;waid=${jid.split('@')[0]}:${jid.split('@')[0]}\nEND:VCARD` } },
    participant: "0@s.whatsapp.net"
  }

  if (!chat.welcome) return

  if (m.messageStubType == 27) {
    const bienvenida = `
🟣 ASTA-BOT v2077 — ي هلاغلانورت الجروب اي زعاج من عضوتدخل على مشرف الجروب  ينصف لك لاتسوي مشكل  

👤 اهلـاً بڪم في ع⃟ــᬼٰٰٰٰٖٖـ͜ـالٖ͠مۘ͢ـــ͜͢͡ي*

❃لٖ͠سوالف هنـــا تجدون مايسعدكم حللتم سهلاً ووطأتم اهلا.❋  

ـــ᭄ـ͜ـــــ᭄ـ͜ـــــ᭄ـ͜ـــــ᭄ـ͜ـــــ᭄ـ͜ـــــ᭄ـ͜ـــــ᭄ـ͜ــ

❌ــــــــــــ℘🔥☠🔥℘ـــــــــــ❌ 

*_~أنــ̮ـــ͢ـ̸̐ـــت.cv لا تعـ̮ـــ͢ـ̸̐ـــرف قصتـ̮ـــ͢ـ̸̐ـــي.cv كـ̮ـــ͢ـ̸̐ـــم كـ̮ـــ͢ـ̸̐ـــان عمـ̮ـــ͢ـ̸̐ـــق.cv مصيبتـ̮ـــ͢ـ̸̐ـــي أو كـ̮ـــ͢ـ̸̐ـــم.cv مـ̮ـــ͢ـ̸̐ـــرةً تأذيـ̮ـــ͢ـ̸̐ـــتُ.cv وكنـ̮ـــ͢ـ̸̐ـــت.cv وحـ̮ـــ͢ـ̸̐ـــدي لا تعـ̮ـــ͢ـ̸̐ـــرف.cv شيـ̮ـــ͢ـ̸̐ـــئًا عنـ̮ـــ͢ـ̸̐ـــي.cv أنـ̮ـــ͢ـ̸̐ـــت فقـ̮ـــ͢ـ̸̐ـــط تعـ̮ـــ͢ـ̸̐ـــرف.cv إسمـ̮ـــ͢ـ̸̐ـــي.cv‹⇣❌👌⇣›~_
تاريخي يرعبڪم واسمي يزلزلكم*وحضوري يســﺟلٖ͠*

*خ٘ۗ͢ࢪوڪﻡ🔥☠️*

*تُ͢ࢪف͜ـع الٖ͠ࢪؤوس وتُثبت الاقدام*احتراماً لنا😈*

~*1اهـݪآ و٘سؔهٰٰݪآ✨.*~
2قوانين الڪروب~*.

~3ممنوع الدخول خاص~*.

4ممنوع آلࢪوꪇآب͡ـط~*.

5ممنوع السب ولالفاض السيئة~*.

6اي ازعاج المشرفين بل خدمه~*.

7اي شكوا عليك ازاله مباشر~*.

8احترم تحترم~*.

~9نتشرف بل جميع منين ما ڪنتم~*.* : ${user}
📍 Grupo: ${groupMetadata.subject}
🔗 الحالة: غير متصل
👥 تم حفض البياناته بنجاح: ${total}

⌬ Usa *#help* para ver los comandos disponibles
`
    await conn.sendMini(m.chat, '🚀 CONEXIÓN ESTABLECIDA', 'ASTA-BOT', bienvenida, img, img, null, contacto)
  }

  if ([28, 32].includes(m.messageStubType)) {
    const despedida = `
🔻 ASTA-BOT v2077 — Nunca vuelvas

👤 Usuario: ${user}
📍 Grupo: ${groupMetadata.subject}
🔌 Estado: Desconectado
👥 Miembros: ${total}

⌬ Datos eliminados correctamente
`
    await conn.sendMini(m.chat, '⚠️ DESCONECTADO DEL SISTEMA', 'ASTA-BOT', despedida, img, img, null, contacto)
  }
}