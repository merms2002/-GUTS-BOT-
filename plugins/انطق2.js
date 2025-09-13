import axios from 'axios';
import fs from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const الأصوات = [
  { id: "waveltts_3786e470-7129-4f01-a263-0801b302acf1", الاسم: "1" },
  { id: "waveltts_7a16488d-eba0-4fa3-876a-97fbd57551ca", الاسم: "2" },
  { id: "waveltts_f5066419-beae-43c6-bf67-d8ad0cec52a5", الاسم: "3" },
  { id: "waveltts_aaf98444-e4e9-4bd6-9921-b307bbd2689e", الاسم: "4" },
  { id: "waveltts_297d3749-2394-4396-8324-e6fdb26846f0", الاسم: "5" },
  { id: "waveltts_e51e20fb-4e89-41a0-9fbe-0f22f73c9557", الاسم: "6" }
];

async function تحويل_النص_إلى_صوت(النص, الصوت) {
  try {
    const الصوت_المختار = الأصوات[الصوت - 1] || الأصوات[0];
    const الرابط = 'https://wavel.ai/wp-json/custom/v1/synthesize-audio';
    const الرؤوس = {
      'accept': '*/*',
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'Mozilla/5.0'
    };
    const البيانات = new URLSearchParams({ lang: "ar-SA", text: النص, voiceId: الصوت_المختار.id }).toString();

    let المحاولة = 0;
    while (المحاولة < 2) { // المحاولة مرتين
      try {
        const الرد = await axios.post(الرابط, البيانات, { 
          headers: الرؤوس, 
          responseType: 'json', 
          timeout: 120000 // مهلة الطلب 120 ثانية
        });

        if (الرد.status === 200) {
          const base64 = الرد.data.base64Audio.split(';base64,')[1];
          return { الحالة: الرد.status, الملف: Buffer.from(base64, 'base64') };
        }
      } catch (error) {
        if (المحاولة === 0) { // إذا فشلت المحاولة الأولى، انتظر 5 ثوانٍ ثم أعد المحاولة
          console.log("🧞 المحاولة الأولى فشلت، إعادة المحاولة بعد 5 ثوانٍ...");
          await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
          throw error; // بعد المحاولة الثانية، لا تكرر المحاولة
        }
      }
      المحاولة++;
    }
  } catch (error) {
    return { الحالة: error.response?.status || 500, الخطأ: error.message };
  }
}

const معالج = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply(
      `🧞 *تحويل النص إلى صوت*\n\n` +
      `🔹 *طريقة الاستخدام:*\n` +
      `✦ ${usedPrefix + command} [رقم الصوت] [النص]\n\n` +
      `📝 *مثال:*\n` +
      `✦ ${usedPrefix + command} 1 مرحبًا بك في بوت فيتو\n\n` +
      `🎙 *الأصوات المتاحة:* \n${الأصوات.map((v, i) => `${i + 1}`).join(", ")}\n\n` +
      `🆅🅸🆃🅾 🅱🅾🆃🧞`
    );
  }

  let [رقم_الصوت, ...النص] = text.split(' ');
  رقم_الصوت = parseInt(رقم_الصوت);
  const النص_النهائي = النص.join(' ');

  m.react('⌛');

  try {
    const النتيجة = await تحويل_النص_إلى_صوت(النص_النهائي, رقم_الصوت);

    if (النتيجة.الحالة !== 200) {
      return m.reply(`🧞 *فشل تحويل النص إلى صوت!* الخطأ: ${النتيجة.الخطأ || "حدث خطأ."}`);
    }

    const مسار_الصوت = join(__dirname, '../tmp', `wavel_${Date.now()}.mp3`);
    fs.writeFileSync(مسار_الصوت, النتيجة.الملف);

    await conn.sendMessage(m.chat, {
      audio: { url: مسار_الصوت },
      mimetype: 'audio/mp4',
      ptt: true,
      fileName: 'wavel_tts.mp3'
    }, { quoted: m });

    m.react('✅');

  } catch (error) {
    console.error(error);
    m.reply(`🧞 *حدث خطأ!* ${error.message || "فشل تحويل النص إلى صوت."}`);
  }
};

معالج.help = ['انطق2'];
معالج.tags = ['أدوات'];
معالج.command = /^(انطق2)$/i;

export default معالج;