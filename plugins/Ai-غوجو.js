import fetch from 'node-fetch';
import pkg from '@whiskeysockets/baileys';
const { prepareWAMessageMedia } = pkg;

const handler = async (m, { text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(
      m.chat,
      `*❐═━━━═╊⊰🏯⊱╉═━━━═❐*
*❐┃ هـذا أمـر ذكـاء اصـطـنـاعـي ${command}┃🛑❯*

*↞┇ مثال ↞ ${usedPrefix + command} من انت؟*
*❐═━━━═╊⊰🏯⊱╉═━━━═❐*
> *𝙆𝙍𝙀𝙎 𝐁𝐎𝐓*`,
      m
    );
  }

  try {

    let prompt, imageUrl;
    
    if (command === 'كريس') {
      prompt = `هلا بك في بوت فاقد هذا امر ذكاء اصطناعي اسكه كريس `;
      imageUrl = 'https://files.catbox.moe/5xk41x.jpg'; // علم مصر
    } else if (command === 'كريس') {
      prompt = `ان مطوي هو -فاقدŁØŞŦ`;
      imageUrl = 'https://files.catbox.moe/5xk41x.jpg'; // علم عمان
    } else if (command === 'كريس') {
      prompt = `انا كريس بوت اذا كان لديك سؤال اساله بامر .غوجو`;
      imageUrl = 'https://files.catbox.moe/5xk41x.jpg'; // علم العراق
    } else {
      return conn.reply(m.chat, '⚠️ شخصية غير معروفة!', m);
    }

    const encodedText = encodeURIComponent(text);
    const encodedPrompt = encodeURIComponent(prompt);
    const apiResponse = await fetch(
      `https://shawrma.store/ai/chatgpt?text=${encodedText}&prompt=${encodedPrompt}`
    );

    if (!apiResponse.ok) throw new Error(`HTTP error! Status: ${apiResponse.status}`);

    const res = await apiResponse.json();

    if (res.status && res.result) {
      let media = await prepareWAMessageMedia({ image: { url: imageUrl } }, { upload: conn.waUploadToServer });

      let message = {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              header: { title: `${command} 𝐁𝐨𝐭` },
              body: { text: res.result },
              header: { hasMediaAttachment: true, ...media },
              nativeFlowMessage: {
                buttons: [
                  {  
                    name: "cta_url",  
                    buttonParamsJson: JSON.stringify({  
                      display_text: "قـنـاتـنـا 🔰",  
                      url: "https://whatsapp.com/channel/0029Vb6CZ5AJpe8nf31dSp3A",  
                      merchant_url: "https://whatsapp.com/channel/0029Vb6CZ5AJpe8nf31dSp3A"  
                    })  
                  }
                ]
              }
            }
          }
        }
      };

      await conn.relayMessage(m.chat, message, {});
    } else {
      throw new Error('Unexpected API response structure');
    }
  } catch (error) {
    console.error(error);
    conn.reply(m.chat, '❌ حدث خطأ في تنفيذ الأمر، حاول مرة أخرى لاحقًا.', m);
  }
};

handler.command = ['كريس', 'كريس', 'كريس'];
handler.help = ['k a k a s h i'];
handler.tags = ['ai'];
export default handler;