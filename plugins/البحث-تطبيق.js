import axios from 'axios';
import cheerio from 'cheerio';

const handler = async (m, {conn, usedPrefix, command, text}) => {
const apkpureApi = 'https://apkpure.com/api/v2/search?q=';
const apkpureDownloadApi = 'https://apkpure.com/api/v2/download?id=';
if (!text) throw `⚠️ *يرجى كتابة اسم التطبيق (APK) الذي تريد البحث عنه*`;
m.react("⌛"); 
try {   
const res = await fetch(`https://api.dorratz.com/v2/apk-dl?text=${text}`);
const data = await res.json();
const response = `≪ تم العثور على التطبيق 🚀≫

┏━━━━━━━━━━━━━━━━━━━━━━• 
┃💫 *الاسم:* ${data.name}
┃📦 *حزمة التطبيق:* ${data.package}
┃🕒 *آخر تحديث:* ${data.lastUpdate}
┃💪 *الحجم:* ${data.size}
┗━━━━━━━━━━━━━━━━━━━━━━━•

> *⏳ الرجاء الانتظار، يتم إرسال التطبيق...*`;
await conn.sendFile(m.chat, data.icon, 'error.jpg', response, m, null, fake);
const apkSize = data.size.toLowerCase();
if (apkSize.includes('gb') || (apkSize.includes('mb') && parseFloat(apkSize) > 999)) {
return await m.reply('*التطبيق كبير جدًا ولا يمكن إرساله.*');
}
await conn.sendMessage(m.chat, {document: { url: data.dllink }, mimetype: 'application/vnd.android.package-archive', fileName: `${data.name}.apk`, caption: null }, { quoted: m });
await m.react("✅");
} catch {
try {
const res = await fetch(`${apis}/download/apk?query=${text}`);
const data = await res.json();
const apkData = data.data;
const response = `≪ تم العثور على التطبيق 🚀≫

┏━━━━━━━━━━━━━━━━━━━━━━• 
┃💫 *الاسم:* ${apkData.name}
┃👤 *المطور:* ${apkData.developer}
┃🕒 *آخر تحديث:* ${apkData.publish}
┃💪 *الحجم:* ${apkData.size}
┗━━━━━━━━━━━━━━━━━━━━━━━•

> *⏳ الرجاء الانتظار، يتم إرسال التطبيق...*`;
await conn.sendFile(m.chat, apkData.image, 'error.jpg', response, m, null, fake);
if (apkData.size.includes('GB') || parseFloat(apkData.size.replace(' MB', '')) > 999) {
return await m.reply('*التطبيق كبير جدًا ولا يمكن إرساله.*');
}
await conn.sendMessage(m.chat, {document: { url: apkData.download }, mimetype: 'application/vnd.android.package-archive', fileName: `${apkData.name}.apk`, caption: null }, { quoted: m });
await m.react("✅");
} catch {
try {
const searchA = await search(text);
const data5 = await download(searchA[0].id);
let response = `≪ تم العثور على التطبيق 🚀≫

┏━━━━━━━━━━━━━━━━━━━━━━• 
┃💫 *الاسم:* ${data5.name}
┃📦 *حزمة التطبيق:* ${data5.package}
┃🕒 *آخر تحديث:* ${data5.lastup}
┃💪 *الحجم:* ${data5.size}
┗━━━━━━━━━━━━━━━━━━━━━━━•

> *⏳ الرجاء الانتظار، يتم إرسال التطبيق...*`;
await conn.sendFile(m.chat, data5.icon, 'apk.jpg', response, m, false, fake);   
if (data5.size.includes('GB') || data5.size.replace(' MB', '') > 999) {
return await m.reply('*التطبيق كبير جدًا ولا يمكن إرساله.*');}
await conn.sendMessage(m.chat, {document: {url: data5.dllink}, mimetype: 'application/vnd.android.package-archive', fileName: data5.name + '.apk', caption: null}, {quoted: m}); 
m.react("✅");
} catch (e) {
m.react(`❌`); 
console.log(e);
handler.limit = false;
}}}}
handler.help = ['apk', 'apkmod'];
handler.tags = ['downloader'];
handler.command = /^(apkmod|apk|تطبيق|dapk2|aptoide|aptoidedl)$/i;
export default handler;

async function searchApk(text) {
  const response = await axios.get(`${apkpureApi}${encodeURIComponent(text)}`);
  const data = response.data;
  return data.results;
}

async function downloadApk(id) {
  const response = await axios.get(`${apkpureDownloadApi}${id}`);
  const data = response.data;
  return data;
}
