let gameState = {};

const createRoom = async (chatId, conn) => {
    if (gameState[chatId]) {
        await conn.sendMessage(chatId, { text: "*يوجد بالفعل غرفة نشطة. استخدم أمر .حذف لحذفها.*" });
        return;
    }

    gameState[chatId] = {
        players: [],
        started: false,
        killer: null,
        alive: []
    };

    await conn.sendMessage(chatId, { text: "*تم إنشاء الغرفة بنجاح! استخدم أمر .دخول للانضمام.*" });
};

const joinRoom = async (chatId, conn, sender) => {
    if (!gameState[chatId]) {
        await conn.sendMessage(chatId, { text: "*لا توجد غرفة نشطة حالياً. استخدم أمر .القاتل لإنشاء غرفة.*" });
        return;
    }

    if (gameState[chatId].players.includes(sender)) {
        await conn.sendMessage(chatId, { text: "*أنت بالفعل في الغرفة!*" });
        return;
    }

    gameState[chatId].players.push(sender);
    await conn.sendMessage(chatId, { text: `*تم انضمام @${sender.split('@')[0]} إلى الغرفة.*`, mentions: [sender] });
};

const startGame = async (chatId, conn) => {
    if (!gameState[chatId]) {
        await conn.sendMessage(chatId, { text: "*لا توجد غرفة نشطة حالياً. استخدم أمر .القاتل لإنشاء غرفة.*" });
        return;
    }

    if (gameState[chatId].players.length < 4) {
        await conn.sendMessage(chatId, { text: "*يجب أن يكون هناك 4 لاعبين على الأقل لبدء اللعبة!*" });
        return;
    }

    let players = gameState[chatId].players;
    gameState[chatId].killer = players[Math.floor(Math.random() * players.length)];
    gameState[chatId].alive = [...players];

        
    await conn.sendMessage(gameState[chatId].killer, { text: "🔪 *أنت القاتل المتسلسل!* اقتل اللاعبين واحدًا تلو الآخر دون أن يتم كشفك!" });

    await conn.sendMessage(chatId, { text: "🎭 *لعبة القاتل المتسلسل بدأت!* 🎭\n\n🔪 هناك قاتل بيننا، لكنه مختبئ! 😱 كل جولة، سيتم قتل لاعب، وبعدها تصويت لكشف القاتل!" });

    setTimeout(() => nextRound(chatId, conn), 30000); // بدء أول جولة بعد 30 ثانية
};

const nextRound = async (chatId, conn) => {
    if (!gameState[chatId] || gameState[chatId].alive.length <= 2) {
        await endGame(chatId, conn);
        return;
    }

    let killer = gameState[chatId].killer;
    let victims = gameState[chatId].alive.filter(p => p !== killer);
    let victim = victims[Math.floor(Math.random() * victims.length)];

    gameState[chatId].alive = gameState[chatId].alive.filter(p => p !== victim);

    await conn.sendMessage(chatId, { text: `☠️ *تم قتل @${victim.split('@')[0]}!*` , mentions: [victim] });

    if (gameState[chatId].alive.length <= 2) {
        await endGame(chatId, conn);
        return;
    }

    await conn.sendMessage(chatId, { text: "🗳️ الآن، عليكم التصويت لطرد من تعتقدون أنه القاتل! 😏" });

    setTimeout(() => nextRound(chatId, conn), 30000); // جولة جديدة بعد 30 ثانية
};

const endGame = async (chatId, conn) => {
    if (!gameState[chatId]) return;

    let killer = gameState[chatId].killer;
    let isKillerCaught = gameState[chatId].alive.includes(killer);

    await conn.sendMessage(chatId, {
        text: `🎭 *انتهت اللعبة!*  
        🔪 القاتل كان: @${killer.split('@')[0]}  
        ${isKillerCaught ? "😈 لقد تم كشفه! فاز الناجون! 🎉" : "☠️ القاتل فاز بقتل الجميع! 🔪🔥"}`
    , mentions: [killer] });

    delete gameState[chatId];
};

const deleteRoom = async (chatId, conn) => {
    if (gameState[chatId]) {
        delete gameState[chatId];
        await conn.sendMessage(chatId, { text: "*تم حذف الغرفة.*" });
    } else {
        await conn.sendMessage(chatId, { text: "*لا توجد غرفة نشطة حالياً.*" });
    }
};

const handler = async (m, { conn, command }) => {
    const chatId = m.chat;
    const sender = m.sender;

    if (command === 'القاتل') {
        await createRoom(chatId, conn);
    } else if (command === 'دخول') {
        await joinRoom(chatId, conn, sender);
    } else if (command === 'بدء') {
        await startGame(chatId, conn);
    } else if (command === 'حذف') {
        await deleteRoom(chatId, conn);
    }
};

handler.help = ['القاتل', 'دخول', 'بدء', 'حذف'];
handler.tags = ['game'];
handler.command = /^(قاتل|دخول|بدء|حذف)$/i;

export default handler;
