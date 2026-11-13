يومي | YAWMI v1.4
ابتكار سلطان محمد عاشور الزهراني

المميزات:
- إصلاح حذف الوجبات اليومية والمحفوظة وتحديث العرض فوراً.
- صفحة مستقلة للوجبات المحفوظة مع بحث فوري وإضافة وجبة لليوم.
- تخصيص أهداف السعرات والبروتين والكربوهيدرات والدهون والماء.
- حساب اختياري ومزامنة سحابية عبر Supabase، بعد إكمال الإعداد.
- المحافظة على جدولك وأرشيف الأيام وملفات الأساتذة والمهام والنسخ الاحتياطية.

إعداد المزامنة السحابية (مطلوب مرة واحدة من صاحب التطبيق):
1. أنشئ مشروع Supabase في https://supabase.com
2. من SQL Editor نفّذ محتويات supabase-setup.sql.
3. من Project Settings > API انسخ Project URL والمفتاح العام publishable/anon.
4. افتح cloud.js وعدّل CLOUD_CONFIG.url و CLOUD_CONFIG.anonKey بالقيم الصحيحة.
5. من Authentication > Providers فعّل Email. اضبط إعدادات تأكيد البريد ورابط الموقع.
6. ارفع ملفات التطبيق إلى نفس مسار GitHub Pages السابق عبر HTTPS.
7. افتح المزيد > الحساب والمزامنة وأنشئ حساباً بالبريد وكلمة المرور.
8. بعد تسجيل الدخول، نزّل نسخة احتياطية محلية أولاً ثم اختر رفع بيانات الجهاز للسحابة أو استعادة نسخة سحابية.
9. عند تفعيل المزامنة، تُرفع التغييرات اللاحقة تلقائياً بعد الحفظ ما دام الجهاز متصلاً.

تنبيهات مهمة:
- لا توجد خدمة سحابية متصلة افتراضياً. لا يمكن تفعيلها دون مشروع Supabase ومفاتيحه العامة.
- لا تضع service_role أو أي مفاتيح سرية في ملفات المتصفح.
- البريد الإلكتروني هو معرف تسجيل الدخول؛ تسجيل الدخول باسم مستخدم مستقل غير مدعوم بعد.
- التخزين السحابي في هذه النسخة يعتمد على نسخة واحدة من حالة التطبيق لكل حساب (last-write-wins)، لذلك تجنب التعديل المتزامن من جهازين. لا يوجد دمج تلقائي للتغييرات المتعارضة.
- تسجيل الخروج لا يحذف البيانات المحلية. على الأجهزة المشتركة احذف بيانات التطبيق بعد حفظ نسخة احتياطية إذا رغبت بحماية خصوصيتك.
- لا تحذف تطبيقك القديم قبل أخذ نسخة احتياطية. استخدم نفس رابط GitHub Pages للحفاظ على IndexedDB.
- أهداف التغذية يحددها المستخدم؛ القيم الافتراضية ليست توصيات طبية.


YAWMI v1.5: LOGIN REQUIRED
1. Create a Supabase project, execute supabase-setup.sql in SQL Editor.
2. Put Project URL and publishable/anon key in CLOUD_CONFIG in cloud.js. NEVER put service_role or secret keys in browser code.
3. Configure email authentication and allowed Site URL / redirect URLs in Supabase.
4. Upload ALL files to the SAME GitHub Pages origin.
5. Login gate will not unlock until the account is authenticated and the user's profile has been read or created successfully.
6. IMPORTANT: If you have old LOCAL data from v1.4, EXPORT JSON BACKUP BEFORE installing v1.5. A new cloud account starts empty. After login, restore your exported JSON backup using the app's restore feature, then verify the cloud upload succeeded.
7. A real server-side Supabase setup and a two-device test are required before relying on cloud backup.
8. Concurrent edits on multiple devices are not merged: latest upload can overwrite another device's changes.
