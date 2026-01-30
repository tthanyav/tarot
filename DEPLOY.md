# วิธีการติดตั้งและใช้งาน AI Prediction

เนื่องจาก API Key ไม่สามารถใส่ในโค้ดที่เผยแพร่สู่สาธารณะได้ เราจึงต้องใช้ Serverless Function เพื่อเก็บ API Key อย่างปลอดภัย

## ขั้นตอนการ Deploy

### 1. สร้างบัญชี Vercel (ฟรี)
- ไปที่ https://vercel.com/signup
- ลงชื่อเข้าใช้ด้วย GitHub account ของคุณ

### 2. Import โปรเจคจาก GitHub
- คลิก "Add New Project"
- เลือก repository: `tthanyav/tarot`
- คลิก "Import"

### 3. ตั้งค่า Environment Variables
ก่อนกด Deploy ให้เพิ่ม Environment Variable:
- คลิก "Environment Variables"
- เพิ่ม:
  - Name: `OPENAI_API_KEY`
  - Value: `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`

### 4. Deploy
- คลิก "Deploy"
- รอประมาณ 1-2 นาที

### 5. อัพเดท API Endpoint
หลังจาก deploy สำเร็จ:
1. คัดลอก URL ที่ Vercel สร้างให้ (จะเป็นแบบ `https://tarot-xxx.vercel.app`)
2. แก้ไขไฟล์ `ai_functions.js` บรรทัดที่ 5:
   ```javascript
   const API_ENDPOINT = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
     ? 'http://localhost:3000/api/predict'
     : 'https://tarot-xxx.vercel.app/api/predict';  // เปลี่ยน URL ตรงนี้
   ```
3. Commit และ push กลับไปที่ GitHub
4. Vercel จะ auto-deploy ใหม่

### 6. ทดสอบ
- เปิดเว็บที่ URL ของ Vercel
- ทดลองเปิดไพ่และใส่คำถาม
- กดปุ่ม "ทำนายโดย AI"
- ควรจะได้คำทำนายกลับมา

## หมายเหตุ
- GitHub Pages จะไม่สามารถใช้ AI Prediction ได้ เพราะไม่มี serverless function
- ใช้ Vercel URL เป็นหลักแทน
- หรือถ้าต้องการใช้ GitHub Pages ต่อ ให้อัพเดท `API_ENDPOINT` ให้ชี้ไปที่ Vercel API
