let { MessageType } = (await import('@adiwajshing/baileys')).default

let handler  = async (m, { conn, command, args, usedPrefix, DevMode }) => {
  let type = (args[0] || '').toLowerCase()
  let _type = (args[0] || '').toLowerCase()
  let user = global.db.data.users[m.sender]
  let htki = '––––––『'
  let htka = '』––––––'
  
  // أسعار الحيوانات الأليفة
  let hdog = 2
  let hcat = 2
  let hhorse = 4
  let hfox = 6
  let hpetfood = 950

  let caption = `
🐈 • *قطة:* 
➞ ${hcat} رمز الحيوانات الأليفة🔖
🐕 • *كلب:*
➞ ${hdog} رمز الحيوانات الأليفة🔖
🐎 • *حصان:* 
➞ ${hhorse} رمز الحيوانات الأليفة🔖
🦊 • *ثعلب:* 
➞ ${hfox} رمز الحيوانات الأليفة🔖
🍖 • *طعام الحيوانات:*
➞ ${hpetfood} نقود 💹
- - - - - - - - - - - - - - - - - - - - - 
${htki} المميزات ${htka}
➞ 🐈 • قطة :
- زيادة الصحة بنسبة 5٪ لكل مستوى عند استخدام *.heal*
➞ 🐕 • كلب :
- قريبًا...
➞ 🐎 • حصان :
- قريبًا...
➞ 🦊 • ثعلب :
- قريبًا...
`

  const sections = [
    {
      title: "- متجر الحيوانات الأليفة -",
      rows: [
        { title: "🐈 • قطة", rowId: ".petshop cat" },
        { title: "🐕 • كلب", rowId: ".petshop dog" },
        { title: "🐎 • حصان", rowId: ".petshop horse" },
        { title: "🦊 • ثعلب", rowId: ".petshop fox" },
        { title: "🍖 • طعام الحيوانات", rowId: ".petshop petfood" },
      ]
    },
  ]

  const listMessage = {
    text: `*${htki} متجر الحيوانات الأليفة ${htka}*`,
    footer: caption,
    title: ' ',
    buttonText: "شراء",
    sections
  }

  try {
    if (/petshop/i.test(command)) {
      const count = args[1] && args[1].length > 0 ? Math.min(99999999, Math.max(parseInt(args[1]), 1)) : 1
      switch (type) {
        case 'cat':
          if (user.cat > 0) return m.reply('لديك هذا الحيوان الأليف بالفعل!')
          if (user.pet < hcat) return m.reply(`ليس لديك رموز حيوانات أليفة كافية!`)
          global.db.data.users[m.sender].pet -= hcat
          global.db.data.users[m.sender].cat += 1
          conn.sendButton(m.chat, `*${htki} حيوان أليف جديد! ${htka}*`, `🎉 تهانينا! لقد اشتريت حيوان أليف *قطة*`, null, [['المخزون', '.profile'], ['إطعام', `.feed ${type}`]], m)
          break

        case 'dog':
          if (user.dog > 0) return m.reply('لديك هذا الحيوان الأليف بالفعل!')
          if (user.pet < hdog) return m.reply(`ليس لديك رموز حيوانات أليفة كافية!`)
          global.db.data.users[m.sender].pet -= hdog
          global.db.data.users[m.sender].dog += 1
          conn.sendButton(m.chat, `*${htki} حيوان أليف جديد! ${htka}*`, `🎉 تهانينا! لقد اشتريت حيوان أليف *كلب*`, null, [['المخزون', '.profile'], ['إطعام', `.feed ${type}`]], m)
          break

        case 'fox':
          if (user.fox > 0) return m.reply('لديك هذا الحيوان الأليف بالفعل!')
          if (user.pet < hfox) return m.reply(`ليس لديك رموز حيوانات أليفة كافية!`)
          global.db.data.users[m.sender].pet -= hfox
          global.db.data.users[m.sender].fox += 1
          conn.sendButton(m.chat, `*${htki} حيوان أليف جديد! ${htka}*`, `🎉 تهانينا! لقد اشتريت حيوان أليف *ثعلب*`, null, [['المخزون', '.profile'], ['إطعام', `.feed ${type}`]], m)
          break

        case 'horse':
          if (user.horse > 0) return m.reply('لديك هذا الحيوان الأليف بالفعل!')
          if (user.pet < hhorse) return m.reply(`ليس لديك رموز حيوانات أليفة كافية!`)
          global.db.data.users[m.sender].pet -= hhorse
          global.db.data.users[m.sender].horse += 1
          conn.sendButton(m.chat, `*${htki} حيوان أليف جديد! ${htka}*`, `🎉 تهانينا! لقد اشتريت حيوان أليف *حصان*`, null, [['المخزون', '.profile'], ['إطعام', `.feed ${type}`]], m)
          break

        case 'petfood':
          if (global.db.data.users[m.sender].money >= hpetfood * count) {
            global.db.data.users[m.sender].petFood += count
            global.db.data.users[m.sender].money -= hpetfood * count
            conn.sendButton(m.chat, `*${htki} عملية شراء ${htka}*`, `✅ تم شراء *${count}* طعام للحيوانات مقابل *${hpetfood * count}* نقود!`, null, [['المخزون', '.profile']], m)
          } else {
            conn.reply(m.chat, `ليس لديك ما يكفي من المال!`, m)
          }
          break

        default:
          return await conn.sendMessage(m.chat, listMessage, { quoted: m })
      }
    }
  } catch (err) {
    m.reply("خطأ\n\n\n" + err.stack)
  }
}

handler.help = ['petshop']
handler.tags = ['rpg']
handler.command = /^(حيوان)/i

export default handler
