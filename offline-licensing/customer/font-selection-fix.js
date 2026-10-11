(function(){
 const chooser=document.getElementById('fontFamily');if(!chooser)return;
 const jameel='Jameel Noori Nastaleeq';
 const create=createText;createText=function(...args){const el=create.apply(this,args),mode=document.getElementById('language')?.value;if(el&&(mode==='ur'||mode==='mix')){el.style.fontFamily='"'+jameel+'"';el.lang='ur';chooser.value=jameel;}return el;};
 if(['ur','mix'].includes(document.getElementById('language')?.value))chooser.value=jameel;
 let remembered=null;
 document.addEventListener('selectionchange',()=>{const s=getSelection();if(s.rangeCount&&selected?.dataset.type==='text'&&selected.contains(s.anchorNode)&&selected.contains(s.focusNode))remembered={el:selected,range:s.getRangeAt(0).cloneRange()};});
 const previous=applyTextStyle;
 applyTextStyle=function(property){
  if(property!=='fontFamily')return previous.apply(this,arguments);
  const el=selected;if(!el||el.dataset.type!=='text')return;
  if(el.classList.contains('locked'))return toast('Unlock the text before changing its font.');
  const family=chooser.value,s=getSelection();let r=s.rangeCount&&el.contains(s.anchorNode)&&el.contains(s.focusNode)?s.getRangeAt(0).cloneRange():remembered?.el===el&&el.contains(remembered.range.startContainer)?remembered.range.cloneRange():null;
  if(!el.textContent.trim()){el.style.fontFamily='"'+family+'"';el.focus({preventScroll:true});snapshot();return;}
  if(!r){el.focus({preventScroll:true});r=document.createRange();r.selectNodeContents(el);r.collapse(true);}
  el.focus({preventScroll:true});s.removeAllRanges();s.addRange(r);
  if(r.collapsed){s.modify('move','backward','lineboundary');s.modify('extend','forward','lineboundary');if(!el.contains(s.anchorNode)||!el.contains(s.focusNode)){s.removeAllRanges();s.addRange(r);return;}if(s.isCollapsed)return;}
  document.dispatchEvent(new Event('selectionchange'));previous.call(this,'fontFamily');chooser.value=family;
 };
 document.fonts.load('24px "Jameel Noori Nastaleeq"','اردو').then(fonts=>{if(!fonts.length)toast('Jameel Noori Nastaleeq could not load. Reopen the updated HTML file.');}).catch(()=>toast('Jameel Noori Nastaleeq could not load. Reopen the updated HTML file.'));
})();
