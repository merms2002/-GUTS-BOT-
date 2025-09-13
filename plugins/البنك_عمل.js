// الفضل يعود لـ https://github.com/FG98F
let handler = async (m, { conn, isPrems}) => {
  // let hasil = Math.floor(Math.random() * 5000)
  let pp = 'https://c4.wallpaperflare.com/wallpaper/991/456/22/sketch-artist-anime-anime-girls-arknights-swire-arknights-hd-wallpaper-preview.jpg'
  let gata = Math.floor(Math.random() * 3000)
  global.db.data.users[m.sender].exp += gata * 1  
  let time = global.db.data.users[m.sender].lastwork + 600000
  if (new Date - global.db.data.users[m.sender].lastwork < 600000) throw `*لقد عملت بالفعل، يرجى الانتظار بعض الوقت (حوالي ${msToTime(time - new Date())}) قبل أن تتمكن من العمل مرة أخرى!!*`

  await conn.reply(m.chat, `*${pickRandom(global.work)}* ${gata} XP`, fkontak, pp, m)
  global.db.data.users[m.sender].lastwork = new Date * 1
}

handler.help = ['work']
handler.tags = ['xp']
handler.command = ['work', 'عمل']
handler.fail = null
handler.exp = 0
export default handler

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
  seconds = Math.floor((duration / 1000) % 60),
  minutes = Math.floor((duration / (1000 * 60)) % 60),
  hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return minutes + " د " + seconds + " ث "
}

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

global.work = [
  "تعمل كقاطع بسكويت وتربح", 
  "قمت بحماية المجموعة عندما لم يكن المسؤول موجودًا، لذا حصلت على", 
  "تعمل لشركة عسكرية خاصة، وكسبت", 
  "تنظم حدث لتذوق النبيذ وتربح", 
  "كنت تدير المجموعة عندما لم يكن GATADIOS موجودًا، وكان الأجر", 
  "كنت تمشي في الشارع ووجدت", 
  "ساعدت في إدارة المجموعة بينما لم يكن المسؤول موجودًا، وكان الأجر", 
  "تم اختطافك وأخذوك إلى حلبة تحت الأرض حيث قاتلت ضد وحوش مع أشخاص لم تكن تعرفهم من قبل. ربحك كان", 
  "نظفت المدخنة ووجدت", 
  "طورت ألعابًا لكسب قوتك وكسبت", 
  "لماذا يسمى هذا الأمر بالعمل؟ أنت حتى لا تقوم بأي شيء متعلق بالعمل. ومع ذلك، ربحت", 
  "عملت في المكتب لساعات إضافية مقابل", 
  "تعمل كخاطف فتيات وتربح", 
  "شخص جاء وقدم عرضًا مسرحيًا. فقط لمشاهدته حصلت على", 
  "قمت بشراء وبيع سلع وربحت", 
  "تعمل في مطعم جدتك كطاهية وتربح", 
  "عملت لمدة 10 دقائق في بيت بيتزا محلي وربحت", 
  "تعمل ككاتبة لرسائل الحظ وتربح", 
  "رأيت شخصًا يكافح لرفع صندوق إلى سيارته، فبادرت لمساعدته قبل أن يصاب. بعد مساعدته، أعطوك مكافأة", 
  "طورت ألعابًا لكسب قوتك وكسبت", 
  "فزت في مسابقة أكل الفلفل الحار. الجائزة كانت", 
  "عملت طوال اليوم في الشركة مقابل", 
  "ساعدت في إدارة مجموعة GataDios مقابل", 
  "صممت شعارًا لـ FG مقابل", 
  "كنت تدير المجموعة عندما لم يكن GataDios موجودًا، وكان الأجر", 
  "عملت بأفضل ما لديك في مطبعة كانت توظف، وربحت أجرًا مستحقًا!", 
  "تعمل كقاطع شجيرات لـ FG98 وتربح", 
  "زاد الطلب على الألعاب للأجهزة المحمولة، لذا أنشأت لعبة جديدة مليئة بالمعاملات الصغيرة. مع لعبتك الجديدة ربحت", 
  "عملت كممثل صوتي لبرنامج Bob Esponja وتمكنت من ربح", 
  "كنت تزرع وربحت", 
  "تعمل كمنشئ قلاع رملية وتربح", 
  "عملت وربحت", 
  "تعمل كفنانة في الشوارع وتربح", 
  "قمت بأعمال اجتماعية من أجل قضية نبيلة! بسبب قضيتك النبيلة تلقيت"
]
