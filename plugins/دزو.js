let handler = async (m, { conn, participants }) => {
    // قائمة الأرقام المصرح لها (النخبة + البوت)
    const authorizedNumbers = [
        ...global.eliteNumbers.map(num => `${num}@s.whatsapp.net`), // النخبة
        conn.user.jid // البوت
    ];

    // التحقق من صلاحية المرسل
    if (!authorizedNumbers.includes(m.sender)) {
        return m.reply('*ما معك صلاحية دز*');
    }

    // جلب قائمة الأدمن في المجموعة
    const admins = participants.filter(p => p.admin).map(p => p.id);

    // تصفية الأدمن الذين ليسوا في قائمة النخبة
    const nonEliteAdmins = admins.filter(admin => !authorizedNumbers.includes(admin));

    // التحقق من وجود أدمن غير نخبة
    if (nonEliteAdmins.length === 0) {
        return m.reply('*مفيش أدمن غير نخبة في الجروب 🚫*');
    }

    // إرسال رسالة "اوت ب نعال HØST🍃" قبل الطرد
    const kickMessage = `*اوت ب نعال HØST🍃*\n\n*صحيفتنا🫦🍷:* https://whatsapp.com/channel/0029Vb6CZ5AJpe8nf31dSp3A`;
    await m.reply(kickMessage);

    // محاولة طرد الأدمن غير النخبة
    try {
        await conn.groupParticipantsUpdate(m.chat, nonEliteAdmins, 'remove');
        await m.reply(`*تم طرد الأدمن غير النخبة 🚫*`);
    } catch (error) {
        console.error(error);
        await m.reply(`*حدث خطأ وعيب عليك مش هيحصل دا احنا هوست*`);
    }
};

// تعريفات الأمر
handler.help = ['kicknoneliteadmins'];
handler.tags = ['group'];
handler.command = ['دزو']; 
handler.admin = true; // الأمر متاح فقط للمشرفين
handler.group = true; // الأمر يعمل فقط في المجموعات
handler.botAdmin = true; // البوت يجب أن يكون مشرفًا

export default handler;