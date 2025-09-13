import fetch from 'node-fetch';

const handler = async (m, { conn, args, command }) => {
  const query = args.join(' ');
  const cmd = command.toLowerCase();

  if (!query) {
    return conn.sendMessage(m.chat, {
      text: `مرحباً 🧞
لاستخدام الأمر *${cmd}* يرجى كتابة اسم الأغنية أو رابط الفيديو.

مثال: *.${cmd} faded*

🆅🅸🆃🅾 🅱🅾🆃🧞`
    }, { quoted: m });
  }

  await conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  try {
    const api = `https://api.nekorinn.my.id/downloader/ytplay-savetube?q=${encodeURIComponent(query)}`;
    const res = await fetch(api);
    const json = await res.json();

    if (!json?.status || !json?.result) throw 'فشل في جلب بيانات الفيديو.';

    const {
      title = 'بدون عنوان',
      channel = 'غير معروف',
      duration = '-',
      imageUrl = '',
      link = ''
    } = json.result.metadata || {};

    const audioUrl = json.result.downloadUrl;
    if (!audioUrl) throw 'الصوت غير متوفر لهذا الفيديو.';

    const caption = `
*يُوتيوب - تشغيل* 🧞

• العنوان: ${title} 🧞
• القناة: ${channel} 🧞
• المدة: ${duration} 🧞
• الرابط: ${link} 🧞
• الصيغة: صوت فقط 🧞

🆅🅸🆃🅾 🅱🅾🆃🧞
`.trim();

    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        externalAdReply: {
          title: title,
          body: 'تشغيل الموسيقى 🧞',
          thumbnailUrl: imageUrl,
          sourceUrl: link,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });

    const checkAudio = await fetch(audioUrl, { method: 'HEAD' });
    if (!checkAudio.ok) throw 'لا يمكن الوصول إلى رابط الصوت أو الرابط غير صالح.';

    await conn.sendMessage(m.chat, {
      audio: { url: audioUrl },
      mimetype: 'audio/mp4',
      ptt: false
    }, { quoted: m });

  } catch (e) {
    console.error('حدث خطأ:', e);
    throw 'حدث خطأ أثناء جلب أو إرسال الصوت.';
  }
};

handler.help = ['ytplay <اسم أو رابط>', 'تشغيل <اسم أو رابط>'];
handler.tags = ['downloader'];
handler.command = ['ytplay', 'تشغيل'];

export default handler;