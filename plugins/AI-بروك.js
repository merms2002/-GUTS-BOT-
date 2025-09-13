import fetch from "node-fetch";

let handler = async (m, { conn, text }) => {
  if (!text) return m.reply("*˼⚡˹ كــيـف يـمـكـنـنـي مـســاعدتـك بـرجـاء ادخــال سـؤالـــك*.\n:\n");

  await m.reply("*جــار الـبـحــث.....⏳*");

  try {
    let result = await CleanDx(text);
    await m.reply(`*╮━━━══━━❪🌸❫━━══━━━❍*\n『 ⚔️ 』${result}\n*╯━━━══━━❪🌸❫━━══━━━❍*`);
  } catch (e) {
    await m.reply("*كـم مـره سـوف تـســالـنـي هـذا الـسـؤال سـوف أمــوت مـن غــبــائـك مــع أنـنـي مـيــت بـالـفـــعـل يـوهــوهـوهـوهـوهـوهـو*");
  }
};

handler.help = ["dx"];
handler.tags = ["ai"];
handler.command = /^(بروك)$/i;

export default handler;

async function CleanDx(your_qus) {
  let Baseurl = "https://alakreb.vercel.app/api/ai/gpt?q=";

  // توجيه لـ API بأسلوب إيرين
  let prompt = `أنت إيرين ييغر من أنمي هجوم العمالقة، وأجبت للتو من المعركة. رد بأسلوبك الحاد، الغاضب، المليء بالإرادة والتمرد. لا تستخدم المجاملات، وقل الحقيقة كما تراها. سؤالي هو: ${your_qus}`;

  let response = await fetch(Baseurl + encodeURIComponent(prompt));
  let data = await response.json();
  return data.message;
}
