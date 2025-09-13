//كود من إعداد: https://github.com/elrebelde21

import fs from 'fs';
import path from 'path';

const mainFilePath = path.resolve('./src/characters.json');
const claimedFilePath = path.resolve('./database/claimed_characters.json');

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
    console.error('*˼🎐˹ لــــم أســتـطـيــع حــفـظ الـشــخـصـيــه ↶*', error);
  }
}

function syncCharacters() {
  const mainCharacters = loadCharacters(mainFilePath);
  const claimedCharacters = loadCharacters(claimedFilePath);

  const newCharacters = mainCharacters.filter(mainChar =>
    !claimedCharacters.some(claimedChar => claimedChar.url === mainChar.url)
  );

  if (newCharacters.length > 0) {
    const updatedCharacters = [...claimedCharacters, ...newCharacters];
    saveCharacters(claimedFilePath, updatedCharacters);
    console.log(`${newCharacters.length} *˼🍂˹ تــمـــت إضـــافـه شـخـصــيــه جـديــده↶*`);
    return updatedCharacters;
  }
  return claimedCharacters;
}

async function handler(m, { conn }) {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
let pp = await conn.profilePictureUrl(who, 'image').catch(_ => imageUrl.getRandom());
const availableCharacters = syncCharacters();

let time = global.db.data.users[m.sender].timeRy + 600000; // 10 دقائق
if (new Date() - global.db.data.users[m.sender].timeRy < 600000) 
  return conn.fakeReply(m.chat,  
  `*يـرجـي الــإنـتـظـــار* ${msToTime(time - new Date())} *قــبـل أن تـتـمـكــن مـن إسـتــخـدام الــأمـر مـجـددا*`, 
  m.sender, 
  `*لــا تــســتـخــدم الــأمـر عـده مــرات*`, 
  'status@broadcast', 
  null, 
  fake);

if (!availableCharacters || availableCharacters.length === 0) return;

const randomCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
const status = randomCharacter.forSale ? `*الــحـالـه*: @${randomCharacter.claimedBy.split('@')[0]} *˼🍒˹ يـــعـرض هــذه الــشــــخـصــيــه لــلـبــيــع*` 
  : randomCharacter.claimedBy ? `🔒 *الــحـالـه تـم شــرائــهـا مـن قـبـل* @${randomCharacter.claimedBy.split('@')[0]}` 
  : `*˼✅˹ مــتـــاحــه الــحـالـه* `;

let priceMessage;
if (randomCharacter.previousPrice) {
  priceMessage = `*الـــســـعـر الــســـابـــق* ${randomCharacter.previousPrice} *نــقــاط الــخـبــره*\n*الـــســــعـر الــحــالـه* ${randomCharacter.price} *نــقــاط الــخـبــره*`;
} else {
  priceMessage = `الـــســــعـر ${randomCharacter.price}  *الـــســــعـر الــحــالـه*`;
}

const sentMessage = await conn.sendFile(m.chat, randomCharacter.url, 'lp.jpg', 
  `💥 الاسم: ${randomCharacter.name}\n${priceMessage}\n${status}\n\n> *˼🚩˹ لـــشــراء هــذه الــشــخـــصـيـه رد بـ ↶╎c 」*`, 
  m, false, {
  contextInfo: { 
    mentionedJid: randomCharacter.claimedBy ? [randomCharacter.claimedBy] : [],
    forwardingScore: 1, 
    isForwarded: true, 
    forwardedNewsletterMessageInfo: { 
      newsletterJid: channelRD.id, 
      serverMessageId: '', 
      newsletterName: channelRD.name 
    }
  }
});

global.db.data.users[m.sender].timeRy = new Date() * 1;
global.db.data.tempCharacter = { ...randomCharacter, messageId: sentMessage.id };
}

handler.before = async (m, { conn }) => {
const character = global.db.data.tempCharacter;
if (m.quoted && /^[.]*c$/i.test(m.text) && character && character.messageId === m.quoted.id) {
const user = global.db.data.users[m.sender];
const characters = syncCharacters();
const claimedCharacter = characters.find(c => c.url === character.url);
if (claimedCharacter.claimedBy) {
if (!claimedCharacter.forSale) return await conn.sendMessage(m.chat, {text: `⚠️ هذه الشخصية تم شراؤها بالفعل من قبل @${claimedCharacter.claimedBy.split('@')[0]}`, contextInfo: { mentionedJid: [claimedCharacter.claimedBy] }}, { quoted: m });
const seller = claimedCharacter.seller;
if (claimedCharacter.seller === m.sender) return await conn.sendMessage(m.chat, { text: '⚠️ لا يمكنك شراء شخصيتك الخاصة.' }, { quoted: m });
if (user.exp < character.price) return await conn.sendMessage(m.chat, { text: '⚠️ ليس لديك نقاط خبرة كافية لشراء هذه الشخصية.' }, { quoted: m });

user.exp -= character.price;
const sellerExp = character.price * 0.90;
global.db.data.users[seller].exp += sellerExp; 
claimedCharacter.claimedBy = m.sender;
claimedCharacter.forSale = false; 
claimedCharacter.seller = null; 
saveCharacters(claimedFilePath, characters);

await conn.sendMessage(m.chat, { text: `🎉 لقد اشتريت *${character.name}* مقابل *${character.price}* نقطة خبرة!`, image: { url: character.url }}, { quoted: m });      

if (seller) {
await conn.sendMessage(seller, {
  text: `🎉 تم بيع شخصيتك *${character.name}* لـ @${m.sender.split('@')[0]}.\n💰 تم تحويل *${sellerExp}* نقطة خبرة إلى حسابك (بعد خصم العمولة).\n\n- السعر الأصلي: ${character.price} نقطة خبرة\n- المبلغ المستلم: ${sellerExp} نقطة خبرة.`,
  image: { url: character.url }, 
  contextInfo: { mentionedJid: [m.sender] }
}, { quoted: m });
}
} else {
if (user.exp < character.price) return await conn.sendMessage(m.chat, { text: '⚠️ ليس لديك نقاط خبرة كافية لشراء هذه الشخصية.' }, { quoted: m });
user.exp -= character.price;
claimedCharacter.claimedBy = m.sender;      
saveCharacters(claimedFilePath, characters);
await conn.sendMessage(m.chat, { text: `🎉 لقد اشتريت *${character.name}* مقابل *${character.price}* نقطة خبرة!`, image: { url: character.url } }, { quoted: m });
}
delete global.db.data.tempCharacter;
}
};

handler.help = ['rf', 'rw'];
handler.tags = ['gacha'];
handler.command = ['عروض', 'rw'];

export default handler;

function msToTime(duration) {
var milliseconds = parseInt((duration % 1000) / 100),
seconds = Math.floor((duration / 1000) % 60),
minutes = Math.floor((duration / (1000 * 60)) % 60);

minutes = (minutes < 10) ? "0" + minutes : minutes;
seconds = (seconds < 10) ? "0" + seconds : seconds;

return minutes + " دقيقة " + seconds + " ثانية "; 
}
