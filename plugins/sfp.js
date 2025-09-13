import fs from 'fs'

let jarsepay = async (m, { conn, text, usedPrefix, command }) => {
   if (!text) throw `*˼❗˹╎لـازم تـكـتـب اسـم الـمـسـتـنـد ↶*

> *❐↞┇مـثـال📌↞ ${usedPrefix + command} ملصق┇*`
   try {
   if (!m.quoted.text) throw `Harap balas kodenya.`   
   let path = `plugins/${text}.js` 
   await fs.writeFileSync(path, m.quoted.text) 
   m.reply(`*┃╻☑️╹تـم اضـافـة الـكـود فـي: ↜ ${path}*`)
   } catch (error) {
    console.error(error)
    throw 'Error: ' + error.message
   }
}
jarsepay.help = ['ضـــغ']
jarsepay.tags = ['الـمـطـور'] 
jarsepay.command = ['ضعه', 'sfp', 'ضع']

jarsepay.rowner = true

export default jarsepay; 