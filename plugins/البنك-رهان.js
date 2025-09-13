import fetch from 'node-fetch';

let handler = async (m, { args, usedPrefix, command }) => {
    let fa = `
*❮ 🎰┇اكتب الرقم الذي تريد المراهنة به ❯* 

*📌 مثال:*
*${usedPrefix + command} 100*`.trim();
    if (!args[0]) throw fa;
    if (isNaN(args[0])) throw fa;
    let apuesta = parseInt(args[0]);
    let users = global.db.data.users[m.sender];
    let time = users.lastslot + 10000;
    if (new Date - users.lastslot < 10000) throw `*انتظر هذا الوقت ثم حاول مجدداً ${msToTime(time - new Date())} اجراء منع السبام*`;
    if (apuesta < 100) throw '*❮ ❗┇اقـل حـد للـرهـان 100 ❯*';
    if (users.exp < apuesta) {
        throw `*[❗] لا يوجد لديك نقاط خبرة كافية جرب لعبة اخرى مثل كت ، او تواصل مع المطور ليعطيك نقاط*`;
    }
    let emojis = ["🎁", "💎", "💸"];

    // توليد النتائج عشوائيا
    let a = Math.floor(Math.random() * emojis.length);
    let b = Math.floor(Math.random() * emojis.length);
    let c = Math.floor(Math.random() * emojis.length);

    let x = [],
        y = [],
        z = [];
    for (let i = 0; i < 3; i++) {
        x[i] = emojis[a];
        a = (a + 1) % emojis.length;
    }
    for (let i = 0; i < 3; i++) {
        y[i] = emojis[b];
        b = (b + 1) % emojis.length;
    }
    for (let i = 0; i < 3; i++) {
        z[i] = emojis[c];
        c = (c + 1) % emojis.length;
    }

    let end;
    if (a === b && b === c) {
        end = `*مبارك لقد ربحت 🎁 +${apuesta * 2} نقاط خبرة*`;
        users.exp += apuesta * 2;
    } else if (a === b || a === c || b === c) {
        end = `*لقد اوشكت علي الفوز لكن لم تربح بالكامل لذلك* \n *ستأخد 10 نقاط خبرة*`;
        users.exp += 10;
    } else {
        end = `*❌ لقد خسرت -${apuesta} نقاط*`;
        users.exp -= apuesta;
    }

    users.lastslot = new Date * 1;
    return await m.reply(`
*❮ 🎰 رهـــان ❯*
⊱─────────⊰
${x[0]} ┇ ${y[0]} ┇ ${z[0]}
${x[1]} ┇ ${y[1]} ┇ ${z[1]}
${x[2]} ┇ ${y[2]} ┇ ${z[2]}
⊱─────────⊰
🎰 | ${end}
> *لا تنسى أن الرهان مُحرم في ديننا، وهذه مُجرد لعبة لا خسرة او ربح حقيقي*`);
};

handler.help = ['slot <apuesta>'];
handler.tags = ['game'];
handler.command = ['رهان'];
export default handler;

function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return minutes + " دقــائــق " + seconds + " ثــوانــي ";
}
