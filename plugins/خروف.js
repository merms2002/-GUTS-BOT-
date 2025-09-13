let handler = async (m, { conn, command, text, usedPrefix }) => {
if (!text) throw `*[❗ركـز❗] اعمل منشن لي الشخص عشان الامر يشتغل*`
if (command == 'ورع') {
conn.reply(m.chat, `
_*${text.toUpperCase()}* *نسبة ورعنته* *${(500).getRandom()}%* *الله يشفيك و تكبر كذا و تكون عاقل*_
`.trim(), m, m.mentionedJid ? {
mentions: m.mentionedJid
} : {})}
  
if (command == 'اهبل') {
conn.reply(m.chat, `
_*${text.toUpperCase()}* *نسبة هبله* *${(500).getRandom()}%* *اخخ بس متا ناوي تعقل يا* *${command.replace('how', '').toUpperCase()}*_
`.trim(), m, m.mentionedJid ? {
mentions: m.mentionedJid
} : {})} 
 
if (command == 'خروف') {
conn.reply(m.chat, `
_*${text.toUpperCase()}* *نسبة خرفنته* *${(500).getRandom()}%* *ياخوي اعقل شوية يعني يا* *${command.replace('how', '').toUpperCase()}*_
`.trim(), m, m.mentionedJid ? {
mentions: m.mentionedJid
} : {})}     
}
handler.help = ['ورع', 'اهبل', 'خروف', 'جميل', 'غباء', 'ذكاء', 'manco', 'manca', 'ذكاء', 'prostituta', 'prostituto'].map(v => v + ' @tag | nombre')
handler.tags = ['calculator']
handler.command = /^ورع|خروف|غباء/i
export default handler