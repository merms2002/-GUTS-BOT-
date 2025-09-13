let WAMessageStubType = (await import('@whiskeysockets/baileys')).default

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return

  const fkontak = {
    "key": {
      "participants": "0@s.whatsapp.net",
      "remoteJid": "status@broadcast",
      "fromMe": false,
      "id": "Halo"
    },
    "message": {
      "contactMessage": {
        "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    "participant": "0@s.whatsapp.net"
  }

  let chat = global.db.data.chats[m.chat]
  let usuario = `@${m.sender.split('@')[0]}`
  let pp = await conn.profilePictureUrl(m.chat, 'image').catch(_ => null) || 'https://qu.ax/QGAVS.jpg'

  let nombre, foto, edit, newlink, status, admingp, noadmingp
  nombre = `> ✐ \`تنبيه\` » ${usuario} قام *بتغيير اسم المجموعة* إلى *${m.messageStubParameters[0]}* ✐`
  foto = `*┇🖼❯ لـقـد قـام 【${usuario}】بـتـغـيـر ايـقـونـة الـمـجـمـوعـه ❐`
  edit = `*❐⊹•╾╾─•─❯┇🏮┇❮─•─╼╼•⊹❐*
*【🎛┇تـم تـغـيـر اعـدادات الـمـجـمـوعـه┇🎛】*
*❐⊹•╾╾─•─❯┇🏮┇❮─•─╼╼•⊹❐*

*❐┇${m.messageStubParameters[0] == 'on' ? 'الـمـشـرفـيـن فـقـط' : 'لـلـكــل'}.*`
  newlink = `🌸 تم إعادة تعيين رابط المجموعة بواسطة:\n*» ${usuario}*`
  status = `*❐⊹•╾╾─•─❯┇🔐┇❮─•─╼╼•⊹❐*
*❐🔐┇تـم ${m.messageStubParameters[0] == 'on' ? 'غـلـق' : 'فـتـح'} الـمـجـمـوعـه┇🔐❐*
*❐⊹•╾╾─•─❯┇🔐┇❮─•─╼╼•⊹❐*
\n${m.messageStubParameters[0] == 'on' ? '*❐┇يـسـتـطـيـع الـمـشـرفـيـن فـقـط الـتـحـدث┇❯*' : '*❐┇يـسـتـطـيـع الـجـمـيـع الـتـحـدث الـان┇❯*'}`
  admingp = `*❐⊹•╾╾─•─❯┇🏮┇❮─•─╼╼•⊹❐*
*❐🔝┇اعـلان تـرقـيـه عـضـو┇🔝❐*
*❐⊹•╾╾─•─❯┇🏮┇❮─•─╼╼•⊹❐*
*┇👤❯ الـمـشـرف الـجـديـد: 【@${m.messageStubParameters[0].split('@')[0]}】*

*┇👮‍♂️❯ الـذي قـام بـي تـرقـيـتـه: 【${usuario}】*
*❐⊹•╾╾─•─❯┇🏮┇❮─•─╼╼•⊹❐`
  noadmingp = `*❐⊹•╾╾─•─❯┇🏮┇❮─•─╼╼•⊹❐*
*❐⏬┇اعـلان خـفـض مـشـرف┇⏬❐*
*❐⊹•╾╾─•─❯┇🏮┇❮─•─╼╼•⊹❐*
*┇👤❯ الـمـشـرف: 【@${m.messageStubParameters[0].split('@')[0]}】*

*┇👮‍♂️❯ الـذي قـام بـي خـفـضـه: 【${usuario}】*
*❐⊹•╾╾─•─❯┇🏮┇❮─•─╼╼•⊹❐`

  if (chat.detect && m.messageStubType == 21) {
    await conn.sendMessage(m.chat, { text: nombre, mentions: [m.sender] }, { quoted: fkontak })

  } else if (chat.detect && m.messageStubType == 22) {
    await conn.sendMessage(m.chat, { image: { url: pp }, caption: foto, mentions: [m.sender] }, { quoted: fkontak })

  } else if (chat.detect && m.messageStubType == 23) {
    await conn.sendMessage(m.chat, { text: newlink, mentions: [m.sender] }, { quoted: fkontak })

  } else if (chat.detect && m.messageStubType == 25) {
    await conn.sendMessage(m.chat, { text: edit, mentions: [m.sender] }, { quoted: fkontak })

  } else if (chat.detect && m.messageStubType == 26) {
    await conn.sendMessage(m.chat, { text: status, mentions: [m.sender] }, { quoted: fkontak })

  } else if (chat.detect && m.messageStubType == 29) {
    await conn.sendMessage(m.chat, { text: admingp, mentions: [m.sender, m.messageStubParameters[0]] }, { quoted: fkontak })
    return;
  }

  if (chat.detect && m.messageStubType == 30) {
    await conn.sendMessage(m.chat, { text: noadmingp, mentions: [m.sender, m.messageStubParameters[0]] }, { quoted: fkontak })
  }
}
