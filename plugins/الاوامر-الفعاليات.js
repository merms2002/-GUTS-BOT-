import pkg from '@whiskeysockets/baileys';
const { prepareWAMessageMedia } = pkg;

const handler = async (m, { conn }) => {
    await conn.sendMessage(m.chat, { react: { text: '🎐', key: m.key } });

    const harley = 'https://files.catbox.moe/oc1xq4.jpg';

    // تعريف المتغيرات المفقودة (أنت عدل القيم حسب نظامك)
    const taguser = m.sender.split('@')[0];
    const exp = 100;
    const role = 'مبتدئ';
    const limit = 10;

    const media = await prepareWAMessageMedia({ image: { url: harley } }, { upload: conn.waUploadToServer });

    await conn.sendMessage(m.chat, {
        image: { url: harley },
        caption: `*◡̈⃝🚩 ╎${taguser} 」*
~*⊹‏⊱≼━━━⌬〔🏮〕⌬━━━≽⊰⊹*
> *الــــفـــعـــالــيـــات  ˼🍃˹↶*
~*⊹‏⊱≼━━━⌬〔🏮〕⌬━━━≽⊰⊹*
*˼🕵️‍♂️˹╎الــجـــاســوس 」*
*˼💂‍♂️˹╎عـــمـيـــل」*
*˼🔥˹╎قـــاتــل 」*
*˼⛲˹╎ديـث_نـــوت 」*
*˼🔪˹╎مـجــرم 」*
*˼🏃‍♂️˹╎هـروب 」*
~*⊹‏⊱≼━━━⌬〔🏮〕⌬━━━≽⊰⊹*`,
        mentions: [m.sender],
        footer: 'Edward 𝐁𝐎𝐓',
        
        headerType: 4 // نوع الرسالة مع صورة
    }, { quoted: m });
};

handler.help = ['اوامر'];
handler.tags = ['main'];
handler.command = ['م11'];

export default handler;