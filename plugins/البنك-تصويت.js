//كود من إعداد: https://github.com/elrebelde21

import fs from 'fs';
import path from 'path';

const mainFilePath = path.resolve('./database/claimed_characters.json');

function loadCharacters(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8');
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`حدث خطأ أثناء قراءة ملف JSON (${filePath}):`, error);
    return [];
  }
}

function saveCharacters(filePath, characters) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(characters, null, 2), 'utf-8');
  } catch (error) {
    console.error('حدث خطأ أثناء حفظ الشخصيات:', error);
  }
}

async function handler(m, { conn, args }) {
const characters = loadCharacters(mainFilePath);
const characterName = args.join(' ').trim();
let time = global.db.data.users[m.sender].timevot + 1800000; // 1800000 = 30 دقيقة
if (new Date() - global.db.data.users[m.sender].timevot < 1800000) 
  return conn.fakeReply(m.chat,  
  `🤚 تمهل قليلًا، انتظر ${msToTime(time - new Date())} قبل أن تتمكن من استخدام هذا الأمر مجددًا.`, 
  m.sender, 
  `لا تقم بالإزعاج باستخدام الأمر عدة مرات!`, 
  'status@broadcast', 
  null, 
  fake);

if (!characterName) return conn.reply(m.chat, '⚠️ يرجى تحديد اسم الشخصية.', m);

const character = characters.find(c => c.name.toLowerCase() === characterName.toLowerCase());
if (!character) return conn.reply(m.chat, `⚠️ لم يتم العثور على الشخصية "${characterName}".`, m);

if (character.price === null || character.price === undefined) {
  character.price = 0;
}

character.votes = (character.votes || 0) + 1; 
const increment = Math.floor(Math.random() * 50) + 1; 
character.price += increment;
saveCharacters(mainFilePath, characters);
const formattedPrice = character.price.toLocaleString();

conn.reply(m.chat, `✨ لقد قمت بالتصويت للشخصية *${character.name}*، وأصبح سعرها الجديد *${formattedPrice}* (+${increment})`, m);
global.db.data.users[m.sender].timevot = new Date() * 1;
}

handler.help = ['vote <اسم الشخصية>'];
handler.tags = ['gacha'];
handler.command = ['تصويت'];

export default handler;

function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60),

minutes = (minutes < 10) ? "0" + minutes : minutes;
seconds = (seconds < 10) ? "0" + seconds : seconds;

return minutes + " دقيقة " + seconds + " ثانية "; 
}
