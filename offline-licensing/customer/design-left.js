(function(){
 const layers=document.getElementById('layers');if(!layers)return;
 const title=layers.previousElementSibling;
 const buttons=[...document.querySelectorAll('[data-ip-action="showlayers"]')];
 let visible=false;
 function update(){
  layers.style.setProperty('display',visible?'block':'none','important');
  if(title?.classList.contains('panel-title'))title.style.setProperty('display',visible?'block':'none','important');
  buttons.forEach(b=>{b.textContent=(visible?'✓ ':'')+'Layers Panel';b.setAttribute('aria-pressed',String(visible));});
 }
 buttons.forEach(b=>{b.style.removeProperty('display');b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();visible=!visible;update();closeAllMenus();if(visible)ipShowLayers();},true);});
 update();
})();
