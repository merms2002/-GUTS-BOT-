let toM = a => '@' + a.split('@')[0]

global.spyGame = {}


function joinGame(m, { participant }) {
    let chatId = m.chat
    if (!global.spyGame[chatId]) global.spyGame[chatId] = { players: [] }
    
    let game = global.spyGame[chatId]

    if (game.players.includes(participant)) return m.reply('✅ لقد انضممت بالفعل إلى اللعبة!')
    
    game.players.push(participant)
    m.reply(`🎉 *${toM(participant)}* انضم إلى اللعبة! ✨\n📢 عدد اللاعبين الحالي: *${game.players.length}* / 6`, null, { mentions: [participant] })
    
    if (game.players.length === 6) startGame(m, chatId)
}


function startGame(m, chatId) {
    let game = global.spyGame[chatId]
    if (game.players.length < 6) return

    let players = [...game.players]
    let spy = players[Math.floor(Math.random() * players.length)]
    
    let fruits = ['🍎 تفاحة', '🍌 موز', '🍓 فراولة', '🍉 بطيخ', '🍇 عنب']
    let selectedFruit = fruits[Math.floor(Math.random() * fruits.length)]

    players.forEach(player => {
        let message = (player === spy) ? 
            `🤫 *أنت الجاسوس!* لا تملك أي فاكهة، حاول التظاهر بأنك تعرفها!` : 
            `🍏 *فاكهتك هي:* ${selectedFruit}\n🤐 لا تخبر أحدًا، وحاول كشف الجاسوس!`
        
        setTimeout(() => {
            m.conn.sendMessage(player, { text: message }, { quoted: m })
        }, 1000)
    })

    m.reply(`🎭 *لعبة الجاسوس والفواكه!* 🎭\n\n🍎 هناك *6 متسابقين* في اللعبة!\n🔍 5 منهم لديهم نفس الفاكهة، لكن واحد منهم هو *الجاسوس!* 🤫\n\n🎙️ سيتم اختيار اثنين في كل جولة لطرح الأسئلة على بعضهم البعض!\n🕵️ الهدف: كشف الجاسوس قبل فوات الأوان!\n\n🔔 *البداية الآن...*`, null, { mentions: players })

    game.players = players
    game.spy = spy
    game.votes = {}

    setTimeout(() => startQuestionRound(m, chatId), 5000)
}


function startQuestionRound(m, chatId) {
    let game = global.spyGame[chatId]
    if (!game || game.players.length < 2) return

    let shuffledPlayers = [...game.players].sort(() => Math.random() - 0.5)
    let p1 = shuffledPlayers[0], p2 = shuffledPlayers[1]

    m.reply(`🤔 *جولة الأسئلة!* 🤔\n\n🎤 *${toM(p1)}* يسأل *${toM(p2)}* عن الفاكهة!\n🎤 *${toM(p2)}* يسأل *${toM(p1)}* عن الفاكهة!\n\n🧐 حاولوا استنتاج من هو الجاسوس!`, null, {
        mentions: [p1, p2]
    })

    setTimeout(() => startVoting(m, chatId), 20000)
}


function startVoting(m, chatId) {
    let game = global.spyGame[chatId]
    if (!game || game.players.length < 2) return

    let buttonOptions = game.players.map(player => ({ buttonId: `vote_${player}`, buttonText: { displayText: toM(player) }, type: 1 }))
    let message = {
        text: '🗳️ *حان وقت التصويت!* 🗳️\n\n👀 من تعتقد أنه الجاسوس؟ اختر الشخص الذي تشك فيه:',
        buttons: buttonOptions,
        headerType: 1,
        mentions: game.players
    }
    
    m.conn.sendMessage(m.chat, message, { quoted: m })
}


handler.before = async function(m) {
    if (!m.isGroup || !m.message?.buttonsResponseMessage?.selectedButtonId?.startsWith('vote_')) return
    let chatId = m.chat
    let game = global.spyGame[chatId]
    if (!game) return

    let votedUser = m.message.buttonsResponseMessage.selectedButtonId.split('_')[1]

    if (!game.votes) game.votes = {}
    game.votes[votedUser] = (game.votes[votedUser] || 0) + 1

    setTimeout(() => checkVotes(m, chatId), 10000)
}

 
function checkVotes(m, chatId) {
    let game = global.spyGame[chatId]
    if (!game || game.players.length < 2) return

    let highestVote = Object.entries(game.votes).sort((a, b) => b[1] - a[1])[0]
    let eliminated = highestVote[0]

    m.reply(`🚨 *التصويت انتهى!* 🚨\n\n👤 اللاعب الذي حصل على أكبر عدد من الأصوات هو *${toM(eliminated)}*\n\n⌛ سيتم استبعاده الآن...`, null, {
        mentions: [eliminated]
    })

    setTimeout(() => {
        game.players = game.players.filter(p => p !== eliminated)

        if (eliminated === game.spy) {
            m.reply(`🎉 *تم كشف الجاسوس!* 🎉\n\n🔎 *${toM(eliminated)}* كان هو الجاسوس!\n🏆 *الفائزون:* جميع اللاعبين الآخرين!`, null, {
                mentions: game.players
            })
            delete global.spyGame[chatId]
        } else {
            m.reply(`❌ *خطأ!* ❌\n\n😈 *${toM(eliminated)}* لم يكن الجاسوس!\n\n📢 *اللعبة مستمرة...*`, null, {
                mentions: game.players
            })

            if (game.players.length > 2) {
                setTimeout(() => startQuestionRound(m, chatId), 5000)
            } else {
                m.reply(`🎭 *انتهت اللعبة!* 🎭\n\n😈 *الجاسوس فاز، لأن اثنين فقط تبقوا ولم يتم كشفه!*`, null, {
                    mentions: game.players
                })
                delete global.spyGame[chatId]
            }
        }
    }, 5000)
}

handler.help = ['spyfruit']
handler.tags = ['fun', 'game']
handler.command = ['الجاسوس', 'الجاسوس_الفاكهي', 'دخول']
handler.group = true


handler.before = async function (m) {
    if (m.text.toLowerCase() === 'دخول') {
        joinGame(m, { participant: m.sender })
    }
}

export default handler
