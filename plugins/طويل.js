//
// تعديل وتعريب بواسطة تائب
//

import * as fs from 'fs';

export async function before(m, { conn, isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return true;
  if (!m.isGroup) return false;

  const delet = m.key.participant;
  const bang = m.key.id;
  const fakemek = {
    key: { participant: '0@s.whatsapp.net', remoteJid: '0@s.whatsapp.net' },
    message: {
      groupInviteMessage: {
        groupJid: '51995386439-1616969743@g.us',
        inviteCode: 'm',
        groupName: 'P',
        caption: '🚫 تم اكتشاف رسالة مزعجة',
        jpegThumbnail: null
      }
    }
  };

  if (!m.text) return true;

  // الحصول على معلومات المشرفين
  const groupMetadata = await conn.groupMetadata(m.chat);
  const groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);

  // التحقق إذا كان المرسل هو البوت أو المطور أو مشرف
  const isSenderAdmin = groupAdmins.includes(m.sender);
  const isSenderBot = m.sender === conn.user.jid;
  const isSenderDev = [/* أرقام المطورين هنا */].includes(m.sender.split('@')[0]);

  // إذا كان المرسل من المحظورين من الحذف، نخرج من الدالة
  if (isSenderBot || isSenderDev || isSenderAdmin) {
    return true;
  }

  // بدلاً من كشف الكلمات السيئة، نكشف الرسائل الطويلة
  if (m.text.length > 5000) {
    if (!isBotAdmin) {
      await conn.sendMessage(m.chat, {
        text: `⚠️ تم اكتشاف رسالة طويلة جدًا من @${m.sender.split('@')[0]}\nلكنني لست مشرفًا لذا لا أستطيع حذفها!`,
        mentions: [m.sender]
      }, { quoted: fakemek });
      return false;
    }

    try {
      // حذف الرسالة
      await conn.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: bang,
          participant: delet
        }
      });

      // إرسال تنبيه للمجموعة
      await conn.sendMessage(m.chat, {
        text: `🚫 تم حذف رسالة طويلة جدًا\nالمستخدم: @${m.sender.split('@')[0]}`,
        mentions: [m.sender]
      }, { quoted: fakemek });

    } catch (error) {
      console.error('Error:', error);
      await conn.sendMessage(m.chat, {
        text: `⚠️ حدث خطأ أثناء محاولة حذف الرسالة الطويلة`,
        mentions: [m.sender]
      }, { quoted: fakemek });
    }
    return false;
  }

  return true;
}