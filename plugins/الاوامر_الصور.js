import pkg from '@whiskeysockets/baileys';
const { prepareWAMessageMedia } = pkg;

const handler = async (m, { conn }) => {
    await conn.sendMessage(m.chat, { react: { text: '🤺', key: m.key } });

    const harley = 'https://files.catbox.moe/y48sdm.jpg';

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
> *الــصــــــــــوࢪ˼⚡˹↶*
~*⊹‏⊱≼━━━⌬〔🏮〕⌬━━━≽⊰⊹*
*˼🛹˹╎رونــــالــدو 」*
*˼🏹˹╎مــــيــســـي 」*
*˼🎭˹╎تــــطــقـــيــم 」*
*˼🎣˹╎طـــقــم 」*
*˼🎼˹╎طــــقــــمــي 」*
*˼🎯˹╎خـــلــفـــيـــات 」*
*˼🎷˹╎مـــانــــهـــوا 」*
*˼🏓˹╎جـــوجـــوتـســـو 」*
*˼🎺˹╎جــــوده 」*
*˼⚒️˹╎تــعـديــل 」*
*˼🔮˹╎كـشـف 」*
~*⊹‏⊱≼━━━⌬〔🏮〕⌬━━━≽⊰⊹*`,
        mentions: [m.sender],
        footer: 'Edward Bot',
        
        headerType: 4 // نوع الرسالة مع صورة
    }, { quoted: m });
};

handler.help = ['اوامر'];
handler.tags = ['main'];
handler.command = ['م1'];

export default handler;
