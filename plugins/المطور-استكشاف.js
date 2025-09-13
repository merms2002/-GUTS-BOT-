import fs from 'fs'
import path from 'path'
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'

const BASE_DIR = './'  // المسار الرئيسي

const handler = async (m, { conn, args, command, usedPrefix }) => {
  const wm = global.wm || '𝑴𝒊𝒏𝒂𝒕𝒐-𝑩𝒐𝒕𝑽2🧞'
  const targetPath = args[0] ? path.join(BASE_DIR, args[0]) : BASE_DIR

  if (!fs.existsSync(targetPath)) {
    return m.reply('❌ المسار غير موجود')
  }

  const isDirectory = fs.statSync(targetPath).isDirectory()
  if (!isDirectory) {
    return m.reply('❌ هذا ليس مجلدًا')
  }

  const entries = fs.readdirSync(targetPath)
  const folders = entries.filter(entry => fs.statSync(path.join(targetPath, entry)).isDirectory())
  const files = entries.filter(entry => fs.statSync(path.join(targetPath, entry)).isFile())

  const rows = [
    ...folders.map((folder, i) => ({
      header: `📁 المجلد رقم ${i + 1}`,
      title: folder,
      description: 'اضغط لعرض محتوى هذا المجلد',
      id: `${usedPrefix + command} ${path.join(args[0] || '', folder)}`
    })),
    ...files.map((file, i) => ({
      header: `📄 الملف رقم ${i + 1}`,
      title: file,
      description: '',
      id: `${usedPrefix}ملف ${path.join(args[0] || '', file)}`
    }))
  ]

  const caption = `╭── *𝑴𝒊𝒏𝒂𝒕𝒐-𝑩𝒐𝒕𝑽2🧞 - مستكشف الملفات* ──╮\n│ المسار الحالي: ${targetPath}\n│ الملفات: ${files.length} | المجلدات: ${folders.length}\n╰────────────────────────────╯`

  const imageURL = 'https://i.top4top.io/p_338974dhc1.jpg'
  const mediaMessage = await prepareWAMessageMedia({ image: { url: imageURL } }, { upload: conn.waUploadToServer })

  const msg = generateWAMessageFromContent(m.chat, {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: { text: caption },
          footer: { text: wm },
          header: {
            hasMediaAttachment: true,
            imageMessage: mediaMessage.imageMessage
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                  title: 'استكشاف الملفات',
                  sections: [
                    {
                      title: '📁 المجلدات و الملفات',
                      highlight_label: wm,
                      rows
                    }
                  ]
                })
              }
            ]
          }
        }
      }
    }
  }, { userJid: conn.user.jid, quoted: m })

  await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
}

handler.help = ['استكشاف [مسار]']
handler.tags = ['tools']
handler.command = ['استكشاف']
handler.rowner = true

export default handler