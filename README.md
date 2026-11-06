# Flutter Widgets Guide

موقع ويب لتجميع ودجتات Flutter ومشاهدتها بسهولة، مع إمكانية البحث داخل قاعدة البيانات، وعرض اقتراحات أسماء الودجت، وكذلك إضافة وحذف الودجت من خلال لوحة إدارة محمية بـ Firebase Authentication.

## ما الذي يعمل في المشروع

- عرض قائمة الودجت في الصفحة الرئيسية
- بحث عن اسم الودجت من خلال Firestore
- قائمة اقتراحات تعرض أسماء الودجت المتطابقة
- اختيار ويدجت من القائمة لعرض بطاقة واحدة فقط
- صفحة لإضافة ويدجت جديدة
- قائمة بجميع الودجت الموجودة
- حذف الودجت بعد تسجيل دخول فعلي
- حماية لوحة الإدارة عبر Firebase Auth

## التقنيات المستخدمة

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Firebase Firestore
- Firebase Authentication

## هيكل المشروع

```bash
app/
  page.tsx
  addwidgetpage/
    page.tsx
    components/
      LoginForm.tsx
      WidgetList.tsx
      AddWidgetForm.tsx
    types.ts
  components/
    SearchBox.tsx
    WidgetSuggestions.tsx
    WidgetCard.tsx
    WidgetDefinition.tsx
  lib/
    firebase.ts
```

## التشغيل محليًا

1. افتح المجلد المشروع
2. ثبت الحزم:

```bash
npm install
```

3. شغّل المشروع:

```bash
npm run dev
```

4. افتح المتصفح على:

```bash
http://localhost:3000
```

## إعداد Firebase

أنشئ ملف `.env.local` في جذر المشروع، ثم أضف القيم التالية:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

## Firebase Authentication

تم تفعيل Authentication داخل Firebase باستخدام طريقة Email/Password.

للوصول إلى لوحة الإدارة:

- سجل الدخول عبر بريد إلكتروني وكلمة مرور موجودين في Firebase Authentication
- بعد تسجيل الدخول، ستظهر قائمة الودجت
- يمكنك إضافة ويدجت جديدة أو حذفها

## قاعدة البيانات

يتم حفظ الودجت في مجموعة Firestore باسم:

```text
widgets
```

كل مستند داخل المجموعة يحتوي على:

```json
{
  "name": "Text",
  "code": "Text(...)",
  "createdAt": "timestamp"
}
```

## ملاحظات

- الصفحة الرئيسية تعتمد على Firestore لعرض أسماء الودجت والبحث عنها
- الودجت المعروضة في الصفحة الرئيسية تُحمل من مجموعة `widgets`
- عند اختيار اسم من قائمة الاقتراحات، يتم عرض بطاقة واحدة فقط
- لوحة الإدارة محمية وتحتاج تسجيل دخول صحيح

## GitHub

يمكنك رفع المشروع إلى مستودع GitHub باستخدام الأمر:

```bash
git add .
git commit -m "Initial project commit"
git push origin master
```
