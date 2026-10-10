/* InPage conversion uses the editable Unicode preview, with a retained page caret. */
(()=>{
 const original=openInPageEncoding;
 openInPageEncoding=function(){
  const target=selected?.dataset.type==='text'&&selected.isConnected?selected:null;
  const selection=getSelection();
  const saved=target&&selection.rangeCount&&target.contains(selection.anchorNode)&&target.contains(selection.focusNode)?selection.getRangeAt(0).cloneRange():null;
  original.apply(this,arguments);
  // Replace the source element so the old listener cannot disable Insert on unknown codes.
  const old=document.getElementById('legacyInPageInput'),source=old.cloneNode(true);old.replaceWith(source);
  const result=document.getElementById('legacyInPageResult'),status=document.getElementById('legacyInPageStatus'),button=document.getElementById('ipDialogApply');
  result.readOnly=false;result.dir='rtl';result.style.textAlign='right';result.setAttribute('aria-label','Editable converted Unicode Urdu');
  const help=document.createElement('p');help.textContent='Review or edit the Unicode text below, then click Insert Text. Unrecognised codes appear as �; the original InPage text is kept above.';result.before(help);
  button.hidden=false;button.style.removeProperty('display');button.textContent='Insert Text';let lastSource=null;
  function convert(){
   const info=convertLegacyInPage(source.value);lastSource=source.value;
   result.value=info.text.replace(/\x04(?:[\s\S]|$)/g,'\ufffd');
   status.textContent=info.unknown.length?'Unrecognised codes: '+info.unknown.map(c=>c<0?'incomplete':'0x'+c.toString(16)).join(', ')+'. Review the � marks in the editable preview before inserting.':info.converted?info.converted+' encoded characters converted. Click Insert Text.':'Unicode text is ready. Click Insert Text.';
   button.disabled=!result.value.trim();
  }
  source.addEventListener('input',convert);document.getElementById('legacyConvertButton').onclick=convert;
  result.addEventListener('input',()=>{button.disabled=!result.value.trim();status.textContent='Edited Unicode preview will be inserted exactly as shown.';});convert();
  button.onclick=()=>{
   if(source.value!==lastSource)convert();
   const value=result.value.replace(/\r\n?/g,'\n');if(!value.trim()){status.textContent='Paste and convert text first.';return;}
   if(target?.isConnected&&target.classList.contains('locked')){status.textContent='Unlock the selected text object before inserting.';return;}
   try{
    let text=target?.isConnected?target:null;snapshot();
    if(!text){
     const previousLanguage=language.value,previousDirection=currentTextDirection;language.value='ur';currentTextDirection='rtl';
     try{const p=typeof lastPageClick==='object'&&lastPageClick?lastPageClick:{x:page.clientWidth-48,y:48};text=createText(p.x,p.y,false);}
     finally{language.value=previousLanguage;currentTextDirection=previousDirection;}
    }
    selectObj(text,false);text.contentEditable='true';text.focus({preventScroll:true});
    const s=getSelection();s.removeAllRanges();
    if(saved&&text.contains(saved.startContainer)&&text.contains(saved.endContainer))s.addRange(saved);
    else{const r=document.createRange();r.selectNodeContents(text);r.collapse(false);s.addRange(r);}
    insertRekhtaText(text,value);snapshot();closeIpDialog();text.focus({preventScroll:true});text.scrollIntoView({block:'nearest',inline:'nearest'});toast('Unicode text inserted on the page');
   }catch(error){console.error('InPage Insert:',error);status.textContent='Could not insert: '+error.message+'. Converted text is kept here; copy it or try again.';}
  };
 };
})();
