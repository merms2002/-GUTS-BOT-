const xppercredit = 1
let handler = async (m, { conn, command, args }) => {
    let count = command.replace(/^(wt|withdraw|سحب)/i, '')
    count = count ? /all/i.test(count) ? Math.floor(global.db.data.users[m.sender].bank / xppercredit) : parseInt(count) : args[0] ? parseInt(args[0]) : 1
    count = Math.max(1, count)
    if (global.db.data.users[m.sender].bank >= xppercredit * count) {
      global.db.data.users[m.sender].bank -= xppercredit * count
      global.db.data.users[m.sender].credit += count
      conn.reply(m.chat, `*انـــــتـــقـــــل* ${count} *بــــيـــلـي فـي مـــحــــفـــظـــتـــك*`, m)
    } else conn.reply(m.chat, `*انــت لـا تــــمــلــــك بــيــــلـي فــي الـــبـــنـــك لـــــإجـــراء الـــــمــــعـامـــلـــه..🪙*`, m)
  }
  handler.help = ['withdraw']
  handler.tags = ['economy']
  handler.command = ['سحب', 'with', 'withdrawall', 'withall', 'wt' , 'wtall'] 
  
  handler.disabled = false
  
  export default handler
