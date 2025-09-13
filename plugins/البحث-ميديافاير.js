import axios from 'axios';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { mediafiredl } from '@bochilteam/scraper';
import fg from 'api-dylux';

let free = 150;
let prem = 500;

const handler = async (m, { conn, args, usedPrefix, command }) => {
  let sticker = 'https://qu.ax/Wdsb.webp';
  if (!args[0]) throw `⚠️ يرجى إدخال رابط ميديافاير صالح كمثال:
${usedPrefix + command} https://www.mediafire.com/file/sd9hl31vhhzf76v/EvolutionV1.1-beta_%2528Recomendado%2529.apk/file`;
  m.react(`🚀`);
  try {
    const res = await fetch(`https://api.fgmods.xyz/api/downloader/mediafire?url=${args}&apikey=${fgkeysapi}`);
    const data = await res.json();
    const fileData = data.result;
    const caption = `┏━━『 ميديافاير 』━━•
┃❥ الاسم : ${fileData.title}
┃❥ الحجم : ${fileData.filesize}
┃❥ النوع : ${fileData.mimetype}
╰━━━⊰ 𓃠 ${vs} ⊱━━━━•`.trim();
    await conn.sendFile(m.chat, fileData.url, fileData.title, caption, m, null, { mimetype: fileData.mimetype, asDocument: true });
    m.react('✅');
  } catch {
    try {
      const res = await fetch(`https://api.agatz.xyz/api/mediafire?url=${args}`);
      const data = await res.json();
      const caption = `┏━━『 ميديافاير 』━━•
┃❥ الاسم : ${data.data.nama}
┃❥ الحجم : ${data.data.size}
┃❥ النوع : ${data.data.mime}
╰━━━⊰ 𓃠 ${vs} ⊱━━━━•`.trim();
      m.reply(caption);
      conn.sendFile(m.chat, data.data.link, data.data.nama, '', m, null, { mimetype: data.data.mime, asDocument: true });
      m.react(`✅`);
    } catch {
      m.react(`❌`);
    }
  }
};

handler.help = ['mediafire', 'mediafiredl'];
handler.tags = ['downloader'];
handler.command = /^(ميديافاير|mediafiredl|dlmediafire)$/i;
handler.limit = 3;

export default handler;

     