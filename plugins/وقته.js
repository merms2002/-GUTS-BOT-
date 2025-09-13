let handler = async (m, { conn, usedPrefix, command, args }) => {
    // تعريف الأرقام المصرح لها
    const authorizedNumbers = [
        ...global.eliteNumbers.map(num => `${num}@s.whatsapp.net`),
        conn.user.jid
    ];

    // التحقق من صلاحية المرسل
    if (!authorizedNumbers.includes(m.sender)) {
        return m.reply('*ما معك صلاحية دز فقط عمي جليتش واتباعه يقدرون*');
    }

    // التحقق من أن المرسل مشرف في المجموعة
    if (!m.isGroup) return m.reply('*هذا الأمر يعمل فقط في المجموعات!*');
    const groupMetadata = await conn.groupMetadata(m.chat);
    const isAdmin = groupMetadata.participants.find(p => p.id === m.sender)?.admin || false;
    if (!isAdmin) return m.reply('*هذا الأمر متاح فقط للمشرفين! 🚫*');

    // التحقق من وجود منشن أو رسالة مقتبسة
    if (!m.mentionedJid[0] && !m.quoted) return m.reply('*منشن الشخص اللي عاوز تطرده 🤷🏻‍♂️*');

    // تحديد المستخدم المطلوب طرده
    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender;

    // استخراج الوقت من الأمر (مثال: .وقته 5)
    let timeMatch = command.match(/\d+/);
    if (!timeMatch) return m.reply('*الرجاء تحديد الوقت بالأرقام!*');
    let time = parseInt(timeMatch[0]);
    if (isNaN(time) || time <= 0) return m.reply('*الرجاء تحديد وقت صحيح بالأرقام!*');

    // تحويل الوقت من دقائق إلى مللي ثانية
    let delay = time * 60 * 1000;

    // إرسال رسالة تأكيد
    await m.reply(`*جاري توقيت @${user.split('@')[0]} ل ${time} دقائق ⏳*`, null, { mentions: [user] });

    // تأخير عملية الطرد
    setTimeout(async () => {
        try {
            await conn.groupParticipantsUpdate(m.chat, [user], 'remove');
            await m.reply(`*تم طرد @${user.split('@')[0]} من المجموعة بعد ${time} دقائق 🚫*`, null, { mentions: [user] });
        } catch (error) {
            console.error('حدث خطأ أثناء محاولة الطرد:', error);
            await m.reply('*حدث خطأ أثناء محاولة طرد المستخدم!*');
        }
    }, delay);
};

// تعريفات الأمر
handler.help = ['kick @user'];
handler.tags = ['group'];
handler.command = /^وقته(\d+)$/i; // الأمر الآن يقبل الأرقام بعد "وقته"
handler.admin = true; // الأمر متاح فقط للمشرفين
handler.group = true; // الأمر يعمل فقط في المجموعات
handler.botAdmin = true; // البوت يجب أن يكون مشرفًا

export default handler;