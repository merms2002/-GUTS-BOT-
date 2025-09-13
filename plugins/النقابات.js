import mongoose from "mongoose";

// اتصال بقاعدة البيانات
const uri = "mongodb+srv://itachi3mk:mypassis1199@cluster0.zzyxjo3.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB Error:", err));

// النماذج
const Madara = mongoose.models.madara || mongoose.model("madara", new mongoose.Schema({
  groupId: String,
  userId: String,
  madara: String,
  registeredAt: { type: Date, default: Date.now },
  registeredBy: String,
  customColor: { type: String, default: "" }
}));

const Community2 = mongoose.models.community2 || mongoose.model("community2", new mongoose.Schema({
  communityId: String,
  groupId: String,
  title: String
}));

const Pending = mongoose.models.pending || mongoose.model("pending", new mongoose.Schema({
  userId: String,
  nickname: String,
  step: Number
}));

// أدوات تنسيق
const formatTime = date => new Intl.DateTimeFormat('ar-SA', {
  year: 'numeric', month: 'long', day: 'numeric',
  hour: '2-digit', minute: '2-digit'
}).format(date);

const createDecoFrame = title => `❐═━━━═╊⊰🏯⊱╉═━━━═❐
${title}
❐═━━━═╊⊰🏯⊱╉═━━━═❐
*˼🍃˹ |Edward Bot| ˼🍃˹*`;

const errorMessage = msg => createDecoFrame(`❐┃اسـتـخـدام خـاطـئ┃🛑❯\n『${msg}』`);
const successMessage = msg => createDecoFrame(`✅ ┇ ${msg}`);

// الهاندلر
let handler = async function (msg, { conn, text, command, isAdmin, isROwner, groupMetadata }) {
  try {
    const sender = msg.sender.split("@")[0];

    if (command === "تسجيل_مجتمع") {
      if (!msg.isGroup) return msg.reply(errorMessage("هذا الأمر للمجموعات فقط."));
      if (!isAdmin && !isROwner) return msg.reply(errorMessage("الأمر للمشرفين فقط."));
      const communityId = text.trim();
      if (!communityId) return msg.reply(errorMessage("يرجى كتابة معرف المجتمع بعد الأمر."));
      await Community2.findOneAndUpdate(
        { communityId },
        { communityId, groupId: msg.chat, title: groupMetadata.subject },
        { upsert: true }
      );
      return msg.reply(successMessage(`تم تسجيل هذا الجروب كمجتمع '${communityId}'`));
    }

    if (command === "دخلني") {
      const nickname = text.trim();
      if (!nickname) return msg.reply(errorMessage("يرجى كتابة اللقب بعد الأمر."));
      await Pending.findOneAndUpdate(
        { userId: sender },
        { userId: sender, nickname, step: 1 },
        { upsert: true }
      );
      const comms = await Community2.find();
      if (!comms.length) return msg.reply(errorMessage("لا يوجد مجتمعات مسجلة بعد."));
      let list = createDecoFrame("قـائـمـة الـجـروبات الـمـسـجـلـة") + "\n\n";
      comms.forEach((c, i) => list += `➤ ${i + 1}. ${c.title} (${c.communityId})\n`);
      list += `\n❐┃اخـتـر رقـم الـجـروب┃🛑❯\n↞┇ مـثـال ↞.اختار 1`;
      return msg.reply(list);
    }

    if (command === "اختار") {
      const idx = parseInt(text.trim(), 10) - 1;
      const pending = await Pending.findOne({ userId: sender, step: 1 });
      if (!pending) return msg.reply(errorMessage("لم تبدأ عملية 'دخلني' بعد."));
      const comms = await Community2.find();
      if (isNaN(idx) || idx >= comms.length || idx < 0) return msg.reply(errorMessage("رقم غير صحيح."));
      const choice = comms[idx];
      const exists = await Madara.findOne({ groupId: choice.groupId, madara: pending.nickname });
      if (exists) {
        await Pending.deleteOne({ _id: pending._id });
        return msg.reply(errorMessage("هذا اللقب محجوز."));
      }
      await Madara.create({
        groupId: choice.groupId,
        userId: sender,
        madara: pending.nickname,
        registeredBy: sender,
        customColor: ""
      });
      await Pending.deleteOne({ _id: pending._id });
      const { code } = await conn.groupInviteCode(choice.groupId);
      return msg.reply(successMessage(`تم حجز اللقب '${pending.nickname}' ودعوتك:\nhttps://chat.whatsapp.com/${code}`));
    }

    if (command === "الجروبات") {
      const comms = await Community2.find();
      if (!comms.length) return msg.reply(errorMessage("لا يوجد مجتمعات."));
      let list = createDecoFrame("قـائـمـة الـجـروبات") + "\n\n";
      comms.forEach((c, i) => list += `➤ ${i + 1}. ${c.title} (${c.communityId})\n`);
      return msg.reply(list);
    }

    if (command === "تسجيل_تلقائي") {
      if (!msg.isGroup) return;
      const rec = await Madara.findOne({ groupId: msg.chat, userId: sender });
      if (rec) {
        return msg.reply(successMessage(`تم تسجيل العضو @${sender} بلقبه '${rec.madara}'`), null, {
          mentions: [msg.sender]
        });
      }
    }

    if (command === "حذف_مجتمع") {
      if (!msg.isGroup) return msg.reply(errorMessage("هذا الأمر مخصص للمجموعات فقط."));
      if (!isAdmin && !isROwner) return msg.reply(errorMessage("الأمر للمشرفين فقط."));
      const deleted = await Community2.deleteOne({ groupId: msg.chat });
      if (deleted.deletedCount === 0) return msg.reply(errorMessage("لا يوجد مجتمع مسجل لهذا الجروب."));
      return msg.reply(successMessage("تم حذف المجتمع بنجاح."));
    }

    if (command === "الالقابب") {
      if (!msg.isGroup) return msg.reply(errorMessage("هذا الأمر مخصص للمجموعات فقط."));
      const list = await Madara.find({ groupId: msg.chat });
      if (!list.length) return msg.reply(errorMessage("لا يوجد ألقاب مسجلة في هذا الجروب."));
      let result = createDecoFrame("قائمة الألقاب") + "\n\n";
      list.forEach((entry, i) => {
        result += `➤ ${i + 1}. ${entry.madara} (by @${entry.userId})\n`;
      });
      return msg.reply(result, null, {
        mentions: list.map(e => e.userId + "@s.whatsapp.net")
      });
    }

  } catch (err) {
    console.error(err);
    return msg.reply(errorMessage("حدث خطأ غير متوقع."));
  }
};

handler.command = [
  "تسجيل_مجتمع", "دخلني", "اختار", "الجروبات",
  "تسجيل_تلقائي", "حذف_مجتمع", "الالقابب"
];

export default handler;
