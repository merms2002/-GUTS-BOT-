let linkRegex = /https:/i
export async function before(m, { isAdmin, isBotAdmin, text }) {
  if (m.isBaileys && m.fromMe)
    return !0
  if (!m.isGroup) return !1
  let chat = global.db.data.chats[m.chat]
  let delet = m.key.participant
  let bang = m.key.id
  const user = `@${m.sender.split`@`[0]}`;
  let bot = global.db.data.settings[this.user.jid] || {}
  const isGroupLink = linkRegex.exec(m.text)
  if (chat.antiLink2 && isGroupLink && !isAdmin) {
    if (isBotAdmin) {
      const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
      const linkThisGroup2 = `https://www.youtube.com/`
      const linkThisGroup3 = `https://youtu.be/`
      if (m.text.includes(linkThisGroup)) return !0
      if (m.text.includes(linkThisGroup2)) return !0
      if (m.text.includes(linkThisGroup3)) return !0
    }
    await conn.sendMessage(m.chat, {text: `*「 اكتشاف رابط ممنوع 」*\n\n${user} 🤨 لقد خالفت قواعد المجموعة، سيتم طردك....`, mentions: [m.sender]}, {quoted: m})
    if (!isBotAdmin) return m.reply('*لقد نجوت هذه المرة، لكني لست أدمن فلا يمكنني طردك*')  
    if (isBotAdmin) {
      await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
      let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      if (responseb[0].status === "404") return
    } else if (!bot.restrict) return m.reply('*مالك البوت لم يقم بتفعيل خاصية التقييد (enable restrict)، تواصل معه لتفعيلها*')
  }
  return !0
}
