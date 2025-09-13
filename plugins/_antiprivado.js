const TIEMPO_BLOQUEO_MS = 2 * 24 * 60 * 60 * 1000; // 2 días

export async function before(m, { conn, isOwner, isROwner }) {
  try {
    if (m.isBaileys && m.fromMe) return true;
    if (!m.message || !m.text) return false;

    const text = m.text.toUpperCase();
    const exentos = ['PIEDRA', 'PAPEL', 'TIJERA', 'SERBOT', 'JADIBOT'];
    const comandoPermitidoBloqueado = ['CODE'];

    const user = global.db?.data?.users?.[m.sender] || {};

    if (exentos.some(word => text.includes(word)) || comandoPermitidoBloqueado.some(cmd => text.startsWith(cmd))) {
      return true;
    }

    if (user.bloqueado && user.tiempoBloqueo) {
      const ahora = Date.now();
      const tiempoPasado = ahora - user.tiempoBloqueo;

      if (tiempoPasado >= TIEMPO_BLOQUEO_MS) {
        await conn.updateBlockStatus(m.chat, 'unblock').catch(() => {});
        user.bloqueado = false;
        user.tiempoBloqueo = 0;
        user.warnPrivado = 0;
      } else {
        return false;
      }
    }

    // الحظر التلقائي بدون أي رسالة
    if (!m.isGroup && !isOwner && !isROwner) {
      user.warnPrivado = 0;
      user.bloqueado = true;
      user.tiempoBloqueo = Date.now();
      await conn.updateBlockStatus(m.chat, 'block').catch(() => {});
      return false;
    }

    return true;

  } catch (e) {
    console.error('[❌ ERROR EN BLOQUEO SILENCIOSO]', e);
    return true;
  }
}