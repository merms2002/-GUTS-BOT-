let linkRegex1 = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})|5chat-whatzapp\.vercel\.app/i;
let linkRegex2 = /whatsapp.com\/channel\/([0-9A-Za-z]{20,24})/i;

export async function before(m, { conn, isAdmin, isBotAdmin, isOwner, isROwner, participants }) {
if (!m.isGroup) return 
if (isAdmin || isOwner || m.fromMe || isROwner) return
 
let chat = global.db.data.chats[m.chat];
let delet = m.key.participant;
let bang = m.key.id;
const user = `@${m.sender.split`@`[0]}`;
const groupAdmins = participants.filter(p => p.admin);
const listAdmin = groupAdmins.map((v, i) => `*» ${i + 1}. @${v.id.split('@')[0]}*`).join('\n');
let bot = global.db.data.settings[this.user.jid] || {};
const isGroupLink = linkRegex1.exec(m.text) || linkRegex2.exec(m.text);
const grupo = `https://chat.whatsapp.com`;
if (isAdmin && chat.antiLink && m.text.includes(grupo)) return m.reply('*نظام منع الروابط مفعّل، لكنك محظوظ لأنك أدمن 😎!*');
if (chat.antiLink && isGroupLink && !isAdmin) {
if (isBotAdmin) {
const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`;
if (m.text.includes(linkThisGroup)) return !0;
}
await conn.sendMessage(m.chat, { text: `*「 اكتشاف رابط ممنوع 」*

${user} 🤨 لقد خالفت قواعد المجموعة وسيتم طردك....`, mentions: [m.sender] }, { quoted: m, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100 });
if (!isBotAdmin) return conn.sendMessage(m.chat, { text: `*لقد نجوت هذه المرة، لكني لست أدمن فلا يمكنني طردك*`, mentions: [...groupAdmins.map(v => v.id)] }, { quoted: m });
if (isBotAdmin) {
await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } });
let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove');
if (responseb[0].status === "404") return;
}} else if (!bot.restrict) {
return m.reply('*مالك البوت لم يقم بتفعيل خاصية التقييد (enable restrict)، تواصل معه لتفعيلها*');
}
return !0;
}
