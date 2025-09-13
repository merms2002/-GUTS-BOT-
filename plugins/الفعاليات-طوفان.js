let floodState = {} // تخزين حالات الغرف
let toM = u => '@' + u.split('@')[0]

const createRoom = async (chatId, conn) => {
    if (floodState[chatId]) {
        await conn.sendMessage(chatId, { text: "*🚫 هناك غرفة طوفان نشطة بالفعل. استخدم .حذفف لإزالتها.*" })
        return
    }

    floodState[chatId] = {
        players: [],
        active: false,
        word: null,
        survivors: []
    }

    await conn.sendMessage(chatId, { text: "*✅ تم إنشاء غرفة الطوفان! استخدم .دخول للانضمام.*" })
}

const joinRoom = async (chatId, conn, sender) => {
    let game = floodState[chatId]
    if (!game) return await conn.sendMessage(chatId, { text: "*❌ لا توجد غرفة نشطة. استخدم .طوفان لإنشاء واحدة.*" })
    if (game.active) return await conn.sendMessage(chatId, { text: "*🚫 لا يمكنك الدخول أثناء الجولة!*" })
    if (game.players.includes(sender)) return await conn.sendMessage(chatId, { text: "*❗ أنت بالفعل داخل الغرفة.*" })

    game.players.push(sender)
    await conn.sendMessage(chatId, { text: `✅ تم انضمام ${toM(sender)} إلى غرفة الطوفان.`, mentions: [sender] })
}

const startGame = async (chatId, conn) => {
    let game = floodState[chatId]
    if (!game) return await conn.sendMessage(chatId, { text: "*❌ لا توجد غرفة نشطة. استخدم .طوفان لإنشاء واحدة.*" })
    if (game.active) return await conn.sendMessage(chatId, { text: "*🚫 الجولة بدأت بالفعل!*" })
    if (game.players.length < 6) return await conn.sendMessage(chatId, { text: "*❗ يجب أن يكون هناك 6 لاعبين على الأقل لبدء الجولة.*" })

    const word = ['نجاة', 'قارب', 'مطر', 'سباحة', 'بحر'].sort(() => 0.5 - Math.random())[0]
    game.word = word
    game.active = true
    game.survivors = []

    await conn.sendMessage(chatId, {
        text: `🌊 *الطوفان قادم!*  
اللاعبون:
${game.players.map(toM).join('\n')}

✍️ اكتبوا الكلمة: *"${word}"* خلال **10 ثوانٍ** للبقاء على قيد الحياة.`,
        mentions: game.players
    })

    setTimeout(async () => {
        let drowned = game.players.filter(p => !game.survivors.includes(p))

        if (drowned.length === 0) {
            await conn.sendMessage(chatId, { text: "🎉 الجميع نجا! أحسنتم!" })
        } else {
            await conn.sendMessage(chatId, {
                text: `💀 *غرقى الطوفان:*  
${drowned.map(toM).join('\n')}  
حظًا أوفر!`,
                mentions: drowned
            })
        }

        // إعادة تعيين الغرفة
        delete floodState[chatId]
    }, 10000)
}

const deleteRoom = async (chatId, conn) => {
    if (!floodState[chatId]) return await conn.sendMessage(chatId, { text: "*❌ لا توجد غرفة طوفان لحذفها.*" })
    delete floodState[chatId]
    await conn.sendMessage(chatId, { text: "*🗑️ تم حذف غرفة الطوفان.*" })
}

// يراقب من كتب كلمة النجاة
const before = async (m, { conn }) => {
    const chatId = m.chat
    const sender = m.sender
    const game = floodState[chatId]

    if (!game?.active) return
    if (!game.players.includes(sender)) return
    if (game.survivors.includes(sender)) return
    if (!m.text) return

    if (m.text.trim() === game.word) {
        game.survivors.push(sender)
        await conn.sendMessage(chatId, {
            text: `✅ ${toM(sender)} نجا من الطوفان!`,
            mentions: [sender]
        })
    }
}

const handler = async (m, { conn, command }) => {
    const chatId = m.chat
    const sender = m.sender

    if (command === 'طوفان') {
        await createRoom(chatId, conn)
    } else if (command === 'دخول') {
        await joinRoom(chatId, conn, sender)
    } else if (command === 'بدء') {
        await startGame(chatId, conn)
    } else if (command === 'حذفف') {
        await deleteRoom(chatId, conn)
    }
}

handler.before = before
handler.help = ['طوفان', 'دخول', 'بدء', 'حذفف']
handler.tags = ['game']
handler.command = /^(طوفان|دخول|بدء|حذفف)$/i
handler.group = true

export default handler
