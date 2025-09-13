const palabras = ["قطة", "كلب", "عصفور", "فيل", "نمر", "حوت", "فراشة", "سلحفاة", "أرنب", "ضفدع", "أخطبوط", "سنجاب", "زرافة", "تمساح", "بطريق", "غراب", "دولفين", "أفعى", "هامستر", "بعوضة", "نحلة", "تلفاز", "كمبيوتر", "بوت", "فيسبوك", "واتساب", "إنستجرام", "تيك توك", "رئيس", "أفلام"];

const intentosMaximos = 6;

const gam = new Map();

function elegirPalabraAleatoria() {
    return palabras[Math.floor(Math.random() * palabras.length)];
}

function ocultarPalabra(palabra, letrasAdivinadas) {
    let palabraOculta = "";
    for (const letra of palabra) {
        if (letrasAdivinadas.includes(letra)) {
            palabraOculta += letra + " ";
        } else {
            palabraOculta += "_ ";
        }
    }
    return palabraOculta.trim();
}

function mostrarAhorcado(intentos) {
    const dibujo = [
        " ____",
        " |  |",
        intentos < 6 ? " |  O" : " |",
        intentos < 5 ? " | /" : intentos < 4 ? " | / " : intentos < 3 ? " | / \\" : intentos < 2 ? " | / \\" : " |",
        intentos < 2 ? "_|_" : " |",
    ];
    return dibujo.slice(0, intentosMaximos - intentos).join("\n");
}

function juegoTerminado(sender, mensaje, palabra, letrasAdivinadas, intentos) {
    if (intentos === 0) {
        gam.delete(sender);
        return `❌ لقد خسرت! الكلمة الصحيحة كانت: ${palabra}\n\n${mostrarAhorcado(intentos)}`;
    } else if (!mensaje.includes("_")) {
        let expGanada = Math.floor(Math.random() * 300);
        if (palabra.length >= 8) {
            expGanada = Math.floor(Math.random() * 3500);
        }
        global.db.data.users[sender].exp += expGanada;
        gam.delete(sender);
        return `🎉 تهانينا! لقد ربحت 🥳! لقد خمنت الكلمة "${palabra}".\n\n*لقد ربحت:* ${expGanada} نقطة خبرة.`;
    } else {
        return `${mostrarAhorcado(intentos)}\n\n${mensaje}`;
    }
}

let handler = async (m, { conn }) => {
    let users = global.db.data.users[m.sender];
    if (gam.has(m.sender)) {
        return conn.reply(m.chat, "لديك لعبة قيد التشغيل بالفعل. أكملها أولاً!", m);
    }
    let palabra = elegirPalabraAleatoria();
    let letrasAdivinadas = [];
    let intentos = intentosMaximos;
    let mensaje = ocultarPalabra(palabra, letrasAdivinadas);
    gam.set(m.sender, { palabra, letrasAdivinadas, intentos });
    let text = `🔠 خمن الكلمة:\n\n${mensaje}\n\n❗ المحاولات المتبقية: ${intentos}`;
    conn.reply(m.chat, text, m);
};

handler.before = async (m, { conn }) => {
    let users = global.db.data.users[m.sender];
    let juego = gam.get(m.sender);
    if (!juego) return;
    let { palabra, letrasAdivinadas, intentos } = juego;
    if (m.text.length === 1 && m.text.match(/[a-zA-Zء-ي]/)) {
        let letra = m.text.toLowerCase();
        if (!letrasAdivinadas.includes(letra)) {
            letrasAdivinadas.push(letra);
            if (!palabra.includes(letra)) {
                intentos--;
            }
        }
        let mensaje = ocultarPalabra(palabra, letrasAdivinadas);
        let respuesta = juegoTerminado(m.sender, mensaje, palabra, letrasAdivinadas, intentos);
        if (respuesta.includes("لقد خسرت!" ) || respuesta.includes("لقد ربحت!")) {
            conn.reply(m.chat, respuesta, m);
        } else {
            gam.set(m.sender, { palabra, letrasAdivinadas, intentos });
            conn.reply(m.chat, respuesta + `\n\n❗ المحاولات المتبقية: ${intentos}`, m);
        }
    } else {
        let mensaje = ocultarPalabra(palabra, letrasAdivinadas);
        let respuesta = juegoTerminado(m.sender, mensaje, palabra, letrasAdivinadas, intentos);
        conn.reply(m.chat, respuesta, m);
        gam.delete(m.sender);
    }
};

handler.help = ['ahorcado'];
handler.tags = ['fun'];
handler.command = ['كلمه'];
handler.estrellas = 4;
export default handler;
