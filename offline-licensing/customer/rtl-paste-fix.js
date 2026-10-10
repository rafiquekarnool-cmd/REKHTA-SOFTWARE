/* Plain-text Urdu paste: OCR bidi cleanup and paragraph direction independent of input language. */
(()=>{
const urdu=/[\u0620-\u064a\u066e-\u06d3\u06fa-\u06ff\u0750-\u077f\u08a0-\u08ff\ufb50-\ufdff\ufe70-\ufefc]/;
const clean=text=>String(text).replace(/\r\n?/g,'\n').replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g,'');
const previous=insertRekhtaText;
insertRekhtaText=function(el,value){
 const text=String(value).length>1?clean(value):String(value);
 if(!el||el.classList.contains('locked')||text.length<2||!urdu.test(text))return previous.call(this,el,text);
 const selection=getSelection();let range=selection.rangeCount?selection.getRangeAt(0):null;
 if(!range||!el.contains(range.startContainer)||!el.contains(range.endContainer)){range=document.createRange();range.selectNodeContents(el);range.collapse(false);}
 const remaining=document.createRange();remaining.selectNodeContents(el);
 const replacesAll=!el.textContent.trim()||(!range.collapsed&&range.toString()===remaining.toString());
 if(replacesAll){
  el.dir='rtl';el.lang='ur';el.dataset.textDirection='rtl';el.style.direction='rtl';el.style.textAlign='right';el.style.unicodeBidi='isolate';el.style.fontFamily='"Jameel Noori Nastaleeq"';
 }
 // Source HTML is intentionally ignored. Keep OCR text as Unicode, without reversing letters.
 range.deleteContents();const run=document.createElement('span');run.dataset.rekhtaPastedUrdu='1';run.style.fontFamily='"Jameel Noori Nastaleeq"';
 run.style.unicodeBidi='isolate';run.dir='rtl';range.insertNode(run);range.selectNodeContents(run);range.collapse(true);
 el.focus({preventScroll:true});selection.removeAllRanges();selection.addRange(range);previous.call(this,el,text);
 // Latin fragments use the English default within the same Urdu paragraph.
 const walker=document.createTreeWalker(run,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){if(!/[A-Za-z]/.test(node.textContent))continue;const fragment=document.createDocumentFragment();let last=0;for(const match of node.textContent.matchAll(/[A-Za-z][A-Za-z0-9 .,'():\/\-]*/g)){fragment.append(document.createTextNode(node.textContent.slice(last,match.index)));const latin=document.createElement('span');latin.dir='ltr';latin.style.fontFamily='"Times New Roman"';latin.style.unicodeBidi='isolate';latin.textContent=match[0];fragment.append(latin);last=match.index+match[0].length;}fragment.append(document.createTextNode(node.textContent.slice(last)));node.replaceWith(fragment);}
 const caret=document.createRange();caret.setStartAfter(run);caret.collapse(true);selection.removeAllRanges();selection.addRange(caret);
 refreshLayerName(el);if(replacesAll)selectObj(el,false);debouncedSnapshot();
};
function pasteIntoEditor(value,el=null){
 if(el?.classList.contains('locked'))return toast('Unlock the text before pasting.');
 const raw=clean(value||'');if(!raw)return toast('Clipboard has no plain text. Copy the InPage text again.');
 const converted=convertLegacyInPage(raw);
 if(converted.unknown.length){openInPageEncoding();const source=document.getElementById('legacyInPageInput');source.value=raw;source.dispatchEvent(new Event('input',{bubbles:true}));toast('Review the converted InPage text, then click Insert Text.');return;}
 if(!el){const p=typeof lastPageClick==='object'&&lastPageClick?lastPageClick:{x:page.clientWidth-48,y:48};el=createText(p.x,p.y,false);selectObj(el,false);el.focus({preventScroll:true});placeCaretEnd(el);}
 snapshot();insertRekhtaText(el,converted.text);snapshot();
}
window.addEventListener('paste',e=>{
 if(e.target.closest?.('input,textarea,select,.ip-dialog,.wedding-modal'))return;
 const el=e.target.closest?.('.textobj'),surface=page.contains(e.target)||e.target===page;
 if(!el&&!surface)return;if(el&&!page.contains(el))return;
 e.preventDefault();e.stopImmediatePropagation();pasteIntoEditor(e.clipboardData?.getData('text/plain'),el);
},true);
// A blank page is not contenteditable, so browsers do not dispatch a native paste there.
window.addEventListener('keydown',async e=>{
 if(!(e.ctrlKey||e.metaKey)||e.altKey||e.key.toLowerCase()!=='v'||document.activeElement!==page)return;
 e.preventDefault();e.stopImmediatePropagation();
 try{const raw=await navigator.clipboard.readText();pasteIntoEditor(raw);}
 catch(error){
  openIpDialog('Paste InPage / Unicode Text','<p>Press Ctrl+V in this box, then click Insert Text.</p><textarea id="rkInPagePasteInput" rows="5" dir="auto" style="width:100%"></textarea>',null);
  ipDialogApply.hidden=false;ipDialogApply.style.removeProperty('display');ipDialogApply.disabled=false;ipDialogApply.textContent='Insert Text';
  ipDialogApply.onclick=()=>{const raw=document.getElementById('rkInPagePasteInput').value;if(!raw.trim())return toast('Paste text in the box first.');closeIpDialog();pasteIntoEditor(raw);};
  document.getElementById('rkInPagePasteInput').focus();
 }
},true);
window.rekhtaUrduPaste={clean,pasteIntoEditor};
})();
