import { addExif } from '../lib/sticker.js';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import sharp from 'sharp'; // مكتبة sharp لتحويل الصور

let handler = async (m, { conn, text }) => {
  if (!m.quoted && !m.quoted?.text?.match(/\.(jpg|jpeg|png|gif)$/i) && !m.quoted?.mimetype) {
    throw '*❌ قم بالرد على صورة أو فيديو أو GIF أو رابط ينتهي بـ .jpg أو .png أو .gif*';
  }

  let stiker = false;
  try {
    let img;
    if (m.quoted.text && m.quoted.text.match(/\.(jpg|jpeg|png|gif)$/i)) {
      // إذا كان الرد على رابط ينتهي بـ .jpg أو .png أو .gif
      let url = m.quoted.text;
      let response = await axios.get(url, { responseType: 'arraybuffer' });
      img = Buffer.from(response.data, 'binary');
    } else if (m.quoted.mimetype) {
      // إذا كان الرد على صورة أو فيديو أو GIF
      img = await m.quoted.download();
    } else {
      throw '*❌ لم يتم العثور على صورة أو فيديو أو GIF أو رابط صالح*';
    }

    // تحويل الصورة إلى WebP باستخدام sharp
    const webpBuffer = await sharp(img).toFormat('webp').toBuffer();

    // تقسيم النص إلى packname و author
    let [packname, ...author] = text.split('|');
    packname = packname || global.packname || ''; // استخدام global.packname إذا لم يتم توفير packname
    author = (author || []).join('|').trim() || global.author || ''; // استخدام global.author إذا لم يتم توفير author

    // إضافة البيانات الوصفية (Exif)
    stiker = await addExif(webpBuffer, packname, author);

    // إنشاء مسار مؤقت لحفظ الملف
    const tmpDir = './tmp'; // المسار المؤقت (يمكن تغييره حسب الحاجة)
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true }); // إنشاء المجلد إذا لم يكن موجودًا
    }

    const filePath = path.join(tmpDir, `${Date.now()}.webp`); // اسم ملف فريد
    fs.writeFileSync(filePath, stiker); // حفظ الملف في المسار المؤقت

    // إرسال الملصق المعدل
    await conn.sendFile(m.chat, filePath, 'wm.webp', '', m, false, { asSticker: true });

    // حذف الملف المؤقت بعد الإرسال
    fs.unlinkSync(filePath);

  } catch (e) {
    console.error('حدث خطأ:', e); // طباعة الخطأ بالتفصيل في الكونسول
    throw `*❌ حدث خطأ أثناء معالجة الملصق: ${e.message}*`; // إظهار رسالة الخطأ للمستخدم
  }
};

handler.help = ['sticker <packname>|<author>'];
handler.tags = ['sticker'];
handler.command = /^ملصق|ستك$/i;

export default handler;