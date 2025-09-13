let gameState = {};

const createRoom = async (chatId, conn) => {
    if (gameState[chatId]) {
        await conn.sendMessage(chatId, { text: "*يوجد بالفعل غرفة نشطة. استخدم أمر .حذفف لحذفها*" });
        return;
    }

    gameState[chatId] = {
        players: [],
        started: false,
        spy: null,
        fruit: null
    };

    await conn.sendMessage(chatId, { text: "*تم إنشاء الغرفة بنجاح! استخدم أمر .دخول للانضمام*" });
};

const joinRoom = async (chatId, conn, sender) => {
    if (!gameState[chatId]) {
        await conn.sendMessage(chatId, { text: "*لا توجد غرفة نشطة حالياً. استخدم أمر .إنشاء لإنشاء غرفة*" });
        return;
    }

    if (gameState[chatId].players.includes(sender)) {
        await conn.sendMessage(chatId, { text: "*أنت بالفعل في الغرفة*" });
        return;
    }

    gameState[chatId].players.push(sender);
    await conn.sendMessage(chatId, { text: `*تم انضمام @${sender.split('@')[0]} إلى الغرفة*`, mentions: [sender] });
};

const startGame = async (chatId, conn) => {
    if (!gameState[chatId]) {
        await conn.sendMessage(chatId, { text: "*لا توجد غرفة نشطة حالياً. استخدم أمر .إنشاء لإنشاء غرفة*" });
        return;
    }

    if (gameState[chatId].players.length < 6) {
        await conn.sendMessage(chatId, { text: "*يجب أن يكون هناك 6 لاعبين على الأقل لبدء اللعبة*" });
        return;
    }

    let players = gameState[chatId].players;
    gameState[chatId].spy = players[Math.floor(Math.random() * players.length)];

    let fruits = ['🍎 تفاحة', '🍌 موز', '🍓 فراولة', '🍉 بطيخ', '🍇 عنب'];
    gameState[chatId].fruit = fruits[Math.floor(Math.random() * fruits.length)];

    for (let player of players) {
        let message = (player === gameState[chatId].spy) ? 
            `🤫 *أنت الجاسوس!* لا تملك أي فاكهة، حاول التظاهر بأنك تعرفها!` : 
            `🍏 *فاكهتك هي:* ${gameState[chatId].fruit}\n🤐 لا تخبر أحدًا، وحاول كشف الجاسوس!`;
        await conn.sendMessage(player, { text: message }, { quoted: { key: { fromMe: false, remoteJid: chatId } } });
    }

    await conn.sendMessage(chatId, { text: "🎭 *لعبة الجاسوس والفواكه بدأت!* 🎭\n\n🔎 5 لاعبين لديهم نفس الفاكهة، وواحد هو الجاسوس!" });
};

const deleteRoom = async (chatId, conn) => {
    if (gameState[chatId]) {
        delete gameState[chatId];
        await conn.sendMessage(chatId, { text: "*تم حذف الغرفة*" });
    } else {
        await conn.sendMessage(chatId, { text: "*لا توجد غرفة نشطة حالياً*" });
    }
};

const handler = async (m, { conn, command }) => {
    const chatId = m.chat;
    const sender = m.sender;

    if (command === 'الجاسوس') {
        await createRoom(chatId, conn);
    } else if (command === 'دخول') {
        await joinRoom(chatId, conn, sender);
    } else if (command === 'بدء') {
        await startGame(chatId, conn);
    } else if (command === 'حذف') {
        await deleteRoom(chatId, conn);
    }
};

handler.help = ['الجاسوس', 'دخول', 'بدء', 'حذفف'];
handler.tags = ['game'];
handler.command = /^(الجاسوس|دخول|بدء|حذفف)$/i;

export default handler;
