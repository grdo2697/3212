# موقع حديث – جاهز للنشر على GitHub Pages

واجهة RTL عربية مع تصميم حديث، وضع داكن، وبنية مرتبة.

## البدء

1. **استنساخ المشروع** أو نزّل الملف المضغوط.
2. افتح `index.html` في المتصفح.

## النشر على GitHub Pages

1. أنشئ مستودع جديد على GitHub.
2. ادفع الملفات:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: modernized site"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```
3. من إعدادات المستودع → **Pages** → اختر الفرع `main` وجذر المشروع `/`.
4. انتظر دقيقة وستحصل على رابط الموقع.

## البنية

```
.
├── index.html
├── assets
│   ├── css
│   │   └── styles.css
│   ├── js
│   │   └── app.js
│   └── img
│       └── favicon.svg
├── LICENSE
├── .gitignore
└── README.md
```

## تخصيص سريع
- غيّر الألوان عبر متغيرات CSS في `:root`.
- عدّل الأقسام داخل `index.html` حسب احتياجك.
