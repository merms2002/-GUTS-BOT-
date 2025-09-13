import fetch from 'node-fetch';
import yts from 'yt-search';

let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, `  
⊱⊹•─๋︩︪╾─•┈⧽ 🚨 ⧼┈•─╼─๋︩︪•⊹⊰  
⚠️ يَجِبُ كِتَابَةُ اِسْمِ الأُغْنِيَةِ لِمُتَابَعَةِ التَّحْمِيلِ  
⊱⊹•─๋︩︪╾─•┈⧽ 🚨 ⧼┈•─╼─๋︩︪•⊹⊰  
`, m);

    try {
        await m.react('⏳');

        // البحث عن الفيديو
        let searchResults = await yts(text);
        if (!searchResults.videos.length) {
            return conn.reply(m.chat, `  
⊱⊹•─๋︩︪╾─•┈⧽ ⚠️ ⧼┈•─╼─๋︩︪•⊹⊰  
❌ لَمْ يَتِمُّ الْعُثُورُ عَلَى نَتَائِج، جَرِّبْ اِسْمًا آخَرَ  
⊱⊹•─๋︩︪╾─•┈⧽ ⚠️ ⧼┈•─╼─๋︩︪•⊹⊰  
`, m);
        }

        let video = searchResults.videos[0]; // أخذ أول نتيجة
        let videoUrl = video.url;

        // إرسال معلومات الفيديو
        let caption = `  
⊱⊹•─๋︩︪╾─•┈⧽ 🎵 ⧼┈•─╼─๋︩︪•⊹⊰  
📌 العنوان: ${video.title}  
⏳ المدة: ${video.timestamp}  
👁 المشاهدات: ${video.views.toLocaleString()}  
🔗 الرابط: ${videoUrl}  
⊱⊹•─๋︩︪╾─•┈⧽ 🎵 ⧼┈•─╼─๋︩︪•⊹⊰  
`;

        await conn.sendMessage(m.chat, { 
            image: { url: video.thumbnail },
            caption 
        });

        await m.react('🎵');

        // استخدام API للحصول على رابط الصوت
        const apiUrl = `https://bk9.fun/download/ytmp3?url=${encodeURIComponent(videoUrl)}&type=mp3`;
        const response = await fetch(apiUrl);

        let result;
        try {
            result = await response.json(); // محاولة تحليل JSON
        } catch (jsonError) {
            let errorText = await response.text(); // إذا فشل التحليل، جلب النص الخام
            throw new Error(`❌ خَطَأ فِي API:\n${errorText}`);
        }

        // طباعة استجابة API لمعرفة أي مشاكل
        console.log('🔍 استجابة API:', JSON.stringify(result, null, 2));

        // التحقق من نجاح العملية
        if (!result.status || !result.BK9 || !result.BK9.downloadUrl) {
            throw new Error(`❌ لَمْ يَتِمَّ الْعُثُورُ عَلَى رَابِطِ تَحْمِيلِ الصَّوْتِ.\n🔍 استجابة API: ${JSON.stringify(result, null, 2)}`);
        }

        const audioUrl = result.BK9.downloadUrl;
        let user = m.sender;

        await conn.sendMessage(m.chat, {
            audio: { url: audioUrl },
            contextInfo: {
                mentionedJid: [user],
                "externalAdReply": {
                    "thumbnail": null,
                    "title": "✔ تَمَّ التَّحْمِيلُ بِنَجَاحٍ",
                    "body": "✦ 𝙆𝙍𝙀𝙎 𝑩𝑶𝑻 ✦",
                    "previewType": "PHOTO",
                    "thumbnailUrl": null,
                    "showAdAttribution": true,
                    sourceUrl: videoUrl
                }
            },
            ptt: false, // إرسال كمقطع صوتي وليس رسالة صوتية
            mimetype: 'audio/mpeg',
            fileName: `${video.title}.mp3`
        });

        await m.react('✅');

    } catch (error) {
        console.error(error);
        await m.react('❌');
        m.reply(`  
⊱⊹•─๋︩︪╾─•┈⧽ ❌ ⧼┈•─╼─๋︩︪•⊹⊰  
⚠️ حَدَثَ خَطَأ، حَاوِلْ مَرَّةً أُخْرَى  
⊱⊹•─๋︩︪╾─•┈⧽ ❌ ⧼┈•─╼─๋︩︪•⊹⊰  
`);
    }
};

handler.tags = ['ميكو'];
handler.help = ['اغنيه'];
handler.command = ['شغل'];

export default handler;