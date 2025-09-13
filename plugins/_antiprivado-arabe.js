const codigosArabes = ['+212', '+971', '+20', '+966', '+964', '+963', '+973', '+968', '+974'];
const regexArabe = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;
const regexComando = /^[\/!#.]/;

// Objeto global para advertencias
global.advertenciasArabes = global.advertenciasArabes || {};

export async function before(m, { conn, isOwner, isROwner }) {
  try {
    if (
      m.isBaileys ||
      m.isGroup ||
      !m.message ||
      !m.sender ||
      typeof m.text !== 'string' ||
      isOwner ||
      isROwner
    ) return false;

    const numero = m.sender;
    const texto = m.text;
    const numeroLimpio = numero.replace(/[^0-9]/g, '');

    const esArabe = regexArabe.test(texto) || codigosArabes.some(pref => numeroLimpio.startsWith(pref.replace('+', '')));
    const esComando = regexComando.test(texto);

    if (esArabe && !esComando) {
      global.advertenciasArabes[numero] = (global.advertenciasArabes[numero] || 0) + 1;

      const advertencias = global.advertenciasArabes[numero];

      if (advertencias >= 3) {
        await m.reply(`
🟥 ⛔ *[ تم تفعيل القفل]* ⛔ 🟥
══════════════════════
🛡️ * تم تمكين أمان CyberCore™*
📛 Usuario: ${numero}
💬 السبب: النص غير مسموح به (3/3)

🧨 Ejecución del protocolo [AUTOBLOCK-ΣX3]...
🔒 الحالة: *تم حظرك ي المستخدم* 

🔗 Acceso finalizado.
رابط القناه البوت
https://whatsapp.com/channel/0029Vb6CZ5AJpe8nf31dSp3A
══════════════════════`);
        await conn.updateBlockStatus(m.chat, 'block');
        console.log(`[⛔ BLOQUEADO PERMANENTE] ${numero}`);
        delete global.advertenciasArabes[numero];
      } else {
        await m.reply(`
⚠️ ⚠️ *[ADVERTENCIA ${advertencias}/3]* ⚠️ ⚠️
══════════════════════
🚫  تم تفعيل نظام الدفاع .
💬    لقد أرسلت نصًا غير قانوني .

📎 الأوامر المقبولة فقط:
Ej: */menu*, */help*, */code* !info

🧬    الانتهاك رسله التاليه سيؤدي إلى *الحظر التلقائي *.
══════════════════════`);
        console.log(`[⚠️ ADVERTENCIA ${advertencias}/3] ${numero}`);
      }

      return false;
    }

    return true;

  } catch (e) {
    console.error('[❌ ERROR EN SISTEMA CYBERPUNK DE ADVERTENCIAS]', e);
    return true;
  }
}