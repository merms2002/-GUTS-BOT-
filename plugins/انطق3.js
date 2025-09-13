import fetch from 'node-fetch';
import translate from '@vitalets/google-translate-api';

const characters = {
    "1": "momoi",
    "2": "arona",
    "3": "hibiki",
    "4": "shiroko"
};

async function getTTSBA(text, char, speed = 1) {
    try {
        const url = `https://api.hiuraa.my.id/tools/ttsba?text=${encodeURIComponent(text)}&char=${char}&speed=${speed}`;
        console.log("🔍 اختبار API مع الشخصية:", char, "🔗 الرابط:", url); // للتحقق مما يتم إرساله

        const res = await fetch(url);
        if (!res.ok) throw new Error('❌ فشل في الحصول على الصوت 🧞');

        return await res.arrayBuffer();
    } catch (err) {
        console.error(err);
        return null;
    }
}

const handler = async (m, { conn, args, command }) => {
    if (args.length < 2) {
        return m.reply(`❌ *استخدام غير صحيح للأمر "${command}"* 🧞\n\n📌 *مثال الاستخدام:*\n.انطق3 1 مرحبًا فيتو بوت\n\n🔢 *الشخصيات المتاحة:* \n1 - Momoi 🧞\n2 - Arona 🧞\n3 - Hibiki 🧞\n4 - Shiroko 🧞\n\n🆅🅸🆃🅾 🅱🅾🆃🧞`);
    }

    let charNumber = args.shift();  
    let text = args.join(' ');

    if (!characters[charNumber]) {
        return m.reply(`❌ *الشخصية غير صحيحة!* 🧞\n\n🔢 *الشخصيات المتاحة:* \n1 - Momoi 🧞\n2 - Arona 🧞\n3 - Hibiki 🧞\n4 - Shiroko 🧞\n\n🆅🅸🆃🅾 🅱🅾🆃🧞`);
    }

    let char = characters[charNumber];

    try {
        const translated = await translate(text, { to: 'ja' });
        const translatedText = translated.text;

        const audioBuffer = await getTTSBA(translatedText, char);
        if (!audioBuffer) return m.reply(`❌ *فشل في إنشاء الصوت!* 🧞\n🚨 *قد تكون الشخصية (${char}) غير مدعومة في API*.\n🆅🅸🆃🅾 🅱🅾🆃🧞`);

        await conn.sendMessage(m.chat, { 
            audio: Buffer.from(audioBuffer), 
            mimetype: 'audio/mp4', 
            ptt: true 
        }, { quoted: m });

        await m.reply(`✅ *تم إنشاء الصوت بنجاح!* 🧞\n🎙️ *الشخصية:* ${char} \n📢 *النص:* ${text}\n🆅🅸🆃🅾 🅱🅾🆃🧞`);
    } catch (err) {
        console.error(err);
        return m.reply('❌ *حدث خطأ أثناء إنشاء الصوت!* 🧞\n🆅🅸🆃🅾 🅱🅾🆃🧞');
    }
};

handler.help = ['انطق3', 'speak3'];
handler.tags = ['tools'];
handler.command = ['انطق3', 'speak3'];

export default handler;