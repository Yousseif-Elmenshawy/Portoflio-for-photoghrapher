# Kroma — Frontend Preview

نسخة مستقلة من واجهة Kroma مبنية بـ React وTypeScript وVite. لا تحتوي على PHP أو Express أو قاعدة بيانات أو اتصالات API. المشاريع والإعدادات والمعارض والرسائل التجريبية تُحفظ محليًا في `localStorage` على جهاز الزائر.

> تسجيل دخول لوحة المعاينة فقط: `admin` / `admin123`. هذا تسجيل تجريبي داخل المتصفح وليس حماية حقيقية، ولا يصلح للبيانات الحساسة.

## تشغيل محلي

تحتاج Node.js 20.19 أو أحدث:

```bash
npm ci
npm run dev
```

افتح الرابط المحلي الذي يطبعه Vite. للتحقق من نسخة النشر:

```bash
npm run build
npm run preview
```

## نشر GitHub / Vercel / Netlify

- ارفع محتويات مجلد `frontend-preview` فقط إلى مستودع Frontend مستقل؛ لا ترفع مجلد المشروع الأب.
- في Vercel أو Netlify استخدم مجلد المشروع هذا كـ **Root Directory**، وأمر البناء `npm run build` ومجلد النشر `dist`.
- إعداد `base: './'` يجعل ملفات البناء والأصول تعمل على نطاق الموقع وعلى مسارات GitHub Pages الفرعية.

لرفع المجلد إلى مستودع GitHub جديد، افتح الطرفية داخله ثم نفّذ:

```bash
git init
git add .
git commit -m "Add standalone Kroma frontend"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

## الملفات المطلوب الاحتفاظ بها

- `index.html`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `.gitignore`, `README.md`
- مجلد `src/` كاملًا، بما فيه مكونات React وملف `mockApi.ts` وصور `src/assets/images/`

لا تنسخ إلى مستودع الواجهة ملفات `server.ts` أو `php/` أو `database.sqlite*` أو `uploads/` أو `node_modules/` أو `dist/`. بيانات المعاينة قابلة للمسح من إعدادات المتصفح، ولا تنتقل إلى أجهزة الزوار الأخرى.
