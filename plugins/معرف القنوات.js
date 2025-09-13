let handler = async (m, { conn, args, command }) => {
    if (!args[0]) return m.reply("⚠️ *الرجاء إدخال رابط القناة بشكل صحيح!*\nاستخدم: `.قناتو <رابط_القناة>`");

    let match = args[0].match(/whatsapp\.com\/channel\/([\w-]+)/);
    if (!match) return m.reply("⚠️ *حدث خطأ! تأكد من صحة الرابط.*");

    let inviteId = match[1];

    try {
        let metadata = await conn.newsletterMetadata("invite", inviteId);
        if (!metadata || !metadata.id) return m.reply("⚠️ *فشل في الحصول على بيانات القناة. تأكد من الرابط أو حاول لاحقًا.*");

        // تنسيق التاريخ باستخدام دالة formatDate
        const formatDate = (t) => {
            if (!t) return 'غير معروف';
            try {
                const adjusted = t < 1e12 ? t * 1000 : t;
                return new Date(adjusted).toLocaleString('ar-EG', {
                    timeZone: 'Africa/Cairo',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                });
            } catch {
                return 'تاريخ غير صالح';
            }
        };

        let info = [];
        info.push(`📛 الاسم: ${metadata.name || 'بدون اسم'}`);
        info.push(`⏳ آخر تحديث للاسم: ${formatDate(metadata.nameTime)}`);
        info.push(`🌀 اليوزر: ${metadata.handle ? '@' + metadata.handle : 'غير متاح'}`);
        info.push(`🆔 المعرف: ${metadata.id}`);
        info.push(`👥 المتابعون: ${(metadata.subscribers || 0).toLocaleString('ar')}`);
        info.push(`📅 التأسيس: ${formatDate(metadata.creation_time)}`);
        info.push(`✅ التحقق: ${metadata.verification === "VERIFIED" ? 'موثقة' : 'لا'}`);
        info.push(`🚦 الحالة: ${metadata.state ? 'نشطة' : 'مغلقة'}`);
        info.push(`📝 الوصف: ${metadata.description || 'لا يوجد وصف'}`);
        info.push(`⏳ آخر تحديث للوصف: ${formatDate(metadata.descriptionTime)}`);

        if (metadata.viewer_metadata) {
            const vm = metadata.viewer_metadata;
            info.push(`🔇 الكتم: ${vm.mute ? 'مفعّل' : 'غير مفعّل'}`);
            info.push(`📡 المتابعة: ${vm.follow_state === 'FOLLOWING' ? 'متابع' : 'غير متابع'}`);
        }

        // تجميع المعلومات في الرسالة النهائية
        let caption = `*— 乂 معلومات القناة —*\n\n` + info.join('\n');

        // إذا كان هناك صورة للقناة (Preview)
        if (metadata.preview) {
            await conn.sendMessage(m.chat, { 
                image: { url: "https://pps.whatsapp.net" + metadata.preview }, 
                caption 
            });
        } else {
            m.reply(caption);
        }
    } catch (error) {
        console.error("حدث خطأ:", error);
        m.reply("❌ حدث خطأ غير متوقع! ربما الرابط غير صحيح أو يوجد خطأ في البيانات.");
    }
};

handler.help = ["قناتو", "cinfo", "channelinfo", "ci"];
handler.tags = ["info"];
handler.command = ["قناتو", "cinfo", "channelinfo", "ci"];

export default handler;