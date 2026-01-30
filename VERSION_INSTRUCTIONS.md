# Version Management Instructions

## วิธีการอัพเดท Version ก่อน Deploy

### วิธีที่ 1: ใช้ Script อัตโนมัติ (แนะนำ)
```bash
# Windows
update-version.bat
```

จากนั้นระบุเลข version ใหม่ (เช่น 1.0.2) หรือกด Enter เพื่อแค่อัพเดทเวลา

### วิธีที่ 2: แก้ไขด้วยตนเอง
แก้ไขไฟล์ `version.js`:
```javascript
const APP_VERSION = "1.0.2";  // เปลี่ยนเลข version
const LAST_UPDATED = "2026-01-30 23:30";  // เปลี่ยนวันที่/เวลา
```

### Version Number Format
- **1.0.0** = เวอร์ชันแรก
- **1.0.1** = แก้ไขเล็กน้อย (bug fix, text changes)
- **1.1.0** = เพิ่มฟีเจอร์ใหม่
- **2.0.0** = เปลี่ยนแปลงใหญ่

### หลังแก้ไข Version
```bash
git add version.js
git commit -m "Bump version to X.X.X"
git push origin main
```

## การตรวจสอบ Version บนเว็บ
ดูที่ footer ด้านล่างของเว็บ จะแสดง:
```
v1.0.1 • Updated: 2026-01-30 23:30
```

ถ้าเห็นเวอร์ชันเดิม ลอง:
1. รีเฟรชหน้าเว็บ (Ctrl+F5)
2. Clear cache
3. ตรวจสอบว่า Vercel deploy เสร็จแล้วหรือยัง
