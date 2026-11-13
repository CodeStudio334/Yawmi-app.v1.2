/* iOS gesture guard: preserve vertical scroll and editable fields */
(()=>{'use strict';
const editable=e=>!!e.target.closest('input,textarea,select,[contenteditable="true"]');
document.addEventListener('gesturestart',e=>{if(!editable(e))e.preventDefault()},{passive:false});
document.addEventListener('gesturechange',e=>{if(!editable(e))e.preventDefault()},{passive:false});
document.addEventListener('gestureend',e=>{if(!editable(e))e.preventDefault()},{passive:false});
let last=0;document.addEventListener('touchend',e=>{if(editable(e))return;const t=Date.now();if(t-last<280)e.preventDefault();last=t},{passive:false});
document.addEventListener('selectstart',e=>{if(!editable(e))e.preventDefault()});
document.addEventListener('contextmenu',e=>{if(!editable(e))e.preventDefault()});
})();
