import fs from 'fs';
import axios from 'axios';
import similarity from 'similarity';

// تخزين اللعبة في الذاكرة
let gameCache = null;

let timeout = 60000;
let poin = 500;
const threshold = 0.72;
const wm = '🔹 لعبة المليون 🔹';

async function fetchGameData() {
    if (!gameCache) {
        try {
            const fileId = '10jyvE6PziOrxC6u2HVieaa0zBf1ohBQM';
            const url = `https://drive.google.com/uc?export=download&id=${fileId}`;
            const res = await axios.get(url);

            if (res.data && Array.isArray(res.data)) {
                gameCache = res.data;
            } else {
                console.error('The received data is not a valid JSON array.');
            }
        } catch (error) {
            console.error('Error fetching data from Google Drive:', error);
        }
    }
    return gameCache;
}

let handler = async (m, { conn, text, command }) => {
    if (command === 'المليون') {
        try {
            let game = await fetchGameData();
            if (game && game.length > 0) {
                let json = game[Math.floor(Math.random() * game.length)];
                let answer = json.response.trim().toLowerCase();
                let img = json.image || 'https://qu.ax/eqTja.jpg';
                let questions = json.question || 'من هو هذا؟';
                let selection = json.selection || ['اختيار 1', 'اختيار 2', 'اختيار 3', 'اختيار 4'];

                let id = m.chat;
                conn.shawaza = conn.shawaza || {};

                if (conn.shawaza[id]) {
                    conn.sendButton(m.chat, '❗ هناك سؤال لم تتم الإجابة عليه بعد ❌', wm, img, null, null, null, m);
                    return;
                }

                let caption = `
❓ السؤال: ${questions}
⏳ الوقت: ${(timeout / 1000).toFixed(2)} ثواني
💰 الجائزة: ${poin} نقطة
🏳️ للانسحاب: استخدم [انسحاب]
📑 الاختيارات:
                `;

                await conn.sendButton(
                    m.chat,
                    caption,
                    wm,
                    img,
                    selection.map(opt => [opt.trim(), `answer1 ${opt.trim()}`]),
                    null,
                    null,
                    m
                );

                conn.shawaza[id] = {
                    correctAnswer: answer,
                    options: selection,
                    timer: setTimeout(async () => {
                        if (conn.shawaza[id]) {
                            global.db.data.users[m.sender].exp = (global.db.data.users[m.sender].exp || 0) - poin;
                            conn.sendButton(m.chat, `❌ انتهى الوقت! الإجابة الصحيحة: ${answer}`, wm, img, [['العب مجددا', '.المليون']], null, null, m);
                            delete conn.shawaza[id];
                        }
                    }, timeout),
                    attempts: 2,
                    poin: poin,
                    data: json
                };
            }
        } catch (error) {
            console.error('Error processing game logic:', error);
        }
    } else if (command.startsWith('answer1')) {
        let id = m.chat;
        let selectedAnswer = text.replace('answer1', '').trim().toLowerCase();
        let gamelev = conn.shawaza[id];

        if (!gamelev) {
            conn.sendButton(m.chat, '❓ لا يوجد سؤال نشط حاليا 🧞', wm, null, [['العب مجددا', '.المليون']], null, null, m);
            return;
        }

        let Answer = gamelev.correctAnswer;
        let point = gamelev.poin;
        let img = gamelev.data.image || 'https://qu.ax/eqTja.jpg';
        let level = global.db.data.users[m.sender].level || 1;

        if (selectedAnswer === Answer) {
            global.db.data.users[m.sender].exp = (global.db.data.users[m.sender].exp || 0) + point;
            conn.sendButton(m.chat, `👏🏻 إجابة صحيحة! ربحت ${point} نقطة 🧞`, wm, img, [['العب مجددا', '.المليون']], null, null, m);
            clearTimeout(gamelev.timer);
            delete conn.shawaza[id];
        } else if (selectedAnswer === 'انسحاب') {
            global.db.data.users[m.sender].exp = (global.db.data.users[m.sender].exp || 0) - point;
            conn.sendButton(m.chat, `🚪 انسحبت من اللعبة وخسرت ${point} نقطة 🏃`, wm, img, [['العب مجددا', '.المليون']], null, null, m);
            clearTimeout(gamelev.timer);
            delete conn.shawaza[id];
        } else {
            gamelev.attempts -= 1;
            if (gamelev.attempts > 0) {
                conn.sendButton(m.chat, `❌ إجابة خاطئة، تبقى ${gamelev.attempts} محاولات 🧞`, wm, img, null, null, null, m);
            } else {
                global.db.data.users[m.sender].exp = (global.db.data.users[m.sender].exp || 0) - point;
                conn.sendButton(m.chat, `❌ انتهت محاولاتك! الإجابة الصحيحة: ${Answer}`, wm, img, [['العب مجددا', '.المليون']], null, null, m);
                clearTimeout(gamelev.timer);
                delete conn.shawaza[id];
            }
        }
    }
};

handler.help = ['المليون'];
handler.tags = ['game'];
handler.command = /^(المليون|answer1)$/i;

export default handler;
