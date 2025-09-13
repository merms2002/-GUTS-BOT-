let agentState = {}
let toM = u => '@' + u.split('@')[0]

const createRoom = async (chatId, conn) => {
    if (agentState[chatId]) {
        await conn.sendMessage(chatId, { text: "*🚫 هناك غرفة عميل نشطة بالفعل. استخدم .حذفف لإزالتها.*" })
        return
    }

    agentState[chatId] = {
        players: [],
        started: false,
        agent: null,
        task: null
    }

    await conn.sendMessage(chatId, { text: "*✅ تم إنشاء غرفة العميل السري! استخدم .دخول للانضمام.*" })
}

const joinRoom = async (chatId, conn, sender) => {
    let game = agentState[chatId]
    if (!game) return await conn.sendMessage(chatId, { text: "*❌ لا توجد غرفة نشطة. استخدم .عميل لإنشاء واحدة.*" })
    if (game.started) return await conn.sendMessage(chatId, { text: "*🚫 لا يمكنك الدخول أثناء المهمة!*" })
    if (game.players.includes(sender)) return await conn.sendMessage(chatId, { text: "*❗ أنت بالفعل داخل الغرفة.*" })

    game.players.push(sender)
    await conn.sendMessage(chatId, { text: `✅ تم انضمام ${toM(sender)} إلى غرفة العميل السري.`, mentions: [sender] })
}

const startGame = async (chatId, conn) => {
    let game = agentState[chatId]
    if (!game) return await conn.sendMessage(chatId, { text: "*❌ لا توجد غرفة نشطة. استخدم .عميل لإنشاء واحدة.*" })
    if (game.started) return await conn.sendMessage(chatId, { text: "*🚫 المهمة بدأت بالفعل!*" })
    if (game.players.length < 3) return await conn.sendMessage(chatId, { text: "*❗ يجب أن يكون هناك 3 لاعبين على الأقل لبدء اللعبة.*" })

    const tasks = [
        "قم بإرسال 3 رسائل غريبة ولكن لا تضحك! 😂",
        "أرسل رسالة لشخص عشوائي وقل له: 'أنا أعرف سرك!' 😈",
        "غير اسمك في المجموعة إلى شيء مضحك لمدة 10 دقائق 🤣",
        "أرسل رسالة حزينة وكأنك تعرضت للخيانة 😢",
        "أرسل 'أنا ذاهب للمهمة السرية' بدون أي تفسير 🤫",
        "أجب بـ 'نعم' على أول 3 أسئلة تُطرح عليك! 😂"
    ]

    game.agent = game.players[Math.floor(Math.random() * game.players.length)]
    game.task = tasks[Math.floor(Math.random() * tasks.length)]
    game.started = true

    await conn.sendMessage(chatId, {
        text: `🎭 *لعبة العميل السري!*  
🕵️ تم اختيار عميل سري من بينكم!  
🎯 يجب عليه تنفيذ مهمته دون أن يكتشفه أحد!  
👁️‍🗨️ هل تستطيعون كشفه؟`,
        mentions: game.players
    })

    // إرسال المهمة للعميل بشكل سري
    setTimeout(() => {
        conn.sendMessage(game.agent, {
            text: `🕵️‍♂️ *مرحبًا أيها العميل السري!*  
🔎 مهمتك: *${game.task}*  
🤫 لا تدع أحدًا يكتشفك!`
        }, { quoted: { key: { fromMe: false, remoteJid: chatId } } })
    }, 2000)
}

const deleteRoom = async (chatId, conn) => {
    if (!agentState[chatId]) return await conn.sendMessage(chatId, { text: "*❌ لا توجد غرفة عميل نشطة لحذفها.*" })
    delete agentState[chatId]
    await conn.sendMessage(chatId, { text: "*🗑️ تم حذف غرفة العميل السري.*" })
}

const handler = async (m, { conn, command }) => {
    const chatId = m.chat
    const sender = m.sender

    if (command === 'عميل') {
        await createRoom(chatId, conn)
    } else if (command === 'دخول') {
        await joinRoom(chatId, conn, sender)
    } else if (command === 'بدء') {
        await startGame(chatId, conn)
    } else if (command === 'حذفف') {
        await deleteRoom(chatId, conn)
    }
}

handler.help = ['عميل', 'دخول', 'بدء', 'حذفف']
handler.tags = ['game']
handler.command = /^(عميل|دخول|بدء|حذفف)$/i
handler.group = true

export default handler
