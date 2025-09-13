import pkg from '@whiskeysockets/baileys';
const { prepareWAMessageMedia } = pkg;

const handler = async (m, { conn }) => {
    await conn.sendMessage(m.chat, { react: { text: '👤', key: m.key } });

    const harley = 'https://files.catbox.moe/3plaxc.jpg';

    // تعريف المتغيرات المفقودة (أنت عدل القيم حسب نظامك)
    const taguser = m.sender.split('@')[0];
    const exp = 100;
    const role = 'مبتدئ';
    const limit = 10;

    const media = await prepareWAMessageMedia({ image: { url: harley } }, { upload: conn.waUploadToServer });

    await conn.sendMessage(m.chat, {
        image: { url: harley },
        caption: `*◡̈⃝🚩 ╎${taguser} 」*
*⊹‏⊱≼━━━⌬〔🏮〕⌬━━━≽⊰⊹*
> *الــمــجـــــمــوعــات˼⚡˹↶*
~*⊹‏⊱≼━━━⌬〔🏮〕⌬━━━≽⊰⊹*
*˼✔️˹╎لـــــيــــنـك 」*
*˼🎩˹╎مــــنـــشــــن 」*
*˼🚩˹╎طـــرد 」*
*˼⚡˹╎مـــيـــــوت 」*
*˼✈️˹╎مــــخــــفـــي 」*
*˼⚓˹╎تــــحــزيــر 」*
*˼™️˹╎تـــرقـــيــه 」*
*˼🔔˹╎اعـــفــــاء 」*
*˼⛹️‍♂️˹╎جـــروب 」*
*˼🤹‍♂️˹╎لــيـــنــــك 」*
*˼🥊˹╎حـــذف 」*
*˼🗯˹╎لــقـب 」*
*˼👨‍💻˹╎احـــصــائـيـات 」*
*˼🪪˹╎حـذف-كـل-الـألـقـاب 」*
*˼📜˹╎الـألـقـــاب 」*
*˼📄˹╎لـقــبـه 」*
*˼🔍˹╎بــحـث_لـقـب 」*
*˼🗃˹╎حـذف-الـقـاب-الــمـجـمـوعـه 」*
*˼📨˹╎ســـجـل 」*
*˼✉️˹╎حـذف-لـقـب 」*
*˼🖇˹╎اخـتــفــاء 」*
*⊹‏⊱≼━━━⌬〔🏮〕⌬━━━≽⊰⊹`,
        mentions: [m.sender],
        footer: 'Edward 𝐁𝐎𝐓',
        
        headerType: 4 // نوع الرسالة مع صورة
    }, { quoted: m });
};

handler.help = ['اوامر'];
handler.tags = ['main'];
handler.command = ['م9'];

export default handler;