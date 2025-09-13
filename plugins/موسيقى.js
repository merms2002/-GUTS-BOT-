/*
YouTube Music Play 🧞
تشغيل أغاني اليوتيوب 🧞
*/

import yts from 'yt-search';
import axios from 'axios';

var handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `🧞 ❎ يرجى إدخال اسم الأغنية!\n\n🧞 مثال على الاستخدام:\n*${usedPrefix + command} Cloud Trails Airplane*`;

    // إرسال رد فعل "🕒" عند بدء التنفيذ
    conn.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    let res = await yts(text);
    let vid = res.videos[0];

    try {
        const data = (await axios.get(`https://rayhanzuck-yt.hf.space/?url=${vid.url}&format=mp3&quality=128`)).data;
        if (!data.media) throw '🧞 ❎ حدث خطأ في API.';

        await conn.sendMessage(m.chat, {
            audio: { url: data.media },
            mimetype: 'audio/mpeg',
            contextInfo: {
                externalAdReply: {
                    title: vid.title,
                    body: data.author.name,
                    mediaType: 2,
                    mediaUrl: vid.url,
                    thumbnailUrl: vid.thumbnail,
                    sourceUrl: vid.url,
                    containsAutoReply: true,
                    renderLargerThumbnail: true,
                    showAdAttribution: false,
                }
            }
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        await m.react('❌');
        throw `🧞 ❎ لم يتم التحميل، يرجى المحاولة مرة أخرى.\nالخطأ: ${e.message}`;
    }
};

handler.before = async (m, { command, usedPrefix }) => {
    if (!m.text) {
        let example = `${usedPrefix + command} Cloud Trails Airplane`;
        let msg = `🧞 طريقة الاستخدام:\nاكتب الأمر متبوعًا باسم الأغنية التي تريدها.\n\n🧞 مثال:\n*${example}*\n\n🆅🅸🆃🅾 🅱🅾🆃🧞`;
        throw msg;
    }
};

handler.help = ['موسيقى'];
handler.command = /^موسيقى$/i;
handler.tags = ['downloader'];
handler.limit = true;

export default handler;