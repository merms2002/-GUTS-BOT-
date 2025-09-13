const handler = async (message, { conn, isAdmin }) => {
    if (message.fromMe) return; // إذا كان المرسل هو البوت نفسه، لا تفعل شيئًا
    if (isAdmin) throw '*[❗] انت ادمن اصلا يا مطوري ❤️*';
    
    try {
        await conn.groupParticipantsUpdate(
            message.chat,
            [message.sender],
            'promote' // ترقية المرسل إلى أدمن
        );
    } catch {
        await message.reply('*[❗] فاقد مش قادر*');
    }
};

handler.command = /^ارفعني|adm$/i;
handler.rowner = true;
handler.botAdmin = true;
handler.group = true;

export default handler;
