(function(){
 const drawer=document.getElementById('designDrawer');
 const buttons=['designMenuButton','designQuickBtn'].map(id=>document.getElementById(id)).filter(Boolean);
 if(!drawer)return;
 const style=document.createElement('style');
 style.textContent='#designDrawer[hidden]{display:none!important}#rkDesignClose{display:block;margin:0 0 8px auto;border:1px solid #93a4ab;border-radius:5px;background:#e5eeeb;color:#2b4242;cursor:pointer;padding:4px 10px}';
 document.head.append(style);
 function setOpen(open){drawer.hidden=!open;drawer.classList.toggle('open',open);buttons.forEach(b=>b.setAttribute('aria-expanded',String(open)));}
 window.toggleDesignDrawer=function(force){setOpen(typeof force==='boolean'?force:drawer.hidden);};
 buttons.forEach(b=>{b.setAttribute('aria-controls','designDrawer');b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();const open=drawer.hidden;closeAllMenus();setOpen(open);},true);});
 const close=document.createElement('button');close.id='rkDesignClose';close.type='button';close.textContent='Close ×';close.setAttribute('aria-label','Close Design options');close.onclick=()=>{setOpen(false);buttons[0]?.focus();};drawer.prepend(close);
 document.addEventListener('pointerdown',e=>{if(!drawer.closest('#rkDesignDock')&&!drawer.hidden&&!drawer.contains(e.target)&&!buttons.some(b=>b.contains(e.target)))setOpen(false);},true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden){setOpen(false);buttons[0]?.focus();}},true);
 setOpen(false);
})();
