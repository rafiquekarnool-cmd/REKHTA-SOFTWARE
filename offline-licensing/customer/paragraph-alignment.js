/* Align only the current or selected paragraphs; keep direction and other objects intact. */
(()=>{
let remembered=null;
document.addEventListener('selectionchange',()=>{const s=getSelection();if(!s.rangeCount)return;const r=s.getRangeAt(0),n=r.commonAncestorContainer,e=(n.nodeType===1?n:n.parentElement)?.closest('.textobj');if(e&&page.contains(e))remembered={el:e,range:r.cloneRange()};});
const blockTags=new Set(['DIV','P','LI','H1','H2','H3','H4','H5','H6','PRE','BLOCKQUOTE']);
function alignment(el){const style=getComputedStyle(el);if(style.textAlign==='start')return style.direction==='rtl'?'right':'left';if(style.textAlign==='end')return style.direction==='rtl'?'left':'right';return style.textAlign;}
function inheritedStyles(block,root){const result={},a=getComputedStyle(block),b=getComputedStyle(root);for(const property of ['fontFamily','fontSize','color','fontWeight','fontStyle','textDecorationLine','lineHeight','letterSpacing','wordSpacing'])if(a[property]!==b[property])result[property]=a[property];return result;}
function compare(a,b){const r=document.createRange(),s=document.createRange();r.setStart(a.node,a.offset);r.collapse(true);s.setStart(b.node,b.offset);s.collapse(true);return r.compareBoundaryPoints(Range.START_TO_START,s);}
function paragraphs(el){
 const items=[];let start={node:el,offset:0},lastBreak=false;
 const point=(node,after=false)=>({node:node.parentNode,offset:[...node.parentNode.childNodes].indexOf(node)+(after?1:0)});
 function flush(end,force=false){const r=document.createRange();r.setStart(start.node,start.offset);r.setEnd(end.node,end.offset);const f=r.cloneContents();if(force||f.textContent||f.querySelector('img,svg,.geometric-inline')){const n=r.startContainer.nodeType===1?r.startContainer:r.startContainer.parentElement,ancestor=n.closest?.('[data-rekhta-paragraph],div,p,li'),block=ancestor&&el.contains(ancestor)?ancestor:el;items.push({range:r,align:alignment(block),styles:inheritedStyles(block,el)});}start=end;}
 function walk(node){for(const child of [...node.childNodes]){if(child.nodeType!==1){if(child.textContent)lastBreak=false;continue;}if(child.matches('.handle,.rk-node'))continue;if(child.tagName==='BR'){flush(point(child),true);start=point(child,true);lastBreak=true;}else if(blockTags.has(child.tagName)){flush(point(child));start={node:child,offset:0};const before=items.length;walk(child);flush({node:child,offset:child.childNodes.length},items.length===before);start=point(child,true);lastBreak=false;}else walk(child);}}
 walk(el);const end={node:el,offset:el.childNodes.length};flush(end,!items.length||lastBreak);return items;
}
function stripBlocks(fragment){for(const node of [...fragment.querySelectorAll('div,p,li,h1,h2,h3,h4,h5,h6,pre,blockquote')].reverse()){const span=document.createElement('span');span.style.cssText=node.style.cssText;span.style.removeProperty('text-align');span.style.removeProperty('display');if(node.dir)span.dir=node.dir;while(node.firstChild)span.append(node.firstChild);node.replaceWith(span);}fragment.querySelectorAll('.handle,.rk-node').forEach(e=>e.remove());return fragment;}
function locate(items,point){for(let i=items.length-1;i>=0;i--){const r=items[i].range,a={node:r.startContainer,offset:r.startOffset},b={node:r.endContainer,offset:r.endOffset};if(compare(point,a)>=0&&compare(point,b)<=0){const prefix=r.cloneRange();prefix.setEnd(point.node,point.offset);return {line:i,offset:prefix.toString().length};}}return {line:point.offset===0?0:items.length-1,offset:point.offset===0?0:items.at(-1).range.toString().length};}
function textPoint(el,offset){const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n,last;while((n=w.nextNode())){last=n;if(offset<=n.length)return {node:n,offset};offset-=n.length;}return last?{node:last,offset:last.length}:{node:el,offset:0};}
setAlign=function(value){
 if(!['left','center','right'].includes(value))return;
 const el=selected?(selected.dataset.type==='text'?selected:null):remembered?.el;if(!el?.isConnected||!page.contains(el))return toast('Click a text line first.');if(el.classList.contains('locked'))return toast('Unlock the text before changing alignment.');
 const s=getSelection();let r=s.rangeCount?s.getRangeAt(0):null;if(!r||!el.contains(r.startContainer)||!el.contains(r.endContainer))r=remembered?.el===el&&el.contains(remembered.range.startContainer)&&el.contains(remembered.range.endContainer)?remembered.range:null;
 const lines=paragraphs(el),start=r?{node:r.startContainer,offset:r.startOffset}:null,end=r?{node:r.endContainer,offset:r.endOffset}:null,first=start?locate(lines,start):null,last=end?locate(lines,end):null;
 const chosen=lines.map((p,i)=>{if(!r)return true;if(r.collapsed)return i===first.line;const a={node:p.range.startContainer,offset:p.range.startOffset},b={node:p.range.endContainer,offset:p.range.endOffset};return compare(start,b)<0&&compare(end,a)>0;});
 const wrappers=lines.map((p,i)=>{const div=document.createElement('div');div.dataset.rekhtaParagraph='1';Object.assign(div.style,p.styles);div.style.textAlign=chosen[i]?value:p.align;div.append(stripBlocks(p.range.cloneContents()));if(!div.textContent&&!div.querySelector('br,img,svg,.geometric-inline'))div.append(document.createElement('br'));return div;});
 snapshot();el.replaceChildren(...wrappers);el.focus({preventScroll:true});
 if(r){const a=textPoint(wrappers[first.line],first.offset),b=textPoint(wrappers[last.line],last.offset),range=document.createRange();range.setStart(a.node,a.offset);range.setEnd(b.node,b.offset);s.removeAllRanges();s.addRange(range);remembered={el,range:range.cloneRange()};document.dispatchEvent(new Event('selectionchange'));}
 refreshLayerName(el);snapshot();
};
for(const [value,label] of [['left','Align Left'],['center','Align Center'],['right','Align Right']])for(const b of document.querySelectorAll('[onclick="setAlign(\''+value+'\')"],[data-action="align'+value+'"]')){b.title=label+' — current or selected paragraphs';b.setAttribute('aria-label',label);}
window.addEventListener('keydown',e=>{if(!(e.ctrlKey||e.metaKey)||e.altKey||e.shiftKey||!document.activeElement?.classList.contains('textobj'))return;const value={l:'left',e:'center',r:'right'}[e.key.toLowerCase()];if(!value)return;e.preventDefault();e.stopImmediatePropagation();setAlign(value);},true);
})();
