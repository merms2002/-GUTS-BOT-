import { igdl } from 'ruhend-scraper';

const handler = async (m, { text, conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, '*`أدخل رابط الفيديو الذي تريد تحميله 🤍`*', m);
  }

  await m.react('🕒');
  let res;
  try {
    res = await igdl(args[0]);
  } catch (error) {
    return conn.reply(m.chat, '*`حدث خطأ أثناء جلب البيانات. تحقق من الرابط.`*', m);
  }

  let result = res.data;
  if (!result || result.length === 0) {
    return conn.reply(m.chat, '*`لم يتم العثور على نتائج.`*', m);
  }

  let data;
  try {
    data = result.find(i => i.resolution === "720p (HD)") || result.find(i => i.resolution === "360p (SD)");
  } catch (error) {
    return conn.reply(m.chat, '*`حدث خطأ أثناء معالجة البيانات.`*', m);
  }

  if (!data) {
    return conn.reply(m.chat, '*`لم يتم العثور على دقة مناسبة.`*', m);
  }

  await m.react('✅');
  let video = data.url;
  
  try {
    await conn.sendMessage(m.chat, {
      video: { url: video },
      caption: '*✔️🍟 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝖾𝗋 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄.*',
      fileName: 'fb.mp4',
      mimetype: 'video/mp4'
    }, { quoted: m });
  } catch (error) {
    await m.react('❌');
    return conn.reply(m.chat, '*`حدث خطأ أثناء إرسال الفيديو.`*', m);
  }
};

handler.help = ['fb *<رابط>*'];
handler.tags = ['dl'];
handler.command = /^(fb|facebook|فيس)$/i;

export default handler;
