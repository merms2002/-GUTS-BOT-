let handler = m => m; 
 handler.all = async function (m) { 

   let chat = global.db.data.chats[m.chat]; 
   let responses; 
   if (/^هfffffلا$/i.test(m.text)) { 
     responses = [ 
 '*هلا بيك يعمري 😩❤‍🔥*'  
     ]; 
} else if (/^السلام عليكم|سلام عليكم ورحمه الله وبركاته|سلام عليكم| عليكم ورحمه الله وبركاته$/i.test(m.text)) { 
     responses = [ 
       '*♥🐥وعليكم السلام ورحمة الله نورت يعم الجروب حلو لاتستحي*',  
     ]; 
   }else if (/^كريس|كريس$/i.test(m.text)) { 
     responses = [ 
'*كريس عمك معاك🇾🇪*'
     ]; 
   }else if (/^كريس من مطورك | كريس مين مطورك$/i.test(m.text)) { 
     responses = [ 
'*عمي فاقد حبه كثير😩❤‍🔥*'
     ]; 
   }
   else if (/^.اذكار الصباح|اذكار الصباح$/i.test(m.text)) { 
     responses = [ 
''
     ]; 
   }
   else if (/^كريس انت مرتبط|مرتبط/i.test(m.text)) { 
     responses = [ 
'*تحب نرتبط🏌🏻‍♂💔*'
   ]; 
   }else if (/^كريس تحبني؟|بوت تحبني/i.test(m.text)) { 
     responses = [ 
'*ماحب غير مطوري 🌚💔*',
'*اكره الكل ماعدا نفسي💔*',
'*دز انا المزه حبي 🙃💔*',
]; 
   }else if (/^كريس تكرهني؟/i.test(m.text)) { 
     responses = [ 
'*اانا اعرفك اصلا🙁*',
'*وانت مال اهلك🫥*',
'*ااي اكرهك🙄*',
     ]; 
     
     }else if (/^هاي|هالو$/i.test(m.text)) { 
     responses = [ 
       '*هالونورت يعم الجروب كله🌚♥*',  

     ]; 
}else if (/^بحبك/i.test(m.text)) { 
     responses = [ 
       '*وانا بحب حالي🌚❤*',  

     ]; 
   }else if (/^كريس من وين انت؟$/i.test(m.text)) { 
     responses = [ 
'❤اليمن ام الدنيا'
     ]; 
   } else if (/^احبك$/i.test(m.text)) { 
     responses = [ 
'*وانا ببغض الكل ماعدا مطوري مسترفاقد 🙂🫀*'
     ]; 
     }else if (/^كيف حال |كيف حالكم |كيفكم /i.test(m.text)) { 
     responses = [ 
       ' الحمدالله انت كيف حالك ',  

     ];
     }else if (/^تحبني$/i.test(m.text)) { 
     responses = [ 
       '🌚♥بحب البنات المزز بس',  

     ];
     }else if (/^هاي$/i.test(m.text)) { 
     responses = [ 
       'نورت فينك يعمي فتقدنالك',  

     ];
     }else if (/^❤|♥$/i.test(m.text)) { 
     responses = [ 
       '*بطلو تزعلو وترمو قلوب لبعضكم*',  

     ];
     }else if (/^اهلا$/i.test(m.text)) { 
     responses = [ 
       '* غلا فيك يحلى اهلا♥*',  

     ]; 
     }else if (/^مساء الخير|مساء النور$/i.test(m.text)) { 
     responses = [ 
       'مساءالورديورد 🌹',  

     ];
     }else if (/^ صباح الخير|صباح النور$/ .test(m.text)) { 
     responses = [ 
       '*صباح الورد🌹♥*',  
     ];
       }else if (/^اوامر$/i.test(m.text)) { 
     responses = [ 
       '*لا تنسى تشكرمطوري💝🌟 .*',  
     ];
            }else if (/^ بوت$/i.test(m.text)) { 
     responses = [ 
       '*اسمي كريس يا خرا مش بوت*',  
     ];
            }else if (/^مرحبا$/i.test(m.text)) { 
     responses = [ 
       '*مرحبا نورت فينك يعمي تعبنا بندور عليك 😂♥*',  
     ];
   }
   if (responses) { 
     let randomIndex = Math.floor(Math.random() * responses.length); 
     conn.reply(m.chat, responses[randomIndex], m); 
   } 
   return !0 
 }; 

 export default handler;