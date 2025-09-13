import fs from 'fs'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { join } from 'path'

let handler = async (m, { conn, usedPrefix, __dirname, text, isPrems }) => {
  try {
    let img = await (await fetch('https://files.catbox.moe/uw50pt.jpg')).buffer()
    let d = new Date(Date.now() + 3600000)
    let locale = 'ar'
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)

    let user = global.db.data.users[m.sender]
    let { exp, limit, level, role, money, joincount } = user
    let { min, xp, max } = xpRange(level, global.multiplier)
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let more = String.fromCharCode(8206)
    let readMore = more.repeat(850)
    await conn.sendMessage(m.chat, { react: { text: '📂', key: m.key } })
    let taguser = '@' + m.sender.split("@")[0]

    let str = `
~*⊹‏⊱≼━━━⌬〔☠️〕⌬━━━≽⊰⊹*
*↶اوامـــر ادوارد بوت ↶*
*⊹‏⊱≼━━━⌬〔☠️〕⌬━━━≽⊰⊹*
*˼🍃˹↶| مـــعــلـــومــاتـك | ↶˼🍃˹*
~*⊹‏⊱≼━━━⌬〔☠️〕⌬━━━≽⊰⊹*
*˼👤˹ الــإســم ╎@${taguser} 」*
*˼🍒˹  الـلـفــل ╎${role} 」*
*˼🎐˹ الــخــبـره ╎${exp} 」*
*˼💎˹ الـألـمـاس ╎${limit} 」*
~*⊹‏⊱≼━━━⌬〔☠️〕⌬━━━≽⊰⊹*
*˼🍃˹ ↶| الـأقــــســام ↶| ˼🍃˹*
~*⊹‏⊱≼━━━⌬〔☠️〕⌬━━━≽⊰⊹*
*˼🛹˹ | م1 | قــســم الــصـور | ↶*
*˼🔍˹ | م2 | قـســـم الــبــحـث | ↶*
*˼🎗˹ | م3 | قــســم الـتــحـــويـل | ↶*
*˼🤖˹ | م4 | قــسـم الــذكــاء الـإصــطــنـاعي | ↶*
*˼🏮˹ | م5 | قـــســم الـألـــعـاب | ↶*
*˼🎪˹ | م6 | قــســم الــتـرفــيــه | ↶*
*˼🕋˹ | م7 | قــسـم الــديــن | ↶*
*˼🔊˹ | م8 | قــســم الــصـــوتــيـــات | ↶*
*˼👑˹ | م9 | قــسـم الـمـجـمــوعـات | ↶*
*˼🏛˹ | م10 | قـســم الــبــنــك | ↶*
*˼🎭˹ | م11 | قـــســم الـفـعـالــيــات | ↶*
*˼🎐˹ | م12 | قـــســم الـإشـتــراك ↶*
*⊹‏⊱≼━━━⌬〔☠️〕⌬━━━≽⊰⊹*
`.trim()

    let buttonMessage = {
      image: { url: 'https://files.catbox.moe/uw50pt.jpg' },
      caption: str,
      mentions: [m.sender],
      footer: 'Edward',
      headerType: 4,
      contextInfo: {
        mentionedJid: [m.sender],
        externalAdReply: {
          showAdAttribution: true,
          mediaType: 1,
          title: 'Edward',
          thumbnail: img,
          sourceUrl: 'https://chat.whatsapp.com/Ia6cakzzvykIlfbAzIKbi4'
        }
      }
    }

    conn.sendMessage(m.chat, buttonMessage, { quoted: m })

  } catch (e) {
    console.error(e)
    conn.reply(m.chat, '[❗خطاء❗]', m)
  }
}

handler.command = /^(help|الاوامر|menu|أوامر|اوامر)$/i
handler.exp = 20
handler.fail = null
export default handler

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}
