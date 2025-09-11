import fetch from 'node-fetch';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { ytmp3, ytmp4 } = require("@hiudyy/ytdl");

const LimitAud = 725 * 1024 * 1024; // الحد الأقصى لحجم الصوت: 725MB
const LimitVid = 425 * 1024 * 1024; // الحد الأقصى لحجم الفيديو: 425MB
const youtubeRegexID = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/;
const userRequests = {};  // لحفظ طلبات المستخدمين

// دالة الترجمة
const tr = async (text) => {
  const translations = {
    "Que está buscando?": "ماذا تبحث؟",
    "Ingrese el nombre de la canción": "أدخل اسم الأغنية",
    "Ejemplo:": "مثال:",
    "Hey": "مرحبًا",
    "espera pendejo, ya estás descargando algo": "انتظر قليلًا، أنت تقوم بتحميل شيء حاليًا",
    "Espera a que termine tu solicitud actual antes de hacer otra...": "انتظر حتى تنتهي طلباتك الحالية قبل إرسال طلب آخر",
    "Duración": "المدة",
    "Aguarde un momento en lo que envío su": "انتظر لحظة أثناء إرسال"
  };
  return translations[text] || text; // ترجمة النص إذا كان موجودًا في القاموس، وإلا يتم إرجاع النص كما هو
};

// معالج الأوامر
const handler = async (m, { conn, command, args, text, usedPrefix }) => {
  if (!text) {
    return m.reply(`*🤔 ${await tr("Que está buscando?")} 🤔*\n*${await tr("Ingrese el nombre de la canción")}*\n\n*${await tr("Ejemplo:")}*\n${usedPrefix + command} emilia 420`);
  }

  const tipoDescarga = command === 'play' || command === 'musica' ? 'صوت' : command === 'play2' ? 'فيديو' : '';

  if (userRequests[m.sender]) {
    return await conn.reply(m.chat, `⏳ ${await tr("Hey")} @${m.sender.split('@')[0]} ${await tr("espera pendejo, ya estás descargando algo")} 🙄\n${await tr("Espera a que termine tu solicitud actual antes de hacer otra...")}`, m);
  }

  userRequests[m.sender] = true;
  try {
    let videoIdToFind = text.match(youtubeRegexID) || null;
    let ytplay = await yts(text); // البحث في يوتيوب
    let ytplay2 = await yts(videoIdToFind === null ? text : 'https://youtu.be/' + videoIdToFind[1]);
    
    if (videoIdToFind) {
      const videoId = videoIdToFind[1];
      ytplay2 = ytplay2.all.find(item => item.videoId === videoId) || ytplay2.videos.find(item => item.videoId === videoId);
    }

    ytplay2 = ytplay2.all?.[0] || ytplay2.videos?.[0] || ytplay2;

    const PlayText = await conn.sendMessage(m.chat, { 
      text: `${ytplay[0].title}
*⇄ㅤ     ◁   ㅤ  ❚❚ㅤ     ▷ㅤ     ↻*

*⏰ ${await tr("Duración")}:* ${secondString(ytplay[0].duration.seconds)}
*👉🏻 ${await tr("Aguarde un momento en lo que envío su")} ${tipoDescarga}*`,
    });

    if (command === 'play' || command === 'musica') {
      const { mediaData, isDirect } = await downloadAudio(ytplay2.url);
      if (mediaData) {
        const fileSize = await getFileSize(mediaData);
        if (fileSize > LimitAud) {
          await conn.sendMessage(m.chat, { document: isDirect ? mediaData : { url: mediaData }, mimetype: 'audio/mpeg', fileName: `${ytplay2.title}.mp3` }, { quoted: m });
        } else {
          await conn.sendMessage(m.chat, { audio: isDirect ? mediaData : { url: mediaData }, mimetype: 'audio/mpeg' }, { quoted: m });
        }
      }
    }

    if (command === 'play2' || command === 'video') {
      const { mediaData, isDirect } = await downloadVideo(ytplay2.url);
      if (mediaData) {
        const fileSize = await getFileSize(mediaData);
        const messageOptions = { fileName: `${ytplay2.title}.mp4`, caption: `🔰 ${await tr("Aquí está tu video")}\n🔥 ${await tr("Título")}: ${ytplay2.title}`, mimetype: 'video/mp4' };
        if (fileSize > LimitVid) {
          await conn.sendMessage(m.chat, { document: isDirect ? mediaData : { url: mediaData }, ...messageOptions }, { quoted: m });
        } else {
          await conn.sendMessage(m.chat, { video: isDirect ? mediaData : { url: mediaData }, thumbnail: ytplay2.thumbnail, ...messageOptions }, { quoted: m });
        }
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    userRequests[m.sender] = false;
  }
};

// دالة لتحميل الصوت
async function downloadAudio(url) {
  const info = await ytdl.getInfo(url);
  const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
  return { mediaData: format.url, isDirect: true };
}

// دالة لتحميل الفيديو
async function downloadVideo(url) {
  const info = await ytdl.getInfo(url);
  const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
  return { mediaData: format.url, isDirect: true };
}

async function getFileSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return parseInt(response.headers.get('content-length') || 0);
  } catch {
    return 0; // إذا فشل نحسب الحجم صفر
  }
}

function secondString(seconds) {
  seconds = Number(seconds);
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h} ساعة, ${m} دقيقة, ${s} ثانية`;
}

handler.help = ['play', 'play2', 'musica'];
handler.tags = ['downloader'];
handler.command = ['play', 'play2', 'musica'];

export default handler;