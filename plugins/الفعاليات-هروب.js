let gameState = {};

const createRoom = async (chatId, conn) => {
    if (gameState[chatId]) {
        await conn.sendMessage(chatId, { text: "⚠️ *هناك بالفعل غرفة نشطة! استخدم .حذف لحذفها.*" });
        return;
    }

    gameState[chatId] = {
        players: [],
        roles: {},
        phase: "waiting",
        moves: []
    };

    await conn.sendMessage(chatId, { text: "✅ *تم إنشاء غرفة الهروب! استخدم .دخول للانضمام.*" });
};

const joinRoom = async (chatId, conn, sender) => {
    if (!gameState[chatId]) {
        await conn.sendMessage(chatId, { text: "⚠️ *لا توجد غرفة نشطة! استخدم .هروب لإنشاء غرفة.*" });
        return;
    }

    if (gameState[chatId].players.includes(sender)) {
        await conn.sendMessage(chatId, { text: "⚠️ *أنت بالفعل في الغرفة!*" });
        return;
    }

    gameState[chatId].players.push(sender);
    await conn.sendMessage(chatId, { text: `➕ *تم انضمام @${sender.split('@')[0]} إلى الغرفة!*`, mentions: [sender] });
};

const assignRoles = (players) => {
    let roles = {};
    let shuffled = players.sort(() => Math.random() - 0.5);

    roles[shuffled[0]] = "حارس";
    shuffled.slice(1).forEach(player => {
        roles[player] = "سجين";
    });

    return roles;
};

const startGame = async (chatId, conn) => {
    if (!gameState[chatId]) {
        await conn.sendMessage(chatId, { text: "⚠️ *لا توجد غرفة نشطة! استخدم .هروب لإنشاء غرفة.*" });
        return;
    }

    if (gameState[chatId].players.length < 4) {
        await conn.sendMessage(chatId, { text: "⚠️ *يجب أن يكون هناك 4 لاعبين على الأقل لبدء اللعبة!*" });
        return;
    }

    gameState[chatId].roles = assignRoles(gameState[chatId].players);
    gameState[chatId].phase = "planning";

    for (let player of gameState[chatId].players) {
        let role = gameState[chatId].roles[player];
        await conn.sendMessage(player, { text: `🎭 *دورك في اللعبة:* ${role}` });
    }

    await conn.sendMessage(chatId, { text: "📜 *بدأت مرحلة التخطيط! على السجناء وضع خطة للهروب، والحارس يحاول كشفهم!*" });
};

const makeMove = async (chatId, conn, sender, move) => {
    if (!gameState[chatId] || gameState[chatId].phase !== "planning") {
        await conn.sendMessage(chatId, { text: "⚠️ *لا يمكنك التحرك الآن!*" });
        return;
    }

    gameState[chatId].moves.push({ player: sender, move });

    if (gameState[chatId].moves.length >= gameState[chatId].players.length - 1) {
        gameState[chatId].phase = "action";
        executePlan(chatId, conn);
    }
};

const executePlan = async (chatId, conn) => {
    let success = Math.random() > 0.5;
    let guard = Object.keys(gameState[chatId].roles).find(player => gameState[chatId].roles[player] === "حارس");

    if (success) {
        await conn.sendMessage(chatId, { text: "🎉 *السجناء نجحوا في الهروب! 🏃‍♂️💨*" });
    } else {
        await conn.sendMessage(chatId, { text: `🚨 *الحارس @${guard.split('@')[0]} أوقف الهروب!*`, mentions: [guard] });
    }

    delete gameState[chatId];
};

const deleteRoom = async (chatId, conn) => {
    if (gameState[chatId]) {
        delete gameState[chatId];
        await conn.sendMessage(chatId, { text: "🗑️ *تم حذف الغرفة!*" });
    } else {
        await conn.sendMessage(chatId, { text: "⚠️ *لا توجد غرفة نشطة!*" });
    }
};

const handler = async (m, { conn, command, args }) => {
    const chatId = m.chat;
    const sender = m.sender;

    if (command === 'هروب') {
        await createRoom(chatId, conn);
    } else if (command === 'دخول') {
        await joinRoom(chatId, conn, sender);
    } else if (command === 'بدء') {
        await startGame(chatId, conn);
    } else if (command === 'تحرك') {
        let move = args.join(" ");
        if (!move) {
            await conn.sendMessage(chatId, { text: "⚠️ *يجب عليك كتابة خطتك!* مثال: .تحرك عبر النفق" });
            return;
        }
        await makeMove(chatId, conn, sender, move);
    } else if (command === 'حذف') {
        await deleteRoom(chatId, conn);
    }
};

handler.help = ['هروب', 'دخول', 'بدء', 'تحرك <خطة الهروب>', 'حذف'];
handler.tags = ['game'];
handler.command = /^(هروب|دخول|بدء|تحرك|حذف)$/i;

export default handler;
