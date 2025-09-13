let handler = async (m, { conn, usedPrefix, args, command }) => {
  conn.war = conn.war ? conn.war : {}
  conn.war2 = conn.war2 ? conn.war2 : {}

  // دالة تأخير
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // دالة التحقق من حالة AFK (عدم النشاط)
  async function cekAFK(x) {
    let turn = x
    let time = conn.war2[m.chat].time
    await sleep(90000)
    let turnNow = conn.war2[m.chat].turn
    let timeNow = conn.war2[m.chat].time

    if (turn == turnNow && time == timeNow) {
      conn.war[m.chat][turn].hp -= 2500
      conn.reply(m.chat, `*@${conn.war[m.chat][turn].user.split('@')[0]} لم يتحرك (خصم 2500 HP)*\n\n.war player = عرض إحصائيات اللاعبين\n.attack @tag = مهاجمة الخصم`, null, { contextInfo: { mentionedJid: [conn.war[m.chat][turn].user] } })
      await sleep(3000)

      // التحقق مما إذا كان اللاعب قد مات
      if (conn.war[m.chat][turn].hp <= 0) {
        conn.reply(m.chat, `*@${conn.war[m.chat][turn].user.split('@')[0]} قد مات بسبب نفاد نقاط الصحة (HP).*`, null, { contextInfo: { mentionedJid: [conn.war[m.chat][turn].user] } })

        // التحقق من حالة الفريق
        let playerTotal = 0
        let playerKalah = 0
        if (turn < 5) {
          for (let i = 0; i < 5; i++) {
            if (conn.war[m.chat][i].user != "") {
              playerTotal += 1
              if (conn.war[m.chat][i].hp <= 0) playerKalah += 1
            }
          }

          if (playerTotal > 0 && playerTotal == playerKalah) {
            let teamA = []
            let teamB = []
            let teamAB = []

            for (let j = 0; j < 5; j++) {
              if (conn.war[m.chat][j].user != "") {
                global.db.data.users[conn.war[m.chat][j].user].money -= Number(conn.war2[m.chat].money)
                teamA.push(conn.war[m.chat][j].user)
                teamAB.push(conn.war[m.chat][j].user)
              }
            }
            for (let j = 5; j < 10; j++) {
              if (conn.war[m.chat][j].user != "") {
                global.db.data.users[conn.war[m.chat][j].user].money += Number(conn.war2[m.chat].money)
                teamB.push(conn.war[m.chat][j].user)
                teamAB.push(conn.war[m.chat][j].user)
              }
            }

            conn.reply(m.chat, `*الفريق B فاز لأن الفريق A خسر جميع أعضائه!*\n\n*الفريق A:*\n` + teamA.map((v, i) => `${conn.war[m.chat][i].hp > 0 ? '❤️ ' : '☠️ '} @${v.split('@')[0]} (- Rp. ${Number(conn.war2[m.chat].money).toLocaleString()})`).join`\n`
              + "\n\n*الفريق B:*\n" + teamB.map((v, i) => `${conn.war[m.chat][i + 5].hp > 0 ? '❤️ ' : '☠️ '} @${v.split('@')[0]} (+ Rp. ${Number(conn.war2[m.chat].money).toLocaleString()})`).join`\n`, m, {
              contextInfo: {
                mentionedJid: teamAB
              }
            })
            delete conn.war[m.chat]
            delete conn.war2[m.chat]
          }
        }
      }

      let pergantian = false
      if (turn < 5) {
        for (let i = 5; i < 10; i++) {
          if (conn.war[m.chat][i].hp > 0 && conn.war[m.chat][i].user != "" && conn.war[m.chat][i].turn == false) {
            conn.war2[m.chat].turn = i
            conn.war2[m.chat].time += 1
            pergantian = true
          }
        }
      } else {
        for (let i = 0; i < 5; i++) {
          if (conn.war[m.chat][i].hp > 0 && conn.war[m.chat][i].user != "" && conn.war[m.chat][i].turn == false) {
            conn.war2[m.chat].turn = i
            conn.war2[m.chat].time += 1
            pergantian = true
          }
        }
      }

      if (!pergantian) {
        for (let l = 9; l >= 0; l--) {
          if (conn.war[m.chat][l].user != "" && conn.war[m.chat][l].hp > 0) {
            conn.war2[m.chat].turn = l
            conn.war2[m.chat].time += 1
          }
          conn.war[m.chat][l].turn = false
        }
      }

      await sleep(3000)
      conn.reply(m.chat, `*الآن دور @${conn.war[m.chat][conn.war2[m.chat].turn].user.split('@')[0]} للهجوم (مدة 90 ثانية)*\n\n.war player = إحصائيات اللاعبين\n.attack @tag = مهاجمة الخصم`, null, { contextInfo: { mentionedJid: [conn.war[m.chat][conn.war2[m.chat].turn].user] } })
      cekAFK(conn.war2[m.chat].turn)
    }
  }

  if (!(m.chat in conn.war)) return m.reply(`*لا يوجد حرب جارية في هذه المجموعة.*`)
  if (!conn.war2[m.chat].war) return m.reply(`*الحرب لم تبدأ بعد، استخدم ".war start" لبدء القتال.*`)

  for (let i = 0; i < 10; i++) {
    if (m.sender == conn.war[m.chat][i].user) {
      if (i != conn.war2[m.chat].turn) {
        conn.reply(m.chat, `*الآن دور @${conn.war[m.chat][conn.war2[m.chat].turn].user.split('@')[0]} للهجوم.*`, m, { contextInfo: { mentionedJid: [conn.war[m.chat][conn.war2[m.chat].turn].user] } })
        cekAFK(conn.war2[m.chat].turn)
      }
    }
  }

  if (!args[0]) return m.reply(`*حدد الخصم الذي تريد مهاجمته*\n\n*استخدم .war player لعرض اللاعبين*`)

  args[0] = args[0].split('@')[1] + "@s.whatsapp.net"

  // باقي الكود كما هو...
}
handler.command = /^(اتاك|atk)$/i
export default handler
