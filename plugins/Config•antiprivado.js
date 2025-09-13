export async function before(m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
  if (m.isBaileys && m.fromMe) return !0;
  if (m.isGroup) return !1;
  if (!m.message) return !0;
  if (m.text.includes('المطور') || m.text.includes('تنصيب') || m.text.includes('حديث') || m.text.includes('مطور') || m.text.includes('jadibot')) return !0;
  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};
  if (bot.antiPrivate && !isOwner && !isROwner) {
    await m.reply(`
*༺━─━─╃⌬〔❗〕⌬╄─━─━༻*
*\`「❗┇「مـانــــع الـدخـول لـلـخـاص」┇❗」\`*
*✧━═━═━═━〔❗〕━═━═━✧*
*「سـبـب اضـافـة مـانـع لـلـخـاص」:* 
*✧━═━═━═━〔❗〕━═━═━✧*
\`عـنـد دخـول الـخـاص تـرتـفـع نـسـبـة حـظـر رقـم الـبـوت وهـذا مـضـر جـدا لـلـمـطـور لـن هـو يـصـنـع الـبـوت لـي مـسـاعـدكـم\`
*✧━═━═━═━〔❗〕━═━═━✧*
\`ارجـو ان تـتـفـهـم الـمـوضـوع وهـذا رابـط الـمـجـمـوعـه لـسـتـخـدام الـبـوت بـحـريـه تـامـه.\`
*✧━═━═━═━〔♦〕━═━═━✧*
「 https://chat.whatsapp.com/Ljux27gGpSZD3pcnxzrnU7 」
`, false, {mentions: [m.sender]});
    await this.updateBlockStatus(m.chat, 'block');
  }
  return !1;
}
