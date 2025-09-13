const handler = async (m, {usedPrefix}) => {
  let who;
  if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
  else who = m.sender;
  const name = conn.getName(who);
  m.reply(`
┓━━⊰ _🪙قائمه عملاتك🪙_ ⊱━━⊰
┣⊱⧪⟫ *الــــإسـم..👤* : ${name}
┣⊱⧪⟫ *عــــمـــلـاتــك* : ${global.db.data.users[who].limit}
┛━━━━━━⊰🪙🪙🪙⊱━━━━━⊰ـ
*لــــتــعــرف مــــزيـد مـن مــــعـــلــــومــات الـــبــــنــك الــــخـــاص بـــك اكـــتـــب (.الـــبـــــنــــك)* 
`);
};
handler.help = ['ami'];
handler.tags = ['xp'];
handler.command = ['عملاتي'];
export default handler;
