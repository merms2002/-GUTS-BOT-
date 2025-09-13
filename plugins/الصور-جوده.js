/**
 *@Fitur: Remini
 *@By: Dxyz
 *@Type: esm
 *@Ch: https://whatsapp.com/channel/0029Vb6Q4eA1Hsq5qeBu0G1z
 *@Note: No Apus Wm
**/

import fs from 'fs';
import path from 'path';
import axios from 'axios';

let handler = async (m, { conn }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!/image\/(jpe?g|png)/.test(mime)) {
        throw '❗ أرسل صورة أو قم بالرد على صورة (JPEG/PNG) لتحسينها.';
    }

    try {
        const buffer = await q.download(); // تحميل الصورة من الرسالة المقتبسة
        const filePath = `./tmp/image-${Date.now()}.jpg`;
        fs.writeFileSync(filePath, buffer);

        const result = await upscale(filePath);

        const imageBuffer = await axios.get(result.result.imageUrl, {
            responseType: 'arraybuffer'
        }).then(res => res.data);

        const caption = `📁 زيـادة جـودة الـصـور\n> • الحجم: ${result.result.size || ''}`;
        await conn.sendMessage(m.chat, { image: imageBuffer, caption }, { quoted: m });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(m.chat, '❌ حدث خطأ أثناء المعالجة، حاول لاحقًا.', { quoted: m });
        console.error('Error:', e);
    }
};

async function upscale(filePath) {
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).slice(1) || 'bin';
    const mime = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'application/octet-stream';
    const fileName = Math.random().toString(36).slice(2, 8) + '.' + ext;

    const { data } = await axios.post("https://pxpic.com/getSignedUrl", {
        folder: "uploads",
        fileName
    }, {
        headers: {
            "Content-Type": "application/json"
        }
    });

    await axios.put(data.presignedUrl, buffer, {
        headers: {
            "Content-Type": mime
        }
    });

    const url = "https://files.fotoenhancer.com/uploads/" + fileName;

    const api = await (await axios.post("https://pxpic.com/callAiFunction", new URLSearchParams({
        imageUrl: url,
        targetFormat: 'png',
        needCompress: 'no',
        imageQuality: '100',
        compressLevel: '6',
        fileOriginalExtension: 'png',
        aiFunction: 'upscale',
        upscalingLevel: ''
    }).toString(), {
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Content-Type': 'application/x-www-form-urlencoded',
            'accept-language': 'id-ID'
        }
    }).catch(e => e.response)).data;

    const formatSize = size => {
        const round = (value, precision) => {
            const multiplier = Math.pow(10, precision || 0);
            return Math.round(value * multiplier) / multiplier;
        };
        const KB = 1024, MB = KB * KB, GB = KB * MB, TB = KB * GB;

        if (size < KB) return size + "B";
        if (size < MB) return round(size / KB, 1) + "KB";
        if (size < GB) return round(size / MB, 1) + "MB";
        if (size < TB) return round(size / GB, 1) + "GB";
        return round(size / TB, 1) + "TB";
    };

    const buffersize = await (await axios.get(api.resultImageUrl, {
        responseType: 'arraybuffer'
    }).catch(e => e.response)).data;

    const size = await formatSize(buffer.length);
    return {
        status: 200,
        success: true,
        result: {
            size,
            imageUrl: api.resultImageUrl
        }
    };
}

handler.help = ['جـوده'] 
handler.tags = ['ادوات'];
handler.command = /^(جوده|جودة)$/i;

export default handler;