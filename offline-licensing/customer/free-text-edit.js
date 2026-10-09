/* Click-to-type and selection-scoped text formatting. */
(()=>{
 let saved=null,control=null;
 function remember(){
  const s=getSelection();if(!s.rangeCount)return;
  const r=s.getRangeAt(0),n=r.commonAncestorContainer;
  const el=(n.nodeType===1?n:n.parentElement)?.closest('.textobj');
  if(el&&page.contains(el))saved={el,range:r.cloneRange()};
 }
 document.addEventListener('selectionchange',remember);
 window.addEventListener('mousedown',e=>{
  const c=e.target.closest('#fontSize,#fontFamily,#textColor');
  if(c){remember();control=c.id;return;}
  if(e.button!==0||!page.contains(e.target)||!['select','text'].includes(tool))return;
  if(e.target.closest('.handle,.rk-node')||e.altKey||e.shiftKey)return;
  const el=e.target.closest('.textobj');
  if(el&&!el.classList.contains('locked')){
   // Preserve the browser's native caret placement and drag text selection.
   selectObj(el,false);el.contentEditable='true';el.focus({preventScroll:true});
   drag=null;e.stopImmediatePropagation();return;
  }
  if(e.target.closest('.obj'))return;
  const p=pagePoint(e);
  // The space between physical pages is not a typing surface.
  const paper=e.target.closest('.rk-paper');
  if(window.rekhtaPagination&&!paper&&e.target!==page)return;
  e.preventDefault();e.stopImmediatePropagation();
  const text=createText(p.x,p.y,false);selectObj(text,false);
  text.focus({preventScroll:true});const r=document.createRange();r.selectNodeContents(text);r.collapse(true);
  const s=getSelection();s.removeAllRanges();s.addRange(r);saved={el:text,range:r.cloneRange()};
  snapshot();
 },true);
 // Earlier page click handlers must not create a second text object.
 window.addEventListener('click',e=>{
  if(e.button===0&&page.contains(e.target)&&['select','text'].includes(tool)&&!e.target.closest('.obj'))e.stopImmediatePropagation();
 },true);
 function format(prop,value){
  remember();const el=selected?.classList.contains('textobj')?selected:saved?.el;
  if(!el||!el.isConnected||el.classList.contains('locked'))return;
  const r=saved?.el===el?saved.range:null;
  if(!r||r.collapsed||!el.contains(r.commonAncestorContainer)){
   toast('Select the text to change its formatting');return;
  }
  const span=document.createElement('span');span.dataset.rekhtaSelectionStyle='1';span.style[prop]=value;
  span.appendChild(r.extractContents());
  span.querySelectorAll('*').forEach(n=>n.style.removeProperty(prop.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())));r.insertNode(span);
  el.focus({preventScroll:true});r.selectNodeContents(span);
  const s=getSelection();s.removeAllRanges();s.addRange(r);saved={el,range:r.cloneRange()};
  refreshLayerName(el);debouncedSnapshot();
 }
 const previous=applyTextStyle;
 applyTextStyle=function(property){
  const id=property||control||'textColor';
  if(id==='fontSize'){const v=Number(fontSize.value);if(v>=8&&v<=200)format('fontSize',v+'px');}
  else if(id==='fontFamily')format('fontFamily','"'+fontFamily.value+'"');
  else if(id==='textColor')format('color',textColor.value);
  else return previous.apply(this,arguments);
 };
 toggleBold=function(){const n=saved?.range.startContainer;const el=n?.nodeType===1?n:n?.parentElement;format('fontWeight',el&&Number(getComputedStyle(el).fontWeight)>=600?'400':'700');};
 toggleItalic=function(){const n=saved?.range.startContainer;const el=n?.nodeType===1?n:n?.parentElement;format('fontStyle',el&&getComputedStyle(el).fontStyle==='italic'?'normal':'italic');};
 // At the end of edited text, resume the object's original formatting.
 // A caret inside existing text still edits that text in its own style.
 const previousInsert=insertRekhtaText;
 insertRekhtaText=function(el,text){
  const s=getSelection();
  if(el&&s.rangeCount){
   const r=s.getRangeAt(0);
   if(r.collapsed&&el.contains(r.startContainer)){
    let node=r.startContainer.nodeType===1?r.startContainer:r.startContainer.parentElement;
    let boundary=null;
    while(node&&node!==el){
     if(node.dataset?.rekhtaSelectionStyle==='1'){
      const rest=r.cloneRange();rest.setEnd(node,node.childNodes.length);
      if(!rest.toString()&&!rest.cloneContents().querySelector('br,img,svg'))boundary=node;
     }
     node=node.parentElement;
    }
    if(boundary){
     const normal=document.createElement('span'),style=getComputedStyle(el);
     for(const prop of ['fontFamily','fontSize','color','fontWeight','fontStyle','textDecoration'])normal.style[prop]=style[prop];
     const outside=document.createRange();outside.setStartAfter(boundary);outside.collapse(true);outside.insertNode(normal);
     const caret=document.createRange();caret.selectNodeContents(normal);caret.collapse(true);
     s.removeAllRanges();s.addRange(caret);
    }
   }
  }
  return previousInsert.call(this,el,text);
 };
 // Keyboard focus through Tab must preserve the same range as mouse controls.
 for(const id of ['fontSize','fontFamily','textColor']){
  document.getElementById(id)?.addEventListener('focus',()=>{control=id;});
 }
})();
