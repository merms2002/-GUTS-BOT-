import fs from 'fs'

const FILE = './subscribed-groups.json'

try {
  global.subscribedGroups = JSON.parse(fs.existsSync(FILE) ? fs.readFileSync(FILE) : '{}')
} catch {
  global.subscribedGroups = {}
}

function saveGroups() {
  fs.writeFileSync(FILE, JSON.stringify(global.subscribedGroups, null, 2))
}

function formatMs(ms) {
  let s = Math.floor(ms / 1000) % 60
  let m = Math.floor(ms / (1000 * 60)) % 60
  let h = Math.floor(ms / (1000 * 60 * 60)) % 24
  let d = Math.floor(ms / (1000 * 60 * 60 * 24))
  return `${d ? d + 'ي ' : ''}${h ? h + 'س ' : ''}${m ? m + 'د ' : ''}${s}ث`
}

let handler = async (m, { conn }) => {
  let msg = '↞┇المجموعات المشترك فيها البوت:\n\n'
  let now = Date.now()
  let count = 0
  let changed = false

  for (let id in global.subscribedGroups) {
    let info = global.subscribedGroups[id]
    if (!info || !info.leaveAt) continue

    let remaining = info.leaveAt - now
    if (remaining > 0) {
      count++
      try {
        let metadata = await conn.groupMetadata(id)
        msg += `• ${metadata.subject || id}\n↞┇الوقت المتبقي: ${formatMs(remaining)}\n\n`
      } catch {
        msg += `• ${id}\n↞┇الوقت المتبقي: ${formatMs(remaining)}\n\n`
      }
    } else {
      delete global.subscribedGroups[id]
      changed = true
    }
  }

  if (count === 0) msg = '↞┇لا يوجد مجموعات مشترك بها حالياً.'
  if (changed) saveGroups()

  return m.reply(msg)
}

handler.help = ['المشتركين']
handler.tags = ['owner']
handler.command = /^(المشتركين|المشتركينن)$/i
handler.rowner = true

export default handler
