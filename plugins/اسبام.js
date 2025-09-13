let handler = async (m, { conn, text }) => {
    // تحديد الأرقام المصرح لها باستخدام الأمر (بما في ذلك رقم البوت)
    const authorizedNumbers = [
        ...global.eliteNumbers.map(num => `${num}@s.whatsapp.net`),
        conn.user.jid
    ];

    // التحقق من صلاحية المرسل
    if (!authorizedNumbers.includes(m.sender)) {
        return m.reply('*ما معك صلاحية دز فقط عمي يوهان واتباعه يقدرون*');
    }

    // تقسيم النص المدخل
    let args = text.split(' ').map(v => v.trim());
    let target = args[0]; // الرقم أو الرابط
    let count = parseInt(args[1]); // عدد الرسائل

    // التحقق من المدخلات
    if (!target || isNaN(count) || count <= 0) {
        return m.reply('*صيغة الأمر غير صحيحة. الصيغة: بانكاي <الرقم أو رابط الجروب> <عدد الرسائل>*');
    }

    // رسالة السبام
    const spamMessage = `*رسالة سبام!*`;

    // إرسال الرسائل بعدد معين
    try {
        for (let i = 0; i < count; i++) {
            await conn.sendMessage(target + '@s.whatsapp.net', { text: spamMessage });
        }
        await m.reply(`*تم إرسال ${count} رسالة بنجاح إلى ${target}!*`);
    } catch (error) {
        console.error(error);
        await m.reply('*حدث خطأ أثناء إرسال الرسائل!*');
    }
};

// تعريفات الأمر
handler.help = ['بانكاي'];
handler.tags = ['tools'];
handler.command = ['بانكاي']; // الكلمة التي ستقوم بتفعيل الأمر
handler.rowner = true; // فقط المطور أو الأرقام المصرح لها يمكنها استخدام الأمر
export default handler;