import axios from 'axios';
const { generateWAMessageContent, generateWAMessageFromContent, proto } = (await import('@adiwajshing/baileys')).default;

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return m.reply('*╻❗╹↜ ٭ `يـجـب يـجـب كـتـابـة اسـم الـشـئ الـذي تـبـحـث عـنـه` ٭ ↯*\n\n> *❐↞┇مـثـال📌↞ .بين سونغ جين وو  ┇*');
  }

  await conn.sendMessage(m.chat, { text: '˼⏱️˹ `جـاري الـبـحـث....`' }, { quoted: m });

  const [query, jumlahStr] = text.split('|').map(v => v.trim());
  const jumlah = Math.min(parseInt(jumlahStr) || 5, 10);

  async function createImage(url) {
    const { imageMessage } = await generateWAMessageContent({ image: { url } }, {
      upload: conn.waUploadToServer
    });
    return imageMessage;
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  try {
    const api = `https://api.vreden.my.id/api/pinterest?query=${encodeURIComponent(query)}`;
    const { data } = await axios.get(api);
    const hasil = data?.result || [];

    if (!hasil.length) return m.reply('˼❌˹ لـم يـتـم الـعـثـور عـلـى أي صـور. ˼❌˹');

    shuffle(hasil);
    const images = hasil.slice(0, jumlah);
    const cards = [];

    for (let i = 0; i < images.length; i++) {
      const imageMsg = await createImage(images[i]);
      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `★ 🍃╿ الـصـوره ـــ ˼${i + 1}/${images.length}˹`
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: namebot
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          hasMediaAttachment: true,
          imageMessage: imageMsg
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [
            {
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
                display_text: "ღقـنـاتـنـا",
                url: url
              })
            }
          ]
        })
      });
    }

    const carousel = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
              text: "*هـذه نـتـائـج بـحـثـك عـلـى بـيـنـتـريـسـت:*"
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({ text: '' }),
            header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards: cards
            })
          })
        }
      }
    }, {});

    await conn.relayMessage(m.chat, carousel.message, { messageId: carousel.key.id });

  } catch (err) {
    console.error(err);
    m.reply(`خطأ في جلب البيانات\nسجلات الأخطاء: ${err.message}`);
  }
};

handler.help = ['بـيـن'];
handler.tags = ['بـحـث'];
handler.command = /^بين|pin$/i;

export default handler;