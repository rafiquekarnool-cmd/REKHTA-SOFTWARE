(function(){
 const previous=applyDesignAction;
 function shadow(enabled){
  const object=selected;
  if(!object||!object.classList.contains('obj')||!object.isConnected)return toast('Select an object first');
  object.style.boxShadow=enabled?'0 8px 18px rgba(15,23,42,.22)':'none';
  object.dataset.shadow=enabled?'1':'0';
  updateProps();snapshot();
 }
 applyDesignAction=function(action){if(action==='shadow'||action==='noshadow')return shadow(action==='shadow');return previous(action);};
 toggleShadowEffect=function(){if(!selected)return toast('Select an object first');shadow(selected.dataset.shadow!=='1');};
})();
