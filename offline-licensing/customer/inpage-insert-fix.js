(()=>{
 const original=openInPageEncoding;
 openInPageEncoding=function(){
  const target=selected?.dataset.type==='text'&&selected.isConnected?selected:null;
  const selection=getSelection();
  const saved=target&&selection.rangeCount&&target.contains(selection.anchorNode)&&target.contains(selection.focusNode)?selection.getRangeAt(0).cloneRange():null;
  original.apply(this,arguments);
  const source=document.getElementById('legacyInPageInput');
  const result=document.getElementById('legacyInPageResult');
  const status=document.getElementById('legacyInPageStatus');
  const button=document.getElementById('ipDialogApply');
  button.hidden=false;button.style.removeProperty('display');button.disabled=false;
  button.textContent='Insert Text';
  button.onclick=()=>{
   const converted=convertLegacyInPage(source.value);
   result.value=converted.text;
   if(converted.unknown.length){status.textContent='Some InPage codes are unrecognised. Correct them before inserting.';return;}
   if(!converted.text){status.textContent='Paste text first, then click Insert Text.';return;}
   let text=target?.isConnected&&!target.classList.contains('locked')?target:null;
   if(!text){
    const previous=language.value;language.value='ur';
    try{const p=typeof lastPageClick==='object'&&lastPageClick?lastPageClick:{x:page.clientWidth-48,y:48};text=createText(p.x,p.y,false);}
    finally{language.value=previous;}
   }
   closeIpDialog();selectObj(text,false);text.contentEditable='true';text.focus({preventScroll:true});
   const s=getSelection();s.removeAllRanges();
   if(saved&&text.contains(saved.commonAncestorContainer))s.addRange(saved);
   else{const r=document.createRange();r.selectNodeContents(text);r.collapse(false);s.addRange(r);}
   insertRekhtaText(text,converted.text);snapshot();toast('Converted text inserted');
  };
 };
})();
