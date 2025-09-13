import fetch from 'node-fetch';
import yts from 'yt-search';

const handler = async (m, { command, usedPrefix, conn, args, text }) => {
    if (!text) {
        await conn.sendMessage(m.chat, { 
            text: `❌ *يرجى إدخال نص أو رابط فيديو للبحث.*\n\n` +
                  `📌 *مثال:*\n` +
                  `🔹 \`${usedPrefix + command} القرآن الكريم\`\n` +
                  `🔹 \`${usedPrefix + command} https://youtu.be/JLWRZ8eWyZo\``,
            contextInfo: { forwardingScore: 999, isForwarded: true }
        }, { quoted: m });
        return;
    }

    await conn.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    try {
        const yt_play = await search(args.join(' '));
        if (!yt_play.length) throw new Error("❌ *لم يتم العثور على نتائج.*");

        const video = yt_play[0];

        let message = `🎬 *معلومات الفيديو:*\n\n` +
                      `📌 *العنوان:* ${video.title}\n` +
                      `⏳ *المدة:* ${formatDuration(video.duration.seconds)}\n` +
                      `🔗 *الرابط:* ${video.url}\n\n` +
                      `⏳ *جاري تحميل الفيديو بجودة 360p...*`;

        // إرسال صورة الفيديو مع التفاصيل
        await conn.sendMessage(m.chat, { 
            image: { url: video.thumbnail }, 
            caption: message 
        }, { quoted: m });

        try {
            const videoUrl = await getDirectVideoUrl(video.url);

            if (!videoUrl) throw new Error("⚠️ *لم يتم العثور على رابط تحميل بجودة 360p.*");

            await conn.sendMessage(m.chat, { react: { text: '✔️', key: m.key } });
            await conn.sendMessage(m.chat, { 
                video: { url: videoUrl }, 
                fileName: `${video.title}.mp4`, 
                mimetype: 'video/mp4', 
                caption: `✅ *تم التحميل بنجاح!*\n📌 *العنوان:* ${video.title}\n🎥 *استمتع بالمشاهدة!*`
            }, { quoted: m });

        } catch (error) {
            await conn.reply(m.chat, `❌ *خطأ أثناء تحميل الفيديو:* ${error.message}`, m);
        }

    } catch (error) {
        await conn.sendMessage(m.chat, { 
            text: `❌ *حدث خطأ أثناء البحث عن الفيديو.*\n\n` +
                  `📌 *تأكد من إدخال نص صحيح أو رابط فيديو يوتيوب.*\n\n` +
                  `🔹 \`${usedPrefix + command} القرآن الكريم\`\n` +
                  `🔹 \`${usedPrefix + command} https://youtu.be/JLWRZ8eWyZo\``, 
            contextInfo: { forwardingScore: 999, isForwarded: true }
        }, { quoted: m });
    }
};

handler.command = /^(فيد)$/i;
export default handler;

// 🔎 البحث في يوتيوب
async function search(query) {
    const search = await yts.search(query);
    return search.videos;
}

// 📌 جلب رابط الفيديو بجودة 360p
async function getDirectVideoUrl(url) {
    try {
        const apiUrl = `https://bk9.fun/download/youtube?url=${encodeURIComponent(url)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data.status || !data.BK9 || !data.BK9.BK8) {
            throw new Error("❌ *لم يتم العثور على بيانات الفيديو.*");
        }

        // البحث عن الجودة 360p
        const videoData = data.BK9.BK8.find(v => v.quality === "360p");
        
        if (!videoData || !videoData.link) {
            throw new Error("⚠️ *لم يتم العثور على رابط تحميل بجودة 360p.*");
        }

        return videoData.link;
    } catch (error) {
        throw new Error("⚠️ *فشل الاتصال بـ API التحميل.*");
    }
}

// ⏳ تحويل الثواني إلى صيغة مفهومة
function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} دقيقة و ${s} ثانية`;
}
