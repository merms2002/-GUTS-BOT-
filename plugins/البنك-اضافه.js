const handler = async (m, {conn, command, args}) => {
let who;
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
else who = m.sender;
let users = global.db.data.users[m.sender];

if (command == 'dep' || command == 'depositar') {    
if (!args[0]) return m.reply(`[ ⚠️ ] *أدخل الكمية التي تريد إضافتها إلى حسابك البنكي*`);
if (args[0] == '--all') {
let count = parseInt(users.limit);
users.limit -= count * 1;
users.banco += count * 1;
await m.reply(`*[ 🏦 ] لقد أضفت المبلغ إلى البنك.*`);
return !0;
};
if (!Number(args[0])) return m.reply(`[ ⚠️ ] *يجب إدخال رقم صحيح لقيمة الألماس 💎*`);
let count = parseInt(args[0]);
if (!users.limit) return m.reply(`*أنت فقير، لا تملك ما يكفي من الألماس!*`);
if (users.limit < count) return m.reply(`*هل تعرف كم لديك في محفظتك؟ استخدم الأمر:* #bal`);
users.limit -= count * 1;
users.banco += count * 1;
await m.reply(`*[ 🏦 ] لقد أودعت ${count} ألماسة في البنك*`);
}

if (command == 'retirar' || command == 'toremove') {     
let user = global.db.data.users[m.sender];
if (!args[0]) return m.reply(`[ ⚠️ ] *أدخل الكمية التي تريد سحبها*`);
if (args[0] == '--all') {
let count = parseInt(user.banco);
user.banco -= count * 1;
user.limit += count * 1;
await m.reply(`*[ 🏦 ] لقد سحبت (${count}) ألماسة 💎 من البنك.*`);
return !0;
}
if (!Number(args[0])) return m.reply(`*يجب أن تكون الكمية رقمًا!*`); 
let count = parseInt(args[0]);
if (!user.banco) return m.reply(`*يا شبح 👻، ليس لديك هذا المبلغ في البنك 🥲*`);
if (user.banco < count) return m.reply(`*هل تعرف كم لديك في محفظتك؟ استخدم الأمر:* #bal`);
user.banco -= count * 1;
user.limit += count * 1;
await m.reply(`*[ 🏦 ] لقد سحبت (${count}) من البنك*`);
}
}
handler.help = ['dep', 'retirar'];
handler.tags = ['econ'];
handler.command = /^(dep|اضافه|retirar|toremove)$/i;

export default handler;
