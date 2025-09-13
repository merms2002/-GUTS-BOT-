import axios from "axios";

let handler = async (m, { text }) => {
  if (!text) return m.reply("*˼⚡˹╎أرســـل سؤالـــك لـكـي أقـــوم بــالــإجــابــه.. ↶*");

  try {
    let { data } = await axios.get(
      `https://jazxcode.biz.id/ai/blackbox?query=${encodeURIComponent(text)}`
    );

    if (data.status && data.response) {
      m.reply(data.response);
    } else {
      m.reply("*˼❌˹╎لــم أجـــد اي شــيء عــن الــذي تــحــاول الــبـــحـث عـــنـه... ↶*");
    }
  } catch (error) {
    m.reply("*˼🚫˹╎حـــدث خـــطــأ.. ↶*");
  }
};

handler.help = ["ai"];
handler.command = ["كريس"];
handler.tags = ["ai"];

export default handler;
