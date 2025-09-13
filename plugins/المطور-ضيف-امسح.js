import fs from 'fs';

const allowedNumbers = ['201122486904@s.whatsapp.net', '201122486904@s.whatsapp.net'];

const handler = async (m, { text, usedPrefix, command, conn }) => {
  if (!allowedNumbers.includes(m.sender)) {
    await conn.sendMessage(m.chat, { text: `غير مسموح لك يا عبد` }, { quoted: m });
    return;
  }

  if (!text) throw `امم.. ما الاسم الذي أعطيه للأمر؟ 🧞`;

  const path = `plugins/${text}.js`;

  if (command === 'ضيف' || command === 'addp' || command === 'addplugin') {
    if (!m.quoted || !m.quoted.text) throw `الرد على الرسالة ليتم حفظها! 🧞`;

    await fs.writeFileSync(path, m.quoted.text);

    m.reply(`تم الحفظ باسم ${path} بنجاح! 🧞`);
  } else if (command === 'امسح') {
    if (!fs.existsSync(path)) throw `الملف "${path}" غير موجود لحذفه! 🧞`;

    fs.unlinkSync(path);

    m.reply(`تم حذف الملف ${path} بنجاح! 🧞`);
  }
};

handler.help = ['saveplugin', 'deleteplugin'].map((v) => v + ' <nombre>');
handler.tags = ['owner'];
handler.command = ['ضيف', 'addp', 'addplugin', 'امسح'];
handler.owner = true;

export default handler;