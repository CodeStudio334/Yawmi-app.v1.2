 'use strict';
let yawmiUnlocked=false, yawmiAuthBusy=false;
const yawmiOriginalRender=render;
function yawmiGate(){
 document.getElementById('app').innerHTML=`<section class="card yawmi-login"><div class="yawmi-lock-icon">☁️</div><h1>يومي | YAWMI</h1><p class="sub">سجل الدخول للوصول إلى جدولك وسجلاتك المحفوظة</p>${!cloudReady()?`<div class="notice">الحسابات غير مفعّلة بعد. يجب على مالك التطبيق إعداد مشروع Supabase وربط عنوانه ومفتاحه العام في cloud.js وتشغيل supabase-setup.sql. لن نعرض نموذج دخول وهميًا.</div>`:`<div class="form-field"><label>البريد الإلكتروني</label><input id="yawmi-email" type="email" autocomplete="email" placeholder="name@example.com"></div><div class="form-field"><label>كلمة المرور</label><input id="yawmi-password" type="password" autocomplete="current-password" minlength="6"></div><p id="yawmi-auth-error" class="sub" role="alert"></p><div class="btnrow"><button class="action" data-yawmi-auth="login" ${yawmiAuthBusy?'disabled':''}>تسجيل الدخول</button><button class="action secondary" data-yawmi-auth="signup" ${yawmiAuthBusy?'disabled':''}>إنشاء حساب</button></div><p class="sub">قد يتطلب إنشاء الحساب تأكيد البريد الإلكتروني.</p>`}<p class="sub">ابتكار سلطان محمد عاشور الزهراني</p></section>`;
 document.getElementById('nav').innerHTML='';
}
render=function(){if(!yawmiUnlocked||!cloudSession){yawmiGate();return}yawmiOriginalRender()};
function yawmiShowError(msg){let el=document.getElementById('yawmi-auth-error');if(el)el.textContent=msg;else alert(msg)}
async function yawmiReconcile(){
 // Never unlock before the cloud is reachable and the user's own profile has been loaded.
 let token=await cloudAccess();let u=await cloudRequest('/auth/v1/user',{token});
 if(!u?.id)throw Error('تعذر التحقق من هوية الحساب');
 let rows=await cloudRequest('/rest/v1/yawmi_profiles?select=payload&user_id=eq.'+encodeURIComponent(u.id)+'&limit=1',{token});
 if(rows?.length){let data=rows[0].payload;if(!data||data.version!==1||!Array.isArray(data.templates)||!Array.isArray(data.teachers)||!data.records||!data.extras||!Array.isArray(data.tasks))throw Error('بيانات الحساب السحابية غير صالحة');state=data;await putDB(state)}
 else {
   // Do not silently upload another account's local records into a new account.
   const fresh=initial();state=fresh;
   await cloudRequest('/rest/v1/yawmi_profiles?on_conflict=user_id',{method:'POST',token,headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},body:{user_id:u.id,payload:fresh,updated_at:new Date().toISOString()}});
   await putDB(state);
 }
 cloudMode='on';cloudError='';yawmiUnlocked=true;view='home';render();
}
document.addEventListener('click',async e=>{
 let b=e.target.closest('[data-yawmi-auth]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();
 if(yawmiAuthBusy||!cloudReady())return;
 let email=document.getElementById('yawmi-email')?.value.trim(),password=document.getElementById('yawmi-password')?.value;
 if(!email||!email.includes('@')||!password||password.length<6){yawmiShowError('أدخل بريدًا صحيحًا وكلمة مرور من 6 أحرف على الأقل');return}
 yawmiAuthBusy=true;b.disabled=true;
 try{
  const signup=b.dataset.yawmiAuth==='signup';
  let r=await cloudRequest(signup?'/auth/v1/signup':'/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});
  if(!r.access_token){yawmiShowError('تم طلب إنشاء الحساب. تحقق من البريد الإلكتروني ثم سجل الدخول.');return}
  cloudSetSession(r);await yawmiReconcile();
 }catch(err){yawmiShowError('تعذر الدخول: '+err.message)}finally{yawmiAuthBusy=false;if(!yawmiUnlocked){b.disabled=false}}
},true);
// On reload, refresh session and download current account data before showing the app.
(async()=>{if(!cloudReady()||!cloudSession){yawmiGate();return}try{for(let i=0;i<80&&!db;i++)await new Promise(r=>setTimeout(r,50));if(!db)throw Error('التخزين المحلي غير جاهز');await yawmiReconcile()}catch(err){yawmiUnlocked=false;cloudError=err.message; yawmiGate();yawmiShowError('تعذر التحقق من المزامنة: '+err.message)}})();
// Make logout return to the login screen. Protect against viewing stale account data.
document.addEventListener('click',e=>{let b=e.target.closest('[data-cloud-logout]');if(b){yawmiUnlocked=false;setTimeout(()=>render(),0)}},true);
