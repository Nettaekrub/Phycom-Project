const express = require('express');
const line = require('@line/bot-sdk');
const { SerialPort, ReadlineParser } = require('serialport');
const app = express();

const config = {
  channelAccessToken: 'VzpkDHkFja0t0qipTWb7jbLmMD7FaeztbwagWALnQ6URohVlDt9f7+kVBvQidue/hVL9b0nu9wpAVHB8Aadgro9Q0KTxgzMFvJzdPmdgKUs6UhMPOuQIACM+pweXnGRJL5UU9BCqZ6PPNbX7q7X3awdB04t89/1O/w1cDnyilFU=',
  channelSecret: '922c99c9c0be22ae7e3c2047a72196e9',
};

const client = new line.Client(config);
const port = new SerialPort({ path: '/dev/cu.usbmodem34B7DA6345D82', baudRate: 9600 });
const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
let userId;

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

app.get('/', (req, res) => {
  res.send('Hello, this is the Line Bot server!');
});

async function handleEvent(event) {
    userId = event.source.userId;
    if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }
  
    const command = event.message.text.trim().toLowerCase();
    let message;
    let ar_message;
    if (command.includes('ดี')) {
        message = `หวัดดีจ้า มู่ฮ่าฮ่าฮ่า!!!`
    }
    else if (command.includes('โรค') && !command.includes('สถิติ')) {
        if (command.includes('ป้องกัน')) {
            message = 'การป้องกันโรคเกี่ยวกับหัวใจนั้น ขึ้นอยู่กับชนิดของโรคหัวใจ ซึ่งแม้ว่าจะไม่มีสาเหตุเฉพาะเจาะจงชัดเจน \n'
                      + 'แต่ก็มีปัจจัยสิ่งหลายอย่างที่หากเราควบคุมได้ดีจะช่วยลดโอกาสที่\nจะเกิดโรคเกี่ยวกับหัวใจลงได้มากนะ เช่น'
                      + '\n- หลีกเลี่ยงการสูบบุหรี่\n- ควบคุมความดันโลหิตไม่ให้สูงเกินมาตรฐาน\n- ควบคุมคอเลสเตอรอล และ เบาหวาน'
                      + '\n- ออกกำลังกายสม่ำเสมอ อย่างน้อย 30 นาทีต่อวัน\n- ทานอาหารที่มีเกลือและไขมันอิ่มตัวต่ำ\n- ควบคุมน้ำหนักไม่ให้เกินมาตรฐาน\n- ลดความเครียด\n- ฝึกสุขอนามัยที่ดี'
                      + '\nถ้าเกิดว่าอยากอ่านเพิ่มเติมก็อ่านได้ที่ลิงก์นี้เลย! \nhttps://www.medparkhospital.com/disease-and-treatment/heart-disease'
        } 
        else {
            message = 'โรคหัวใจมีหลายชนิดสามารถแบ่งเป็นชนิดใหญ่ๆได้ดังนี้ \n'
            + '- โรคหลอดเลือดหัวใจ\n- โรคหัวใจเต้นผิดจังหวะ\n- โรคกล้ามเนื้อหัวใจ\n- โรคหัวใจพิการแต่กำเนิด\n- โรคลิ้นหัวใจ\n- โรคติดเชื้อบริเวณหัวใจ'
            + '\nซึ่งโรคหัวใจยังมีอีกหลายประเภทเลยนะ! ถ้าอยากอ่านข้อมูลเพิ่มเติมสามารถค้นหาได้ใน google เลย หรือจะเป็นที่ ลิงก์นี้ก็ได้นะ!'
            + '\nhttps://bangpakok3.com/care_blog/view/261'
        }
    }
    else if (command.includes('สถิติ')) {
        message = 'โรคหัวใจถือเป็นสาเหตุการเสียชีวิตอันดับต้น ๆ ของคนไทย โดยในสถิติของ WHO (องค์กรอนามัยโลก) \nได้ให้ข้อมูลไว้ว่าโรคหัวใจเป็นสาเหตุการเสียชีวิตอันดับ 1 ของโลก หรือคิดเป็น 31% ของการเสียชีวิตของคนทั่วโลก\nและสถิติจากกระทรวงสาธารณสุขระบุว่าสำหรับประเทศไทย \nอัตราการเสียชีวิตจากโรคหลอดเลือดหัวใจของคนไทย\nมีความเสี่ยงเพิ่มขึ้นทุกปีเลยนะ!\nถ้าอยากอ่านข้อมูลเพิ่มเติมคลิ๊กได้ที่ลิงก์ด้านล่างเล๊ย\nhttps://theblessing.co.th/?p=2088#:~:text=โดยมีประมาณการคร่าว%20ๆ,อายุ%2040%20ปีขึ้นไป'
    } 
    else {
        message = `ตอนนี้เรายังไม่มีข้อมูลของเรื่อง \"${command}\" นะ ถ้าอยากถามเรื่องอื่นๆ เราก็มีฟังก์ชั่นดังนี้เล๊ย! \n- ข้อมูลของโรคเกี่ยวกับหัวใจ\n- การป้องกันโรคหัวใจ\n- สถิติของคนที่เป็นโรคเกี่ยวกับหัวใจ\n- สถิติอัตราการเต้นหัวใจ\n- การวัดอัตราชีพจร\nถ้าเป็นเรื่องเกี่ยวกับหัวใจเราพร้อมเสมอ!`
    }

    if (command.includes('เปิด')) {
        message = 'เปิดเครื่องแล้วค้าบ';
        ar_message = '1';
        port.write(ar_message + '\n'); // ส่งคำสั่งไปยัง Arduino
    
      } else if (command.includes('ปิด')) {
        message = 'ปิดเครื่องแล้วค้าบ';
        ar_message = '0';
        port.write(ar_message + '\n'); // ส่งคำสั่งไปยัง Arduino
      } else {
        port.write(message + '\n', (err) => {
          if (err) {
            console.error('Error on write:', err.message);
          }
        });
      }
    return client.replyMessage(event.replyToken, { type: 'text', text: message});
  }
  parser.on('data', (data) => {
    console.log('ได้รับข้อมูลจาก Arduino:', data);
    if (data.startsWith('BPM:')) {
        const bpmValue = parseInt(data.split(':')[1], 10); 
        console.log('BPM ปัจจุบัน:', bpmValue);
        const currentDate = new Date();
        const dateString = currentDate.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const timeString = currentDate.toLocaleTimeString('th-TH', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const lineMessage = `อัตราการเต้นหัวใจคือ ${bpmValue} BPM\nวันที่: ${dateString}\nเวลา: ${timeString}`;
        if (userId) {
            client.pushMessage(userId, { type: 'text', text: lineMessage })
                .then(() => console.log('ส่งข้อความไปยัง Line เรียบร้อย'))
                .catch(err => console.error('เกิดข้อผิดพลาดในการส่งข้อความไปยัง Line:', err));
        } else {
            console.error('userId ไม่มีค่า!');
        }
    }
});

app.listen(3000);
console.log('Line Bot server running on port 3000');
