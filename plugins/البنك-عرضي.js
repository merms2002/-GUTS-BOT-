import fs from 'fs';
import path from 'path';

const claimedFilePath = path.resolve('./database/claimed_characters.json');
const pendingSales = new Map();
const cooldownTime = 3600000; // 1 ساعة

function loadCharacters() {
    try {
        const data = fs.readFileSync(claimedFilePath, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (error) {        
        return [];
    }
}

function saveCharacters(characters) {
    try {
        fs.writeFileSync(claimedFilePath, JSON.stringify(characters, null, 2), 'utf-8');
    } catch (error) {        
    }
}

function calculateMaxPrice(basePrice, votes) {
    if (votes === 0) {
        return Math.round(basePrice * 1.05);
    }
    const maxIncreasePercentage = 0.3;
    const maxPrice = basePrice * (1 + maxIncreasePercentage * votes);
    return Math.round(maxPrice);
}

function calculateMinPrice(basePrice) {
    return Math.round(basePrice * 0.95);
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
    const characters = loadCharacters();

    if (args.length < 2) {
        const userCharacters = characters.filter(c => c.claimedBy === m.sender);

        if (userCharacters.length === 0) return m.reply('⚠️ ليس لديك شخصيات مسجلة. قم بالمطالبة بشخصية أولاً.');
        
        let characterList = 'قائمة شخصياتك:\n';
        userCharacters.forEach((character, index) => {
            characterList += `${index + 1}. ${character.name} - ${character.price} exp\n`;
        });
        
        return m.reply(`*⚠️ هل لا تعرف كيفية الاستخدام؟ استخدم الأوامر التالية:*\n\n• يمكنك بيع شخصية لمستخدم معين:\n${usedPrefix + command} <اسم الشخصية> <السعر> @تاغ\n\n• أو يمكنك عرض الشخصية في السوق:\nمثال: ${usedPrefix + command} goku 9500\n\n` + characterList);
    }

    const mentioned = m.mentionedJid[0] || null;
    const mentionIndex = args.findIndex(arg => arg.startsWith('@'));
    let price = args[args.length - 1];
    
    if (mentioned && mentionIndex !== -1) {
        price = args[args.length - 2];
    }

    price = parseInt(price);
    if (isNaN(price) || price <= 0) return m.reply('⚠️ يرجى تحديد سعر صحيح لشخصيتك.');

    const nameParts = args.slice(0, mentioned ? -2 : -1);
    const characterName = nameParts.join(' ').trim();
    
    if (!characterName) return m.reply('⚠️ لم يتم العثور على اسم الشخصية. تحقق وحاول مرة أخرى.');

    const characterToSell = characters.find(c =>
        c.name.toLowerCase() === characterName.toLowerCase() &&
        c.claimedBy === m.sender
    );

    if (!characterToSell) return m.reply('⚠️ لم يتم العثور على الشخصية التي تحاول بيعها.');
    if (characterToSell.forSale) return m.reply('⚠️ هذه الشخصية معروضة للبيع بالفعل. استخدم الأمر `.rf-retirar` لإزالتها قبل إعادة نشرها.');

    if (characterToSell.lastRemovedTime) {
        const timeSinceRemoval = Date.now() - characterToSell.lastRemovedTime;
        if (timeSinceRemoval < cooldownTime) {
            const remainingTime = Math.ceil((cooldownTime - timeSinceRemoval) / 60000);
            return m.reply(`⚠️ يجب الانتظار ${remainingTime} دقيقة قبل إعادة نشر *${characterToSell.name}*.`);
        }
    }

    const minPrice = calculateMinPrice(characterToSell.price);
    const maxPrice = calculateMaxPrice(characterToSell.price, characterToSell.votes || 0);
    if (price < minPrice) return m.reply(`⚠️ الحد الأدنى المسموح به لسعر ${characterToSell.name} هو ${minPrice} exp.`);
    if (price > maxPrice) return m.reply(`⚠️ الحد الأقصى المسموح به لسعر ${characterToSell.name} هو ${maxPrice} exp.`);

    if (mentioned) {
        if (pendingSales.has(mentioned)) return m.reply('⚠️ المشتري لديه طلب معلق بالفعل. يرجى الانتظار.');

        pendingSales.set(mentioned, {
            seller: m.sender,
            buyer: mentioned,
            character: characterToSell,
            price,
            timer: setTimeout(() => {
                pendingSales.delete(mentioned);
                m.reply(`⏰ @${mentioned.split('@')[0]} لم يرد على عرض *${characterToSell.name}*. تم إلغاء الطلب.`, null, {
                    mentions: [mentioned]
                });
            }, 60000), // 1 دقيقة 
        });

        m.reply(`📜 يا @${mentioned.split('@')[0]}, المستخدم @${m.sender.split('@')[0]} يريد بيع *${characterToSell.name}* لك بسعر ${price} exp.\n\nرد بـ:\n- *قبول* للشراء.\n- *رفض* للإلغاء.`, null, { mentions: [mentioned, m.sender] });
    } else {
        characterToSell.price = price;
        characterToSell.claimedBy = m.sender;
        characterToSell.forSale = true;
        characterToSell.seller = m.sender;
        saveCharacters(characters);
        m.reply(`✅ لقد قمت بعرض *${characterToSell.name}* للبيع في السوق بسعر ${price} exp.`);
    }
};

handler.help = ['rf-vender'];
handler.tags = ['gacha'];
handler.command = ['عرضي', 'كاكاشي'];
export default handler;
