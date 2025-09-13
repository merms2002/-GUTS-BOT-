const handler = async (m, { conn }) => {
    const revoke = await conn.groupRevokeInvite(m.chat);
    await conn.reply(m.chat, `*_تم إعادة تعيين رابط المجموعة بنجاح._*\n*• الرابط الجديد:* ${'https://chat.whatsapp.com/' + revoke}`, m);
};
handler.help = ['إعادة_تعيين_الرابط'];
handler.tags = ['المجموعة'];
handler.command = ['إعادة_تعيين_الرابط', 'تعيين'];
handler.botAdmin = true;
handler.admin = true;
handler.group = true;

export default handler;
