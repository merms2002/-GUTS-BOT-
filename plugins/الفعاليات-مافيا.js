let gameState = {};

const createRoom = async (chatId, conn) => {
    if (gameState[chatId]) {
        await conn.sendMessage(chatId, { text: "*⚠️ يوجد بالفعل غرفة نشطة! استخدم أمر .حذف لحذفها.*" });
        return;
    }

    gameState[chatId] = {
        players: [],
        started: false,
        roles: {},
        alive: [],
        phase: "waiting"
    };

    await conn.sendMessage(chatId, { text: "*✅ تم إنشاء الغرفة بنجاح! استخدم أمر .دخول للانضمام.*" });
};

const joinRoom = async (chatId, conn, sender) => {
    if (!gameState[chatId]) {
        await conn.sendMessage(chatId, { text: "*⚠️ لا توجد غرفة نشطة حالياً! استخدم أمر .مافيا لإنشاء غرفة.*" });
        return;
    }

    if (gameState[chatId].players.includes(sender)) {
        await conn.sendMessage(chatId, { text: "*⚠️ أنت بالفعل في الغرفة!*" });
        return;
    }

    gameState[chatId].players.push(sender);
    await conn.sendMessage(chatId, { text: `*➕ تم انضمام @${sender.split('@')[0]} إلى الغرفة!*`, mentions: [sender] });
};

const assignRoles = (players) => {
    let roles = {};
    let shuffled = players.sort(() => Math.random() - 0.5);

    roles[shuffled[0]] = "مافيا";
    roles[shuffled[1]] = "محقق";
    roles[shuffled[2]] = "طبيب";

    shuffled.slice(3).forEach(player => {
        roles[player] = "مدني";
    });

    return roles;
};

const startGame = async (chatId, conn) => {
    if (!gameState[chatId]) {
        await conn.sendMessage(chatId, { text: "*⚠️ لا توجد غرفة نشطة حالياً! استخدم أمر .مافيا لإنشاء غرفة.*" });
        return;
    }

    if (gameState[chatId].players.length < 5) {
        await conn.sendMessage(chatId, { text: "*⚠️ يجب أن يكون هناك 5 لاعبين على الأقل لبدء اللعبة!*" });
        return;
    }

    gameState[chatId].roles = assignRoles(gameState[chatId].players);
    gameState[chatId].alive = [...gameState[chatId].players];
    gameState[chatId].phase = "night";

    for (let player of gameState[chatId].players) {
        let role = gameState[chatId].roles[player];
        await conn.sendMessage(player, { text: `🎭 *دورك في اللعبة:* ${role}` });
    }

    await conn.sendMessage(chatId, { text: "🌙 *الليل قد حل! المافيا، المحقق، والطبيب يقومون بأدوارهم الآن...*" });

    setTimeout(() => nightPhase(chatId, conn), 30000);
};

const nightPhase = async (chatId, conn) => {
    if (!gameState[chatId] || gameState[chatId].phase !== "night") return;

    let mafia = Object.keys(gameState[chatId].roles).find(player => gameState[chatId].roles[player] === "مافيا");
    let doctor = Object.keys(gameState[chatId].roles).find(player => gameState[chatId].roles[player] === "طبيب");

    let possibleVictims = gameState[chatId].alive.filter(p => p !== mafia);
    let victim = possibleVictims[Math.floor(Math.random() * possibleVictims.length)];

    let doctorSave = Math.random() < 0.5 ? victim : null; 

    if (doctorSave === victim) {
        await conn.sendMessage(chatId, { text: "🚑 الطبيب أنقذ الضحية هذه الليلة!" });
    } else {
        gameState[chatId].alive = gameState[chatId].alive.filter(p => p !== victim);
        await conn.sendMessage(chatId, { text: `☠️ *تم قتل @${victim.split('@')[0]} خلال الليل!*`, mentions: [victim] });
    }

    gameState[chatId].phase = "day";
    await conn.sendMessage(chatId, { text: "☀️ *النهار قد حل! حان وقت التصويت لطرد المشتبه به!*" });

    setTimeout(() => dayPhase(chatId, conn), 30000);
};

const dayPhase = async (chatId, conn) => {
    if (!gameState[chatId] || gameState[chatId].phase !== "day") return;

    let remainingMafia = gameState[chatId].alive.filter(p => gameState[chatId].roles[p] === "مافيا").length;
    let remainingPlayers = gameState[chatId].alive.length;

    if (remainingMafia === 0) {
        await conn.sendMessage(chatId, { text: "🎉 *المدنيون فازوا! تم القضاء على المافيا!*" });
        delete gameState[chatId];
        return;
    }

    if (remainingMafia >= remainingPlayers / 2) {
        await conn.sendMessage(chatId, { text: "💀 *المافيا فازت! لم يتبقَ عدد كافٍ من المدنيين!*" });
        delete gameState[chatId];
        return;
    }

    gameState[chatId].phase = "night";
    await conn.sendMessage(chatId, { text: "🌙 *الليل قد حل من جديد! المافيا، المحقق، والطبيب يقومون بأدوارهم...*" });

    setTimeout(() => nightPhase(chatId, conn), 30000);
};

const deleteRoom = async (chatId, conn) => {
    if (gameState[chatId]) {
        delete gameState[chatId];
        await conn.sendMessage(chatId, { text: "*🗑️ تم حذف الغرفة.*" });
    } else {
        await conn.sendMessage(chatId, { text: "*⚠️ لا توجد غرفة نشطة حالياً!*" });
    }
};

const handler = async (m, { conn, command }) => {
    const chatId = m.chat;
    const sender = m.sender;

    if (command === 'مافيا') {
        await createRoom(chatId, conn);
    } else if (command === 'دخول') {
        await joinRoom(chatId, conn, sender);
    } else if (command === 'بدء') {
        await startGame(chatId, conn);
    } else if (command === 'حذف') {
        await deleteRoom(chatId, conn);
    }
};

handler.help = ['مافيا', 'دخول', 'بدء', 'حذف'];
handler.tags = ['game'];
handler.command = /^(مافيا|دخول|بدء|حذف)$/i;

export default handler;
