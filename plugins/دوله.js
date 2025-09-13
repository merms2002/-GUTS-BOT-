let handler = async (m, { conn, participants, usedPrefix, command }) => {

  let kickte = `*حدد الدولة يا حب!*`
  
  let args = m.text.split(' ')
  if (args.length < 2) return m.reply(kickte, m.chat, { mentions: conn.parseMention(kickte)})
  
  let countryCode = args[1]
  let groupMembers = participants.map(p => p.id)
  let usersToKick = groupMembers.filter(id => id.startsWith(countryCode))
  
  if (usersToKick.length === 0) return m.reply(`*مفيش اعضاء  ب رمز دولة دا ${countryCode}*`)
  
  await conn.groupParticipantsUpdate(m.chat, usersToKick, 'remove')
  m.reply(`*تم طرد جميع الأعضاء الذين يبدأ رقمهم بـ ${countryCode} 𝑋𝑋*`)

}

handler.help = ['طرد-دولة <رمز الدولة>']
handler.tags = ['group']
handler.command = ['طرد-دولة'] 
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler