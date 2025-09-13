import fetch from 'node-fetch';

const gameDuration = 60000;

const poin = 500;

const game = '.ون-بيس';

const botname = `${global.gt}`; // متغير لتخزين اسم البوت

export async function handler(m, { command, text, conn }) {

    let id = m.chat;

    conn.tebakGame = conn.tebakGame ? conn.tebakGame : {};

    let currentGame = conn.tebakGame[id];

    let src = await (await fetch('https://gist.githubusercontent.com/owjdkdjxuwbnd/ce86d505436dd43bd42a308385264afa/raw/908191de60cc9959332abec98acb8f83cf57b0e4/gistfile1.txt')).json();

    let poster = 'https://files.catbox.moe/1o5oud.jpg';

    if (!src || src.length === 0) {

        return conn.reply(m.chat, '> *◞⚠️◜ لا تـوجـد أسـئـلـة مـتـاحـة فـي الـوقـت الـحـالـي.*', m);

    }

    if (currentGame) {

        if (!text) {

            return conn.reply(m.chat, `> *◞❕◜ هـنـاك لـعـبـة قـيـد الـتـشـغـيـل.*`, m);

        } else if (text === currentGame[1].name) {

            m.react('✅');

            global.db.data.users[m.sender].exp += poin;

            conn.sendButton(m.chat, `> *◞🎊◜ مـبـارك لـقـد ربـحـت حـصـلـت عـلـي: ${poin}ريـال💰*`, `> ${botname}`, poster, [[`↬⌯الـمــ↪️ـزيـد‹◝`, `${game}`]], null, null);

            clearTimeout(currentGame[3]);

            delete conn.tebakGame[id];

        } else if (text === 'انسحب') {

            clearTimeout(currentGame[3]);

            conn.sendButton(m.chat, `> *◞😂◜ تـم الانـسـحـاب بـنـجـاح ايـهـا الـفـاشـل الاجـابـة كـانـت: ${currentGame[1].name}*`, `> ${botname}`, poster, [[`↬⌯الـمــ↪️ـزيـد‹◝`, `${game}`]], null, null);

            delete conn.tebakGame[id];

        } else {

            clearTimeout(currentGame[3]);

            m.react('❌');

            conn.sendButton(m.chat, `> *◞❌◜ الاجـابـة  خـاطـئـه الاجـابـه الـصـحـيحه كـانـت : ${currentGame[1].name}*`, `> ${botname}`, poster, [[`↬⌯الـمــ↪️ـزيـد‹◝`, `${game}`]], null, null);

            delete conn.tebakGame[id];

        }

    } else {

        if (!text) {

            let question = src[Math.floor(Math.random() * src.length)];

            let options = [question.name];

            while (options.length < 4) {

                let option = src[Math.floor(Math.random() * src.length)].name;

                if (!options.includes(option)) {

                    options.push(option);

                }

            }

            options = options.sort(() => Math.random() - 0.5);

            conn.tebakGame[id] = [m, question, 10, setTimeout(() => {

                delete conn.tebakGame[id];

                conn.sendButton(m.chat, `> *◞⏰  ◜انـتـهـي وقـت الـعـبـة الاجـابـة كـانـت: ${question.name}*`, `> ${botname}`, poster, [[`↬⌯الـمــ↪️ـزيـد‹◝`, `${game}`]], null, null);

            }, gameDuration)];

            let message = `

> ‹◝خـمـن شـخـصـيـة ون بيس↬

*┐┈─๋︩︪──๋︩︪─═⊐‹🍦›⊏═─๋︩︪──๋︩︪─┈┌*

> *↬⌯وقـت الاجــ⏳ـابـة ${(gameDuration / 1000).toFixed(2)}*

> *↬⌯الـجـائـ🎁ـزة: 50 نـقـاط خـبـره*

> *للانـسـحـاب اضـغـط عـلـى زر ◞انـسـحـب›*

*┘┈─๋︩︪──๋︩︪─═⊐‹🍦›⊏═─๋︩︪──๋︩︪─┈└*

`;

            if (question.img) {

                await conn.sendButton(m.chat, message, `> ${botname}`, question.img, [[`①: ${options[0]}`, `${game} ${options[0]}`], [`②: ${options[1]}`, `${game} ${options[1]}`], [`③: ${options[2]}`, `${game} ${options[2]}`], [`④:${options[3]}`, `${game} ${options[3]}`], [`◞انـسـحـاب🏃‍♂️◜`, `${game} انسحب`]], null, null);

            } 

        } else {

            m.react('👇🏻');

            conn.sendButton(m.chat, `> *لـقـد انـتـهـت الـعـبـة ◞❕◜*`, `> ${botname}`, poster, [[`↬⌯الـمــ↪️ـزيـد‹◝`, `${game}`]], null, null);

        }

    }

}

handler.help = ['سيارات'];

handler.tags = ['العاب'];

handler.command = ['ون-بيس'];

export default handler;