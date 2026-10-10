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
window.addEventListener('paste',e=>{
 const el=e.target.closest?.('.textobj');if(!el||!page.contains(el))return;
 e.preventDefault();e.stopImmediatePropagation();if(el.classList.contains('locked'))return toast('Unlock the text before pasting.');
 const raw=clean(e.clipboardData?.getData('text/plain')||'');if(!raw)return;
 const converted=convertLegacyInPage(raw);if(converted.unknown.length)return toast('Unknown InPage codes. Use Text → InPage Encoding to review.');
 snapshot();insertRekhtaText(el,converted.text);snapshot();
},true);
window.rekhtaUrduPaste={clean};
})();
