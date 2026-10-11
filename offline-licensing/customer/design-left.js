(function(){
 const layers=document.getElementById('layers');
 if(layers){layers.style.setProperty('display','none','important');const title=layers.previousElementSibling;if(title?.classList.contains('panel-title'))title.style.setProperty('display','none','important');}
 document.querySelectorAll('[data-ip-action="showlayers"]').forEach(b=>b.style.setProperty('display','none','important'));
})();
