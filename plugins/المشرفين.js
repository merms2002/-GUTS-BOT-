let handler = async (m, { conn, participants }) => {
    try {
        // التحقق مما إذا كانت الرسالة داخل مجموعة
        if (!m.chat.endsWith('@g.us')) {
            return m.reply('*هذا الأمر يمكن استخدامه فقط داخل المجموعات!*');
        }

        // استرداد بيانات المجموعة
        const groupMetadata = await conn.groupMetadata(m.chat);
        const admins = groupMetadata.participants
            .filter((participant) => participant.admin === 'admin' || participant.admin === 'superadmin') // اختيار المشرفين فقط
            .map((participant) => participant.id.replace(/@.+/, '')); // استخراج الأرقام فقط

        // بناء رسالة تحتوي على قائمة المشرفين
        let adminListMessage = '*قائمة مشرفين المجموعة:*\n\n';
        if (admins.length > 0) {
            admins.forEach((admin, index) => {
                adminListMessage += `*${index + 1}.* @${admin}\n`;
            });
        } else {
            adminListMessage += '*لا يوجد مشرفون في هذه المجموعة!*';
        }

        // إرسال الرسالة مع منشن للمشرفين
        await conn.sendMessage(
            m.chat,
            {
                text: adminListMessage,
                contextInfo: {
                    mentionedJid: admins.map((admin) => admin + '@s.whatsapp.net'), // إضافة @s.whatsapp.net للمنشن
                },
            },
            { quoted: m }
        );
    } catch (error) {
        console.error('خطأ أثناء جلب قائمة المشرفين:', error);
        m.reply('*حدث خطأ أثناء جلب قائمة المشرفين!*');
    }
};

// تعريفات الأمر
handler.help = ['مشرفين'];
handler.tags = ['group'];
handler.command = ['مشرفين', 'ادمنية']; // الكلمات التي ستقوم بتفعيل الأمر
handler.group = true; // يعمل فقط في المجموعات
export default handler;