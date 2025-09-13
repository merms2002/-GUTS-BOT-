const handler = async (m, {conn, text, command, usedPrefix}) => {
  if (m.mentionedJid.includes(conn.user.jid)) return;
  const image = './Menu2.jpg'
  const pp = imagen4
  let who;
  if (m.isGroup) {
    who = m.mentionedJid[0] ?
      m.mentionedJid[0] :
      m.quoted ?
      m.quoted.sender :
      text;
  } else who = m.chat;
  const user = global.db.data.users[who];
  const bot = global.db.data.settings[conn.user.jid] || {};
  const dReason = 'مافي سبب🐦';
  const msgtext = text || dReason;
  const sdms = msgtext.replace(/@\d+-?\d* /g, '');
  const warntext = `*❐═━━━═╊⊰🦇⊱╉═━━━═❐*\n*❐┃سوي منشن او ريبلاي للشخص يلي تريده┃🛑❯*\n\n*❐↞┇ مثال ↞ ${usedPrefix + command} @رايزل السبب┇*\n*❐═━━━═╊⊰🦇⊱╉═━━━═❐*\n*𝐊𝐀𝐊𝐀𝐒𝐇𝐈 𝐁𝐎𝐓*`

  if (!who) {
    return conn.sendMessage(m.chat, {image: pp, caption: warntext.trim(), mentions: conn.parseMention(warntext) }, {quoted: m})
  };

  user.warn += 1;
  await m.reply(
      `*❐═━━━═╊⊰🦇⊱╉═━━━═❐*\n*❐┃ابلع انذار يا ${
      user.warn == 1 ? `@${who.split`@`[0]}` : `@${who.split`@`[0]}`
      } طردك قرب┃⛔❯*\n*『سـبـب الانـ♨️ـذار┇↜${sdms} 』*\n*『عـدد الانـ🚫ـذارات┇↜  ${user.warn}/5』*\n*〘5انذارات=طرد😼〙*\n*❐═━━━═╊⊰🦇⊱╉═━━━═❐*\n𝐊𝐀𝐊𝐀𝐒𝐇𝐈 𝐁𝐎𝐓`,
      null,
      {mentions: [who]},
  );
  if (user.warn >= 5) {
    if (!bot.restrict) {
      return m.reply(
          '*❐═━━━═╊⊰🦇⊱╉═━━━═❐*\n*❐┃سوف يتم طردك لانك تخطيت الحدود لكن الطرد مقفل بواسطه المالك قم بالتواصل معه لتفعيل الطرد┃⚠️❯*\n*❐═━━━═╊⊰🦇⊱╉═━━━═❐*\n*𝐊𝐀𝐊𝐀𝐒𝐇𝐈 𝐁𝐎𝐓',
      );
    }
    user.warn = 0;
    await m.reply(
       `*❐═━━━═╊⊰🦇⊱╉═━━━═❐*\n*❐┃اخذت 5 تنبيهات ولم تتادب سيتم طردك يا @${
          who.split`@`[0]
        } عد عندما تصبح جيدا الا اللقاء┃🛑❯*\n*❐═━━━═╊⊰🦇⊱╉═━━━═❐*\n*𝐊𝐀𝐊𝐀𝐒𝐇𝐈 𝐁𝐎𝐓`,
        null,
        {mentions: [who]},
    );
    await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
  }
  return !1;
};

handler.command = /^(انذار|تنبيه|warn|warning)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;
export default handler;