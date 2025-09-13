let toM = a => '@' + a.split('@')[0]
let criminalGame = {}

async function createRoom(chat, conn) {
    if (criminalGame[chat]) return conn.sendMessage(chat, { text: '🚫 هناك غرفة نشطة بالفعل. استخدم .حذفف لحذفها.' })
    criminalGame[chat] = {
        players: [],
        started: false,
        criminal: null,
        detective: null,
    }
    return conn.sendMessage(chat, { text: '✅ تم إنشاء غرفة "المجرم الغامض"! استخدم .دخول للانضمام.' })
}

async function joinRoom(chat, conn, sender) {
    let game = criminalGame[chat]
    if (!game) return conn.sendMessage(chat, { text: '❌ لا توجد غرفة نشطة. استخدم .مجرم لإنشاء واحدة.' })
    if (game.started) return conn.sendMessage(chat, { text: '🚫 اللعبة بدأت بالفعل.' })
    if (game.players.includes(sender)) return conn.sendMessage(chat, { text: '❗ أنت بالفعل ضمن اللاعبين.' })

    game.players.push(sender)
    return conn.sendMessage(chat, { text: `✅ تم انضمام ${toM(sender)} إلى الغرفة.`, mentions: [sender] })
}

async function startGame(chat, conn) {
    let game = criminalGame[chat]
    if (!game) return conn.sendMessage(chat, { text: '❌ لا توجد غرفة نشطة.' })
    if (game.started) return conn.sendMessage(chat, { text: '🚫 اللعبة بدأت مسبقًا.' })
    if (game.players.length < 4) return conn.sendMessage(chat, { text: '❗ تحتاج إلى 4 لاعبين على الأقل لبدء اللعبة.' })

    let ps = [...game.players]
    game.criminal = ps.splice(Math.floor(Math.random() * ps.length), 1)[0]
    do game.detective = ps[Math.floor(Math.random() * ps.length)]
    while (game.detective === game.criminal)

    game.started = true

    await conn.sendMessage(chat, {
        text: `🕵️‍♂️ *لعبة المجرم الغامض!*  
🚨 جريمة وقعت بينكم!  
👮 *المحقق:* ${toM(game.detective)}  
🔎 عليه التحقيق ومعرفة من هو المجرم!  
😈 *إذا لم يتم كشف المجرم، يفوز المجرم!*`,
        mentions: [game.detective]
    })

    // رسالة خاصة للمجرم
    setTimeout(() => {
        conn.sendMessage(game.criminal, {
            text: `😈 *أنت المجرم!*  
🤫 تمويهك هو سلاحك. لا تدعهم يكتشفونك!`
        }, { quoted: { key: { remoteJid: chat, fromMe: false } } })
    }, 2000)
}

async function deleteRoom(chat, conn) {
    if (!criminalGame[chat]) return conn.sendMessage(chat, { text: '❌ لا توجد غرفة نشطة لحذفها.' })
    delete criminalGame[chat]
    return conn.sendMessage(chat, { text: '🗑️ تم حذف غرفة المجرم الغامض.' })
}

const handler = async (m, { conn, command }) => {
    let chat = m.chat
    let sender = m.sender

    if (command === 'مجرم') await createRoom(chat, conn)
    if (command === 'دخول') await joinRoom(chat, conn, sender)
    if (command === 'بدء') await startGame(chat, conn)
    if (command === 'حذفف') await deleteRoom(chat, conn)
}

handler.help = ['مجرم', 'دخول', 'بدء', 'حذفف']
handler.tags = ['game']
handler.command = /^(مجرم|دخول|بدء|حذفف)$/i
handler.group = true

export default handler
