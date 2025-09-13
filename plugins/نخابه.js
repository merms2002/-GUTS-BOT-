//الامر تزبط؟ 
let eliteNumbers = [
    '966577085828@whatsapp.net', // GLITCH
    '966577085828@whatsapp.net', // madara
    '966577085828@whatsapp.net', // yuzu
    '966577085828@whatsapp.net', // ss 
    '966577085828@whatsapp.net', // bot
];

let handler = async (conn, update) => {
    try {
        let { id, participants, action, by } = update;
        console.log("📩 حدث جديد في الجروب:", update); // طباعة بيانات الحدث بالكامل

        if (!id || !action || !by || !participants || !Array.isArray(participants)) {
            console.log("⚠️ البيانات غير مكتملة، لم يتم تنفيذ أي شيء.");
            return;
        }

        console.log("🔍 تم استدعاء كود الحماية.");
        
        let groupMeta;
        try {
            groupMeta = await conn.groupMetadata(id);
            console.log("📊 بيانات الجروب:", groupMeta);
        } catch (err) {
            console.log("❌ فشل في جلب بيانات الجروب:", err);
            return;
        }

        let botAdmin = groupMeta.participants.find(p => p.id === conn.user.jid)?.admin;
        console.log(`🤖 هل البوت أدمن؟ ${botAdmin ? "نعم" : "لا"}`);

        // تجربة: حذف شرط الأدمن مؤقتًا
        // if (!botAdmin) return console.log("⚠️ البوت ليس أدمن، لا يمكن تنفيذ العمليات.");

        for (let user of participants) {
            console.log(`👤 المستخدم المستهدف: ${user}`);
            
            if (eliteNumbers.includes(user)) {
                console.log(`✅ المستخدم ${user} موجود في قائمة النخبة.`);
                
                if (action === 'demote') {
                    console.log(`🔺 محاولة إعادة ترقية ${user}`);
                    try {
                        if (!eliteNumbers.includes(by)) {
                            await conn.groupParticipantsUpdate(id, [by], 'demote');
                            console.log(`🚨 تم إعفاء ${by} لأنه عفى ${user}.`);
                        }
                        await conn.groupParticipantsUpdate(id, [user], 'promote');
                        console.log(`✅ تم إعادة ${user} للأدمنية.`);
                    } catch (err) {
                        console.log(`❌ خطأ أثناء محاولة إعادة ${user} كأدمن:`, err);
                    }
                }

                if (action === 'remove') {
                    console.log(`🚷 محاولة إعادة ${user} إلى الجروب`);
                    try {
                        if (!eliteNumbers.includes(by)) {
                            await conn.groupParticipantsUpdate(id, [by], 'remove');
                            console.log(`🚨 تم طرد ${by} لأنه طرد ${user}.`);
                        }
                        await conn.groupParticipantsUpdate(id, [user], 'add');
                        console.log(`✅ تم إعادة ${user} للجروب.`);
                    } catch (err) {
                        console.log(`❌ خطأ أثناء محاولة إعادة ${user} للجروب:`, err);
                    }
                }
            } else {
                console.log(`❌ ${user} ليس من النخبة، لا يوجد إجراء.`);
            }
        }
    } catch (error) {
        console.log(`❌ خطأ عام في الكود:`, error);
    }
};

// تسجيل الحدث في `index.js`
export default function registerGroupProtection(conn) {
    conn.ev.on('group-participants.update', async (update) => {
        console.log("📢 تحديث جديد في الجروب:", update);
        await handler(conn, update);
    });
}