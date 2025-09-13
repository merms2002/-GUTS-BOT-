import fetch from 'node-fetch';
import fs from 'fs';

let handler = async (m, { conn, usedPrefix, args, command, text }) => {
  if (!text) throw `*❐═━━━═╊⊰🦇⊱╉═━━━═❐*
*❐┃اسـتـخـدام خـاطـئ┃🛑❯*
*『حـط الامـر و رابـط فـيـديـو/صـوره/ريـل حـق الإنـسـتـا』*
*↞┇ مثال ↞.انستا  https://www.instagram.com/reel/C4BZLtmrQPm/?igsh=cmplZHR6NjJhNjc5*
*❐═━━━═╊⊰🦇⊱╉═━━━═❐*
`;
await m.react('🕖') 
  try {
    let mediaURL = await zack(text);

    if (!mediaURL) throw new Error('*❮ ❌ ┇ لـم يـتـم الـعـثـور عـلـى رابـط الـفـيديـو ❯*');

    await conn.sendFile(m.chat, mediaURL, '', '*❮ ✅ ┇ تـم تـحـمـيـل الـفـيـديـو ❯*', m, false, { mimetype: 'video/mp4' });
  } catch (error) {
    console.error('*❮ ❌ ┇ حـدث خـطأ مـا فـي تـحـمـيـل الـفـيـديـو ❯*\n', error);
    throw `*❮ ❌ ┇ حـدث خـطأ مـا فـي تـحـمـيـل الـفـيـديـو ❯*\n${error.message}`;
  }
};

async function zack(text) {
  try {
    let res = await fetch(`https://bk9.fun/download/instagram?url=${encodeURIComponent(text)}`);

    if (!res.ok) {
      throw new Error('*❮ ❌ ┇ حـدث خـطـأٌ مـا فـي الـAPI ❯*');
    }

    let json = await res.json();

    if (!json.status || !json.BK9[0]?.url) throw new Error('*❮ ❌ ┇ لـم يـتـم الـعـثـور عـلـى رابـط الـفـيديـو ❯*');

    const fileName = 'Instagram_video.mp4';
    const fileStream = fs.createWriteStream(fileName);

    let videoRes = await fetch(json.BK9[0].url);
    if (!videoRes.ok) {
      throw new Error('*❮ ❌ ┇ حـدث خـطـأٌ مـا ❯*');
    }

    videoRes.body.pipe(fileStream);

    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

    return fileName;
  } catch (error) {
    console.error('*❮ ❌ ┇ حـدث خـطـأٌ مـا ❯*\n', error);
    return false;
  }
}

handler.help = ['k a k a s h i'];
handler.tags = ['k a k a s h i'];
handler.command = /^(instadl|ig|انستا|انستغرام)$/i;

export default handler;