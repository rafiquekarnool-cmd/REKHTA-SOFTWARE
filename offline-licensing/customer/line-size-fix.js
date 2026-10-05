(function(){
let remembered=null;
const size=document.getElementById('fontSize');if(!size)return;
document.addEventListener('selectionchange',()=>{const s=window.getSelection();if(s.rangeCount&&selected?.dataset.type==='text'&&selected.contains(s.anchorNode)&&selected.contains(s.focusNode))remembered={object:selected,range:s.getRangeAt(0).cloneRange()};});
const apply=applyTextStyle;
applyTextStyle=function(property){
 if(property!=='fontSize')return apply.apply(this,arguments);
 const object=selected;if(!object||object.dataset.type!=='text')return;
 const value=Number(size.value);if(!Number.isFinite(value)||value<8||value>200)return;
 const selection=window.getSelection();let range=remembered?.object===object&&object.contains(remembered.range.startContainer)?remembered.range.cloneRange():null;
 if(!range){object.focus();if(selection.rangeCount&&object.contains(selection.anchorNode))range=selection.getRangeAt(0).cloneRange();else{range=document.createRange();range.selectNodeContents(object);range.collapse(true);}}
 object.focus();selection.removeAllRanges();selection.addRange(range);
 if(range.collapsed){
  selection.modify('move','backward','lineboundary');
  selection.modify('extend','forward','lineboundary');
  range=selection.getRangeAt(0).cloneRange();
  if(!object.contains(range.startContainer)||!object.contains(range.endContainer)){selection.removeAllRanges();selection.addRange(remembered?.range||range);return;}
 }
 document.execCommand('styleWithCSS',false,false);
 document.execCommand('fontSize',false,'7');
 for(const font of object.querySelectorAll('font[size="7"]')){font.removeAttribute('size');font.style.fontSize=value+'px';}
 snapshot();if(selection.rangeCount)remembered={object,range:selection.getRangeAt(0).cloneRange()};
};
size.step='1';size.onchange=null;
size.addEventListener('input',()=>{if(!size.value||!size.validity.valid)return;const focused=document.activeElement===size;applyTextStyle('fontSize');if(focused)size.focus({preventScroll:true});});
})();
