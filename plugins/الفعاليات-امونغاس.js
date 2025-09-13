// لعبة أمونغ أس لواتساب - تعتمد على Baileys

let toM = a => '@' + a.split('@')[0]
let amongUsGames = {}

const colors = ['🔴 أحمر', '🔵 أزرق', '🟢 أخضر', '🟡 أصفر', '🟣 بنفسجي', '🟤 بني']

async function createRoom(chat, conn) {
    if (amongUsGames[chat]) return conn.sendMessage(chat, { text: '🚫 هناك غرفة نشطة بالفعل. استخدم .حذفف لحذفها.' })
    amongUsGames[chat] = {
        players: [],
        started: false,
        round: 0,
        impostor: null,
        alive: [],
        colorsMap: {},
        votes: {},
    }
    return conn.sendMessage(chat, { text: '✅ تم إنشاء غرفة "أمونغ أس"! استخدم .دخول للانضمام. تحتاج 6 لاعبين.' })
}

async function joinRoom(chat, conn, sender) {
    let game = amongUsGames[chat]
    if (!game) return conn.sendMessage(chat, { text: '❌ لا توجد غرفة نشطة. استخدم .امونغ لإنشاء واحدة.' })
    if (game.started) return conn.sendMessage(chat, { text: '🚫 اللعبة بدأت بالفعل.' })
    if (game.players.includes(sender)) return conn.sendMessage(chat, { text: '❗ أنت بالفعل ضمن اللاعبين.' })
    if (game.players.length >= 6) return conn.sendMessage(chat, { text: '❗ الغرفة ممتلئة. الحد الأقصى 6 لاعبين.' })

    game.players.push(sender)
    return conn.sendMessage(chat, { text: `✅ انضم ${toM(sender)} إلى اللعبة.`, mentions: [sender] })
}

async function startGame(chat, conn) {
    let game = amongUsGames[chat]
    if (!game) return conn.sendMessage(chat, { text: '❌ لا توجد غرفة نشطة.' })
    if (game.started) return conn.sendMessage(chat, { text: '🚫 اللعبة بدأت مسبقًا.' })
    if (game.players.length !== 6) return conn.sendMessage(chat, { text: '❗ تحتاج إلى 6 لاعبين لبدء اللعبة.' })

    let shuffled = [...game.players].sort(() => Math.random() - 0.5)
    game.impostor = shuffled[0]
    game.alive = [...game.players]
    game.started = true
    shuffled.forEach((p, i) => game.colorsMap[p] = colors[i])

    await conn.sendMessage(chat, {
        text: `🎮 *بدأت لعبة أمونغ أس!* 🎮\n\n👥 اللاعبون: \n${game.players.map(p => `${toM(p)} - ${game.colorsMap[p]}`).join('\n')}\n\n🔍 سيتم اختيار جاسوس عشوائي، وستبدأ الجولات الآن!`,
        mentions: game.players
    })

    // إخطار الجاسوس
    await conn.sendMessage(game.impostor, {
        text: `🤫 *أنت الجاسوس!*\n🩸 اقتل اللاعبين دون أن يتم كشفك في التصويت.`
    })

    nextRound(chat, conn)
}

async function nextRound(chat, conn) {
    let game = amongUsGames[chat]
    if (!game || !game.started) return
    game.round++

    if (game.round > 4 || game.alive.length <= 2) {
        // نهاية اللعبة
        if (game.alive.includes(game.impostor)) {
            await conn.sendMessage(chat, { text: `😈 *الجاسوس فاز!* لقد نجا حتى النهاية.` })
        } else {
            await conn.sendMessage(chat, { text: `🎉 *الطاقم فاز!* تم اكتشاف الجاسوس.` })
        }
        delete amongUsGames[chat]
        return
    }

    // القتل العشوائي
    let victims = game.alive.filter(p => p !== game.impostor)
    let killed = victims[Math.floor(Math.random() * victims.length)]
    game.alive = game.alive.filter(p => p !== killed)

    await conn.sendMessage(chat, {
        text: `💥 *جولة ${game.round}* \n📢 تم اكتشاف جثة أحد اللاعبين!\n👤 المقتول: ${toM(killed)} - ${game.colorsMap[killed]}\n\n🗳️ *صوّت على من تعتقد أنه الجاسوس:*`,
        mentions: [killed, ...game.alive],
        buttons: game.alive.map(p => ({ buttonId: `.تصويت ${p}`, buttonText: { displayText: `${toM(p)} - ${game.colorsMap[p]}` }, type: 1 }))
    })
}

async function votePlayer(chat, conn, sender, voteId) {
    let game = amongUsGames[chat]
    if (!game || !game.started || !game.alive.includes(sender)) return
    if (!game.alive.includes(voteId)) return conn.sendMessage(chat, { text: '❌ لا يمكنك التصويت لهذا اللاعب.' })

    game.votes[sender] = voteId

    // إذا صوّت الجميع
    if (Object.keys(game.votes).length >= game.alive.length) {
        let count = {}
        for (let v of Object.values(game.votes)) count[v] = (count[v] || 0) + 1
        let votedOut = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0]
        game.votes = {}

        game.alive = game.alive.filter(p => p !== votedOut)

        await conn.sendMessage(chat, {
            text: `🗳️ تم طرد ${toM(votedOut)} - ${game.colorsMap[votedOut]} من اللعبة.\n${votedOut === game.impostor ? '😱 لقد كان هو الجاسوس!' : '😐 لم يكن هو الجاسوس...'}\n\n🎮 الانتقال إلى الجولة التالية...`,
            mentions: [votedOut]
        })

        if (votedOut === game.impostor) {
            await conn.sendMessage(chat, { text: `🎉 *الطاقم فاز!* تم اكتشاف الجاسوس.` })
            delete amongUsGames[chat]
            return
        }

        setTimeout(() => nextRound(chat, conn), 3000)
    }
}

async function deleteRoom(chat, conn) {
    if (!amongUsGames[chat]) return conn.sendMessage(chat, { text: '❌ لا توجد غرفة نشطة.' })
    delete amongUsGames[chat]
    return conn.sendMessage(chat, { text: '🗑️ تم حذف غرفة اللعبة.' })
}

const handler = async (m, { conn, command, args }) => {
    let chat = m.chat
    let sender = m.sender
    if (command === 'امونغ') await createRoom(chat, conn)
    else if (command === 'دخول') await joinRoom(chat, conn, sender)
    else if (command === 'بدء') await startGame(chat, conn)
    else if (command === 'حذفف') await deleteRoom(chat, conn)
    else if (command === 'تصويت') await votePlayer(chat, conn, sender, args[0])
}

handler.help = ['امونغ', 'دخول', 'بدء', 'حذفف', 'تصويت']
handler.tags = ['game']
handler.command = /^(امونغ|دخول|بدء|حذفف|تصويت)$/i
handler.group = true

export default handler
