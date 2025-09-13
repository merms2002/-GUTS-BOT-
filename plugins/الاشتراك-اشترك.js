function ms(str) {
  let match = str.match(/^(\d+)(s|m|h|d)$/)
  if (!match) return null
  let num = parseInt(match[1])
  let type = match[2]
  let mult = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }
  return num * mult[type]
}

let handler = async (m, { conn, text, command }) => {
  let [inviteLink, duration] = text.split('|').map(str => str.trim())

  if (!inviteLink || !duration) {
    throw `↞┇استخدم الأمر بهذا الشكل:\n\n${command} رابط_الدعوة | المدة\n\nمثال:\n${command} https://chat.whatsapp.com/XXXXXXX | 5m`
  }

  if (!inviteLink.includes('whatsapp.com')) {
    throw '↞┇هذا ليس رابط دعوة صحيح.'
  }

  let match = inviteLink.match(/chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/)
  if (!match) {
    throw '↞┇لم أستطع استخراج كود الدعوة من الرابط.'
  }

  let code = match[1]
  let time = ms(duration)
  if (!time) throw '↞┇المدة غير صحيحة. استخدم مثل: 1m، 2h، 3d ...'

  try {
    let groupId = await conn.groupAcceptInvite(code) // هنا نحصل على ID الجروب
    m.reply('✓ تم الاشتراك في المجموعة بنجاح!')

    setTimeout(async () => {
      try {
        await conn.sendMessage(groupId, { text: '*↞┇وداعًا، انتهت مدة اشتراككم. (🗿)ゞ*' })
        await conn.groupLeave(groupId)
      } catch (err) {
        console.log('↞┇خطأ عند مغادرة الجروب:', err)
      }
    }, time)

  } catch (e) {
    throw `↞┇فشل الانضمام للجروب:\n${e.message}`
  }
}

handler.help = ['اشترك <رابط الدعوة> | <المدة>']
handler.tags = ['owner']
handler.command = /^(اشتركك|اشترك)$/i
handler.rowner = true

export default handler
