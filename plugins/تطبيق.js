import axios from 'axios';
import baileys from '@whiskeysockets/baileys';

const { proto, generateWAMessageFromContent, prepareWAMessageMedia } = baileys;

async function response(jid, data, quoted) {
    let msg = generateWAMessageFromContent(jid, {
        viewOnceMessage: {
            message: {
                "messageContextInfo": { "deviceListMetadata": {}, "deviceListMetadataVersion": 2 },
                interactiveMessage: proto.Message.InteractiveMessage.create({
                    body: proto.Message.InteractiveMessage.Body.create({ text: data.body }),
                    footer: proto.Message.InteractiveMessage.Footer.create({ text: data.footer }),
                    header: proto.Message.InteractiveMessage.Header.create({
                        title: data.title,
                        subtitle: data.subtitle,
                        hasMediaAttachment: data.media ? true : false,
                        ...(data.media ? await prepareWAMessageMedia(data.media, { upload: conn.waUploadToServer }) : {})
                    }),
                    nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons: data.buttons })
                })
            }
        }
    }, { quoted });

    await conn.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id });
}

let handler = async (m, { conn, command, usedPrefix, text }) => {
    if (command === "تطبيق") {
        if (!text) throw `📝 *اكتب اسم اللعبة أو التطبيق الذي تريد البحث عنه*:\n\nمثال: ${usedPrefix + command} WhatsApp Messenger`;

        try {
            const { data } = await axios.get(`https://takamura-api.joanimi-world.site/api/download/aptoide?q=${encodeURIComponent(text)}`);
            if (!data.results.length) throw `❌ لم يتم العثور على أي نتائج تحت الاسم: "${text}".`;

            let buttons = data.results.map(app => ({
                name: 'quick_reply',
                buttonParamsJson: JSON.stringify({
                    display_text: `${app.name} | 📂 الحجم: ${app.size}`,
                    id: `.تطبيقتنزيل ${app.packageId}`
                })
            }));

            const listMessage = {
                body: `🔎 *نتائج البحث عن* "${text}":\n🔽 اختر تطبيقًا ليتم تحميله مباشرةً.`,
                footer: 'تحميل التطبيقات من Aptoide',
                buttons
            };

            await response(m.chat, listMessage, m);
        } catch (error) {
            if (error.response?.status === 504) {
                await conn.sendMessage(m.chat, { text: "⚠️ *الخادم لم يستجب في الوقت المحدد.*\n🔄 الرجاء إعادة المحاولة بعد قليل." }, { quoted: m });
            } else {
                throw `❌ حدث خطأ أثناء البحث عن التطبيق.`;
            }
        }
    } else if (command === "تطبيقتنزيل") {
        if (!text) throw `❓ *طريقة الاستخدام*:\n${usedPrefix + command} <packageId>`;

        try {
            const { data } = await axios.get(`https://takamura-api.joanimi-world.site/api/download/aptoide?q=${encodeURIComponent(text)}`);
            const app = data.results.find(a => a.packageId === text);
            if (!app) throw `❌ التطبيق غير موجود!`;

            // تحويل الحجم إلى رقم بالمجابايت للتحقق من كبر الحجم
            const sizeInMB = parseFloat(app.size.replace(/[^0-9.]/g, ''));

            if (sizeInMB > 2048) { // إذا كان الحجم أكبر من 2 جيجا، يرسل الرابط بدلاً من الملف نفسه
                await conn.sendMessage(m.chat, {
                    text: `🚀 *التطبيق كبير جدًا (> 2GB)، قم بتنزيله يدويًا عبر الرابط التالي:*\n\n📦 *${app.name}*\n🔗 ${app.dllink}`,
                    contextInfo: { mentionedJid: [m.sender] }
                }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, {
                    document: { url: app.dllink },
                    mimetype: 'application/vnd.android.package-archive',
                    fileName: `${app.name}.apk`,
                    caption: `✅ *تم تحميل التطبيق بنجاح!*\n📦 *${app.name}*`,
                    contextInfo: { mentionedJid: [m.sender] }
                }, { quoted: m });
            }
        } catch (error) {
            if (error.response?.status === 504) {
                await conn.sendMessage(m.chat, { text: "⚠️ *الخادم لم يستجب في الوقت المحدد.*\n🔄 الرجاء إعادة المحاولة بعد قليل." }, { quoted: m });
            } else {
                throw `❌ حدث خطأ أثناء تحميل التطبيق.`;
            }
        }
    }
};

handler.command = ["تطبيق", "تطبيقتنزيل"];
handler.help = ["تطبيق"];
handler.tags = ["downloader"];
handler.limit = true;

export default handler;