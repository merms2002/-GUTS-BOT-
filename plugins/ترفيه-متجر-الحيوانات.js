let handler = async (m, { conn, command, args }) => {
  let type = (args[0] || '').toLowerCase()
  let user = global.db.data.users[m.sender]
  let htki = '––––––『'
  let htka = '』––––––'
  
  // أسعار الحيوانات بالألماس
  let hdog = 7
  let hcat = 10
  let hhorse = 17
  let hfox = 20
  let hpetfood = 1000

  let caption = `
🐈 • *قــطــة:* 
➞ ${hcat} 💎 ألماس
🐕 • *كــلــب:*
➞ ${hdog} 💎 ألماس
🐎 • *حــصــان:* 
➞ ${hhorse} 💎 ألماس
🦊 • *ثــعــلــب:* 
➞ ${hfox} 💎 ألماس
🍖 • *طعام-الحيوان*
➞ ${hpetfood} 💲 نــقــود
- - - - - - - - - - - - - - - - - - - - -
*${htki} قدرات ${htka}*
*➞ 🐈 • قــطــة :*
*- تزيد الصحة بنسبة 5% لكل مستوى عند الاستخدام* *.هيل*
*➞ 🐕 • كــلــب :*
*- سيتم إضافتها قريبًا...*
*➞ 🐎 • حــصــان :*
*- سيتم إضافتها قريبًا...*
*➞ 🦊 • ثــعــلــب :*
*- سيتم إضافتها قريبًا...*
*❐═━━━═╊⊰🏯⊱╉═━━━═❐*
*مــثــال :*

> .متجر-الحيوانات قــطــة
*❐═━━━═╊⊰🏯⊱╉═━━━═❐*
> © By Steven 
`

  try {
    if (/petshop|متجر-الحيوانات|متجرالحيوانات/i.test(command)) {
      switch (type) {
        case 'قطة':
          if (user.cat > 0) return m.reply('لديك القــطــة بالفعل!')
          if (user.diamond < hcat) return m.reply(`الألماس لديك غير كافٍ!`)
          user.diamond -= hcat
          user.cat += 1
          conn.sendMessage(m.chat, { text: `*${htki} حيوان جديد! ${htka}*\n\n*🎉 تهانينا، لقد اشتريت قــطــة جديدة!*`, quoted: m })
          break
        case 'كلب':
          if (user.dog > 0) return m.reply('لديك الكــلــب بالفعل!')
          if (user.diamond < hdog) return m.reply(`الألماس لديك غير كافٍ!`)
          user.diamond -= hdog
          user.dog += 1
          conn.sendMessage(m.chat, { text: `*${htki} حيوان جديد!${htka}*\n\n*🎉 تهانينا، لقد اشتريت كــلــبًا جديدًا!*
*❐═━━━═╊⊰🏯⊱╉═━━━═❐*
> *اكــتــب [.اطعم] لــي اطــعــام الـحــيــوان*
*❐═━━━═╊⊰🏯⊱╉═━━━═❐*`, quoted: m })
          break
        case 'ثعلب':
          if (user.fox > 0) return m.reply('لديك الثــعــلــب بالفعل!')
          if (user.diamond < hfox) return m.reply(`الألماس لديك غير كافٍ!`)
          user.diamond -= hfox
          user.fox += 1
          conn.sendMessage(m.chat, { text: `*${htki} حيوان جديد! ${htka}*\n\n*🎉 تهانينا، لقد اشتريت ثــعــلــبًا جديدًا!*
*❐═━━━═╊⊰🏯⊱╉═━━━═❐*

> *اكــتــب [.اطعم] لــي اطــعــام الـحــيــوان*

*❐═━━━═╊⊰🏯⊱╉═━━━═❐*`, quoted: m })
          break
        case 'حصان':
          if (user.horse > 0) return m.reply('لديك الحــصــان بالفعل!')
          if (user.diamond < hhorse) return m.reply(`الألماس لديك غير كافٍ!`)
          user.diamond -= hhorse
          user.horse += 1
          conn.sendMessage(m.chat, { text: `*${htki} حيوان جديد!${htka}*\n\n*🎉 تهانينا، لقد اشتريت حــصــانًا جديدًا!*
*❐═━━━═╊⊰🏯⊱╉═━━━═❐*
> *اكــتــب [.اطعم] لــي اطــعــام الـحــيــوان*
*❐═━━━═╊⊰🏯⊱╉═━━━═❐*`, quoted: m })
          break
        case 'طعام-الحيوان':
          if (user.money >= hpetfood) {
            user.petFood += 1
            user.money -= hpetfood
            conn.sendMessage(m.chat, { text: `*${htki} شراء ${htka}*\n\nتم شراء *1* طعام للحيوانات الأليفة بـ *${hpetfood}* مال!
*❐═━━━═╊⊰🏯⊱╉═━━━═❐*
> *اكــتــب [.اطعم] لــي اطــعــام الـحــيــوان*
*❐═━━━═╊⊰🏯⊱╉═━━━═❐*`, quoted: m })
          } else {
            conn.sendMessage(m.chat, { text: `*المال لديك غير كافٍ لشراء طعام الحيوانات!*`, quoted: m })
          }
          break
        default:
          conn.sendMessage(m.chat, { text: `*${htki} متجر الحيوانات ${htka}*\n\n${caption}` }, { quoted: m })
          break
      }
    }
  } catch (err) {
    m.reply("حدث خطأ\n\n\n" + err.stack)
  }
}

handler.help = ['متجرالحيوانات']
handler.tags = ['rpg']
handler.command = ['متجرالحيوانات','petshop','متجر-الحيوانات']
handler.group = true

export default handler