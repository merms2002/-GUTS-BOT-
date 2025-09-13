import { webp2png } from '../lib/webp2mp4.js';
import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';
import axios from 'axios';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OWNER1 = "966578486098@s.whatsapp.net";
const ACTIVE_CONVERSATIONS = {};
const MAX_VIDEO_SIZE_MB = 60; // الحد الأقصى لحجم الفيديو 60 ميجابايت

let handler = async (m, { conn, text, args, command, usedPrefix }) => {
    let media = false;
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    let url = '';

    if (/image|video|audio/.test(mime)) {
        media = await q.download();

        if (/video/.test(mime)) {
            let videoPath = join(__dirname, `./temp_video_${new Date().getTime()}.mp4`);
            fs.writeFileSync(videoPath, media);

            let videoStats = fs.statSync(videoPath);
            let videoSizeMB = videoStats.size / (1024 * 1024);
            if (videoSizeMB > MAX_VIDEO_SIZE_MB) {
                fs.unlinkSync(videoPath);
                return m.reply(`⚠️ *حجم الفيديو يتجاوز الحد المسموح به (الحد الأقصى 60 ميجابايت). الرجاء تقليل حجمه أو إرساله بجودة أقل.*`);
            }
            url = videoPath;
        } else {
            url = await uploadImage(media);
        }
    } else if (/webp/.test(mime)) {
        media = await q.download();
        url = await webp2png(media);
    }

    let activeConversation = Object.entries(ACTIVE_CONVERSATIONS).find(([id, convo]) => convo.active && convo.userId === m.sender && convo.chatId === m.chat);

    if (activeConversation) {
        let [reportId] = activeConversation;
        let message = `📩 *رسالة من المستخدم @${m.sender.split("@")[0]} (رقم التقرير: ${reportId}):*\n${text || ''}`;

        if (url) {
            if (/image/.test(mime)) {
                await conn.sendMessage(OWNER1, { image: { url }, caption: message, contextInfo: { mentionedJid: [m.sender] } }, { quoted: m });
            } else if (/video/.test(mime)) {
                await conn.sendMessage(OWNER1, { video: { url }, caption: message, contextInfo: { mentionedJid: [m.sender] } }, { quoted: m });
            } else if (/audio/.test(mime)) {
                await conn.sendMessage(OWNER1, { audio: { url }, mimetype: mime, caption: message, contextInfo: { mentionedJid: [m.sender] } }, { quoted: m });
            }
        } else if (m.msg && m.msg.sticker) {
            await conn.sendMessage(OWNER1, { sticker: media, contextInfo: { mentionedJid: [m.sender] } }, { quoted: m });
        } else {
            await conn.sendMessage(OWNER1, { text: message, mentions: [m.sender] }, { quoted: m });
        }
        return;
    }

    if (command === 'report' || command === 'reporte') {
        if (!text && !m.quoted) return m.reply(`⚠️ *يرجى كتابة الخطأ أو المشكلة التي تواجهها*\n\n*مثال:* ${usedPrefix + command} المشكلة في الملصقات`);
        if (text.length < 8) throw `⚠️ *يجب أن يكون التقرير مكونًا من 10 أحرف على الأقل.*`;
        if (text.length > 1000) throw `⚠️ *يمكنك كتابة تقرير بحد أقصى 1000 حرف فقط.*`;

        let reportId = Math.floor(Math.random() * 901);

        ACTIVE_CONVERSATIONS[reportId] = {
            userId: m.sender,
            userName: m.pushName || 'مستخدم مجهول',
            active: true,
            chatId: m.chat,
            url: url,
            mime: mime,
        };

        let reportText = text || (m.quoted && m.quoted.text) || 'لا توجد رسالة';
        let teks = `┏━━━━━━━━━━━📩 *التقرير* 📩━━━━━━━━━━━┓
╏• *رقم المستخدم:* Wa.me/${m.sender.split("@")[0]}
╏• *المشكلة:* ${reportText}
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ *رد على هذه الرسالة بـ:*
*"رد ${reportId} [الرسالة]"* للتواصل مع المستخدم.
استخدم *.انهاء ${reportId}* لإنهاء المحادثة.`;

        await conn.sendMessage(OWNER1, { text: teks, mentions: [m.sender] }, { quoted: m });
        await delay(1000);
        await conn.reply(m.chat, `✅ *تم إرسال التقرير إلى المطور، سيتم الرد عليك قريبًا. في حال كان التقرير غير صحيح، سيتم تجاهله.*`, m);
        return;
    }
};

handler.help = ['reporte', 'request'].map(v => v + ' <النص>');
handler.tags = ['main'];
handler.exp = 3500;
handler.command = /^(report|request|reporte|bugs|bug|report-owner|ابلاغ|reportar)$/i;
handler.private = true;
export default handler;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
