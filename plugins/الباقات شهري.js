import pkg from '@whiskeysockets/baileys';
const { prepareWAMessageMedia } = pkg;

const handler = async (m, { conn }) => {
    await conn.sendMessage(m.chat, { react: { text: '☠', key: m.key } });

    const harley = 'https://files.catbox.moe/jt5plc.jpg';

    let messageContent = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: { title: 'Edward 𝐁𝐎𝐓' },
                    body: {
                        text: `━ ╼╃ ⌬〔﷽〕⌬ ╄╾ ━
> Edward Bot 
> 〔 الاشتراك الشهري┊ ˼‏ 🚀˹ ↶〕
*⋅ ───━ •↳☠↲• ━─── ⋅*
            *𝙆𝙍𝙀𝙎 𝐁𝐎𝐓*
*⋅ ───━ •↳☠↲• ━─── ⋅*
╗───¤﹝السعر ↶ 💵﹞
> •┊˹⛈️˼┊- جروب فوق 100 متابع
> •┊˹⛈️˼┊- رقم وهمي
> •┊˹⛈️˼┊- 25 شهريا
> •┊˹⛈️˼┊- روبل بوت ارقام
╝───────────────¤
╗───¤﹝المميزات ↶ 🚀﹞
> •┊˹⛈️˼┊- اشتراك سرفر عام
> •┊˹⛈️˼┊- شغال 24/24
> •┊˹⛈️˼┊- البوت تحت التطوير
╝───────────────¤
╗───¤﹝طرق الدفع ↶ 💰﹞
> •┊˹⛈️˼┊- سبافون شحن /اليمن/
╝───────────────¤
*⋅ ───━ •↳☠↲• ━─── ⋅*
> 〔تـوقـيـع┊ ˼‏📜˹ 〕↶
*⌠Edward Bot⌡*
*⋅ ───━ •↳☠↲• ━─── ⋅*`,
                        subtitle: "Edward 𝐁𝐎𝐓"
                    },
                    header: {
                        hasMediaAttachment: true,
                        ...(await prepareWAMessageMedia({ image: { url: harley } }, { upload: conn.waUploadToServer }, { quoted: m }))
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "cta_url",
                                buttonParamsJson: '{"display_text":"⌈🚀╎𝐁𝐔𝐘 ˹💰˼ 𝐍𝐎𝐖╎🚀⌋","url":"https://api.whatsapp.com/send?phone=+201004548537","merchant_url":"https://api.whatsapp.com/send?phone=+201004548537"}'
                            },
                            {
                                name: "cta_url",
                                buttonParamsJson: '{"display_text":"⌈📲╎قـنـاة الـمـطـور╎📲⌋","url":"https://whatsapp.com/channel/0029Vax1In2AzNbwltCS790O","merchant_url":"https://whatsapp.com/channel/0029Vax1In2AzNbwltCS790O"}'
                            }
                        ]
                    }
                }
            }
        }
    };

    conn.relayMessage(m.chat, messageContent, {});
};

handler.help = ['info'];
handler.tags = ['main'];
handler.command = ['اشتراك'];

export default handler;
