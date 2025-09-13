var handler = async (m, {conn, groupMetadata }) => {

conn.reply(m.chat, `${await groupMetadata.id}`,   )

}
handler.help = ['بوب']
handler.tags = ['شاكي']
handler.command = /^(ايدي-جروب)$/i

handler.group = true
handler.owner = true
export default handler