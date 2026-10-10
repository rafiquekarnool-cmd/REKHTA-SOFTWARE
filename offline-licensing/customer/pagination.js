(function(){
'use strict';
const GAP=32,px=96/25.4;let paperH=page.offsetHeight||1123,count=1,running=false,queued=false,nextFlow=1;
const style=document.createElement('style');style.textContent=`@media screen{#page.rk-multipage{background:transparent!important;box-shadow:none!important;border:0!important;overflow:visible!important}#page.rk-multipage::after{display:none!important}.rk-paper{position:absolute;left:0;width:100%;background:white;box-shadow:0 3px 16px #0003;pointer-events:none;z-index:0}.rk-paper span{position:absolute;bottom:-25px;right:0;font:11px Arial;color:#445b56}.rk-paper .rk-margin{position:absolute;border:1px dashed #4a90e2;pointer-events:none}}
#page .textobj[data-flow-id],#page .rk-flow-measure{white-space:pre-wrap!important;overflow-wrap:break-word!important;column-count:var(--flow-columns,1)!important;column-gap:var(--flow-gutter,16px)!important;column-fill:auto!important;height:var(--rk-frame-height)!important;min-height:0!important;min-width:1px!important;overflow:visible!important}
.rk-flow-measure{position:absolute!important;pointer-events:none!important;opacity:0!important;z-index:-1!important}
@media print{html body #app#app#app,html body #rkPrintPages~*{display:none!important}html body #rkPrintPages#rkPrintPages#rkPrintPages,html body #rkPrintPages#rkPrintPages#rkPrintPages *{display:revert!important}html body #rkPrintPages{position:static!important;margin:0!important;padding:0!important}.rk-print-paper{position:relative!important;margin:0!important;padding:0!important;overflow:hidden!important;break-after:page!important;page-break-after:always!important;break-inside:avoid!important}.rk-print-paper:last-child{break-after:auto!important;page-break-after:auto!important}.rk-paper,.rk-flow-measure{display:none!important}}`;document.head.append(style);
function margin(k){return Math.max(0,Number(documentSettings?.[k]??12.7)*px);}
function visible(el){return el.dataset.layerHidden!=='1'&&el.style.display!=='none';}
function objects(){return [...page.children].filter(el=>el.classList.contains('obj'));}
function bodyCopy(el){const c=el.cloneNode(true);c.querySelectorAll('.handle,.rk-node').forEach(n=>n.remove());return c;}
function tokens(root){const result=[];function walk(node){if(node.nodeType===3){for(let i=0;i<node.length;){const n=String.fromCodePoint(node.data.codePointAt(i)).length;result.push({node,offset:i,length:n});i+=n;}}else if(node.nodeType===1){if(node.matches('.handle,.rk-node'))return;if(node.tagName==='BR'){result.push({node,offset:0,length:node.hasAttribute('data-rekhta-caret-tail')?0:1});}else for(const child of node.childNodes)walk(child);}}for(const child of root.childNodes)walk(child);return result;}
function length(root){let n=0;function walk(node){if(node.nodeType===3)n+=node.length;else if(node.nodeType===1||node.nodeType===11){if(node.nodeType===1&&node.matches('.handle,.rk-node'))return;if(node.nodeName==='BR'){if(!node.hasAttribute('data-rekhta-caret-tail'))n++;}else for(const child of node.childNodes)walk(child);}}walk(root);return n;}
function boundary(range,t){if(t.node.nodeType===3)range.setStart(t.node,t.offset);else range.setStartBefore(t.node);}
function position(root,offset){const list=tokens(root);for(const t of list){if(offset<t.length||t.length===0){return t.node.nodeType===3?{node:t.node,offset:t.offset+offset}:{node:t.node.parentNode,offset:[...t.node.parentNode.childNodes].indexOf(t.node)};}offset-=t.length;}return {node:root,offset:root.childNodes.length};}
function caretOffset(el){const s=getSelection();if(!s.rangeCount||!el.contains(s.anchorNode))return null;const r=s.getRangeAt(0).cloneRange();r.selectNodeContents(el);r.setEnd(s.anchorNode,s.anchorOffset);return length(r.cloneContents());}
function setCaret(el,offset){selectObj(el,false);el.focus({preventScroll:true});const p=position(el,offset),r=document.createRange();r.setStart(p.node,p.offset);r.collapse(true);getSelection().removeAllRanges();getSelection().addRange(r);el.scrollIntoView({block:'nearest',inline:'nearest'});caretPage();}
function join(a,b,depth){if(depth>0&&a.lastChild?.nodeType===1&&b.firstChild?.nodeType===1&&a.lastChild.tagName===b.firstChild.tagName){const last=a.lastChild,first=b.firstChild;join(last,first,depth-1);first.remove();}while(b.firstChild)a.append(b.firstChild);}
function split(ghost,available){
 ghost.style.setProperty('--rk-frame-height',available+'px');const rect=ghost.getBoundingClientRect(),list=tokens(ghost);let offset=0;
 const outside=(start,end)=>{const r=document.createRange();boundary(r,list[start]);const t=list[end];if(t.node.nodeType===3)r.setEnd(t.node,t.offset+t.length);else r.setEndAfter(t.node);const box=r.getBoundingClientRect();return box.height&&(box.left<rect.left-zoom||box.right>rect.right+zoom);};
 // Measure runs first; inspect individual glyphs only in a run crossing the page boundary.
 for(let start=0;start<list.length;start+=32){const end=Math.min(list.length-1,start+31),crosses=outside(start,end);
  for(let i=start;i<=end;i++){const t=list[i];if(crosses&&outside(i,i)){
   const cut=document.createRange();boundary(cut,t);cut.setEnd(ghost,ghost.childNodes.length);let depth=0;for(let p=t.node.parentElement;p&&p!==ghost;p=p.parentElement)depth++;
   const tail=document.createElement('div');tail.append(cut.extractContents());return {tail,depth,offset};
  }offset+=t.length;}
 }return null;
}
const pending=new Set();let timer;
function drain(){queued=false;timer=null;const list=[...pending];pending.clear();const flows=new Set();for(const el of list){const key=el.dataset.flowId||el;if(!flows.has(key)){flows.add(key);paginate(el);}}}
function repaint(){
 let n=1;for(const el of objects())if(visible(el))n=Math.max(n,Math.floor(Math.max(0,parseFloat(el.style.top)||0)/(paperH+GAP))+1);count=n;
 page.classList.toggle('rk-multipage',count>1);page.style.height=(count*paperH+(count-1)*GAP)+'px';page.querySelectorAll(':scope > .rk-paper').forEach(e=>e.remove());
 if(count>1)for(let i=0;i<count;i++){const b=document.createElement('div');b.className='rk-paper';b.style.top=i*(paperH+GAP)+'px';b.style.height=paperH+'px';const label=document.createElement('span');label.textContent='Page '+(i+1)+' / '+count;b.append(label);if(page.classList.contains('margin-guides')){const guide=document.createElement('div');guide.className='rk-margin';guide.style.cssText=`left:${margin('left')}px;right:${margin('right')}px;top:${margin('top')}px;bottom:${margin('bottom')}px`;b.append(guide);}page.prepend(b);}
 document.querySelector('.stage-space').style.height=Math.max(stageWrap.clientHeight,page.offsetHeight*zoom+80)+'px';queueStatus();
}
function paginate(source){
 if(running||!source?.isConnected||source.dataset.type!=='text'||!visible(source)||source.classList.contains('locked'))return;
 running=true;let ghost;try{
  const id=source.dataset.flowId,frames=id?objects().filter(el=>el.dataset.flowId===id&&visible(el)).sort((a,b)=>Number(a.dataset.flowOrder)-Number(b.dataset.flowOrder)):[source],first=frames[0];
  const active=document.activeElement,local=frames.includes(active)?caretOffset(active):null;let cursor=local;
  if(cursor!==null)for(const f of frames){if(f===active)break;cursor+=length(bodyCopy(f));}
  const top=parseFloat(first.style.top)||0,startPage=Math.floor(top/(paperH+GAP)),firstY=Math.max(margin('top'),top-startPage*(paperH+GAP));
  const x=Math.max(margin('left'),parseFloat(first.style.left)||0),w=Math.max(80,Math.min(parseFloat(first.style.width)||first.offsetWidth,page.offsetWidth-x-margin('right')));
  ghost=bodyCopy(first);ghost.classList.remove('obj','selected','keyboard-selected');ghost.classList.add('rk-flow-measure');delete ghost.dataset.flowId;ghost.style.left=x+'px';ghost.style.top='0';ghost.style.width=w+'px';ghost.style.transform='none';ghost.style.setProperty('--flow-columns',first.style.getPropertyValue('--flow-columns')||String(documentSettings.columns||1));ghost.style.setProperty('--flow-gutter',first.style.getPropertyValue('--flow-gutter')||margin('gutter')+'px');
  for(const f of frames.slice(1)){const c=bodyCopy(f);join(ghost,c,Number(f.dataset.flowJoin)||0);}page.append(ghost);
  const chunks=[];let pageNo=startPage,y=firstY,joinDepth=0;for(let guard=0;guard<500;guard++){
   const available=Math.max(32,paperH-y-margin('bottom')),rest=split(ghost,available),html=ghost.innerHTML;
   if(!html&&rest){ghost.innerHTML=rest.tail.innerHTML;pageNo++;y=margin('top');continue;}
   chunks.push({html,pageNo,y,available,joinDepth,len:length(ghost)});if(!rest)break;if(rest.offset===0)throw Error('A text line is taller than the page. Reduce its font size.');ghost.innerHTML=rest.tail.innerHTML;joinDepth=rest.depth;pageNo++;y=margin('top');
   if(guard===499)throw Error('Split very large documents into smaller files.');
  }
  if(!id&&chunks.length===1)return;
  const flow=id||'flow-'+Date.now()+'-'+nextFlow++,template=first.style.cssText,attributes=[...first.attributes].filter(a=>a.name.startsWith('data-')&&!['data-id','data-flow-id','data-flow-order','data-flow-join'].includes(a.name));let target=null,remaining=cursor;
  chunks.forEach((chunk,i)=>{let el=frames[i];if(!el){el=baseObj('text',x,0,w,chunk.available);el.classList.add('textobj');el.contentEditable='true';el.spellcheck=false;el.addEventListener('focus',()=>selectObj(el,false));el.addEventListener('input',()=>debouncedSnapshot());}
   for(const a of attributes)el.setAttribute(a.name,a.value);el.setAttribute('dir',first.dir||'rtl');el.setAttribute('lang',first.lang||'ur');el.style.cssText=template;el.style.left=x+'px';el.style.top=chunk.pageNo*(paperH+GAP)+chunk.y+'px';el.style.width=w+'px';el.style.setProperty('--rk-frame-height',chunk.available+'px');el.dataset.flowId=flow;el.dataset.flowOrder=String(i);el.dataset.flowJoin=String(chunk.joinDepth);if(el.innerHTML!==chunk.html)el.innerHTML=chunk.html;
   if(remaining!==null&&!target){if(remaining<chunk.len||remaining===chunk.len&&frames.indexOf(active)<=i||i===chunks.length-1)target={el,offset:Math.min(remaining,chunk.len)};else remaining-=chunk.len;}
  });frames.slice(chunks.length).forEach(el=>el.remove());repaint();if(target)setCaret(target.el,target.offset);else if(selected&&!selected.isConnected)selectObj(first,false);refreshLayers();
 }catch(e){toast(e.message);console.error('Pagination:',e.message);}finally{ghost?.remove();running=false;observer.takeRecords();}
}
function schedule(el){if(running||!el)return;pending.add(el);if(queued)return;queued=true;timer=setTimeout(drain,80);}
page.addEventListener('input',e=>{const el=e.target.closest('.textobj');if(el)schedule(el);},true);
const insert=insertRekhtaText;insertRekhtaText=function(el,text){const result=insert(el,text);schedule(el);return result;};
const observer=new MutationObserver(records=>{if(running)return;for(const r of records){const el=(r.target.nodeType===1?r.target:r.target.parentElement)?.closest('.textobj');if(el&&visible(el)){schedule(el);break;}}});observer.observe(page,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['style']});
const serial=serialize;serialize=function(){const d=serial(),t=document.createElement('template');t.innerHTML=d.html;t.content.querySelectorAll('.rk-paper,.rk-flow-measure').forEach(n=>n.remove());d.html=t.innerHTML;d.page.h=paperH;d.pagination={height:paperH,count,gap:GAP};return d;};
const restoreOld=restore;restore=function(d){clearTimeout(timer);pending.clear();queued=false;running=true;try{paperH=d.pagination?.height||d.page.h;restoreOld(d);repaint();}finally{running=false;observer.takeRecords();}};
const newOld=newDoc;newDoc=function(...args){if(args[0]!==false)return newOld(...args);clearTimeout(timer);pending.clear();queued=false;running=true;count=1;try{newOld(...args);paperH=page.offsetHeight;repaint();}finally{running=false;observer.takeRecords();}};
const settingsOld=applyDocumentSettings;applyDocumentSettings=function(...args){const was=running;running=true;const oldStride=paperH+GAP;try{const r=settingsOld(...args);paperH=Number(args[0].height)*px;for(const el of objects()){const top=parseFloat(el.style.top)||0,index=Math.floor(top/oldStride);el.style.top=(index*(paperH+GAP)+top-index*oldStride)+'px';}repaint();return r;}finally{running=was;observer.takeRecords();if(!running)for(const el of objects())if(el.dataset.flowId) schedule(el);}};
const fitOld=fitPage;fitPage=function(){if(count===1)return fitOld();const box=stageWrap.getBoundingClientRect();setZoom(Math.min(1,(box.width-120)/page.offsetWidth,(box.height-90)/paperH));};
window.addEventListener('keydown',e=>{
 const el=document.activeElement,selection=getSelection();if(!el?.dataset.flowId||!selection.isCollapsed||!selection.rangeCount||e.ctrlKey||e.altKey||e.metaKey||e.shiftKey)return;
 const offset=caretOffset(el),frames=objects().filter(f=>f.dataset.flowId===el.dataset.flowId&&visible(f)).sort((a,b)=>Number(a.dataset.flowOrder)-Number(b.dataset.flowOrder)),i=frames.indexOf(el);let next=null;
 if(['ArrowDown','ArrowUp'].includes(e.key)&&typeof selection.modify==='function'){
  const old=selection.getRangeAt(0).cloneRange(),before=old.getBoundingClientRect(),down=e.key==='ArrowDown',neighbor=frames[i+(down?1:-1)];
  selection.modify('move',down?'forward':'backward','line');const moved=selection.getRangeAt(0),after=moved.getBoundingClientRect();
  const same=old.startContainer===moved.startContainer&&old.startOffset===moved.startOffset;
  if(neighbor&&((down?offset===length(bodyCopy(el)):offset===0)||same||before.height&&after.height&&Math.abs(before.top-after.top)<Math.max(1,zoom))){
   selection.removeAllRanges();selection.addRange(old);next={el:neighbor,offset:down?0:length(bodyCopy(neighbor))};
  }else{e.preventDefault();e.stopImmediatePropagation();caretPage();return;}
 }
 if((e.key==='PageDown'||offset===length(bodyCopy(el))&&e.key===(el.dir==='rtl'?'ArrowLeft':'ArrowRight'))&&frames[i+1])next={el:frames[i+1],offset:0};
 if((e.key==='PageUp'||offset===0&&[el.dir==='rtl'?'ArrowRight':'ArrowLeft','Backspace'].includes(e.key))&&frames[i-1])next={el:frames[i-1],offset:length(bodyCopy(frames[i-1]))};
 if(next){e.preventDefault();e.stopImmediatePropagation();setCaret(next.el,next.offset);if(e.key==='Backspace'){document.execCommand('delete');schedule(next.el);}}
},true);
function makePaper(index,transparent=false){const p=document.createElement('div');p.className='rk-print-paper';p.style.cssText=`position:relative;width:${page.offsetWidth}px;height:${paperH}px;overflow:hidden;background:${transparent?'transparent':'white'};`;const offset=index*(paperH+GAP);for(const el of objects()){if(!visible(el))continue;const top=parseFloat(el.style.top)||0;if(top+el.offsetHeight<=offset||top>=offset+paperH)continue;const c=bodyCopy(el);c.classList.remove('selected','keyboard-selected');c.removeAttribute('contenteditable');c.style.top=top-offset+'px';c.style.outline='none';p.append(c);}return p;}
function preparePrint(){document.getElementById('rkPrintPages')?.remove();const root=document.createElement('div');root.id='rkPrintPages';root.style.display='none';for(let i=0;i<count;i++)root.append(makePaper(i));document.body.append(root);let s=document.getElementById('rkPaperPrintSize');if(!s){s=document.createElement('style');s.id='rkPaperPrintSize';document.head.append(s);}s.textContent=`@media print{@page{size:${page.offsetWidth/px}mm ${paperH/px}mm;margin:0}html body{height:auto!important}}`;return root;}
window.addEventListener('beforeprint',preparePrint);window.addEventListener('afterprint',()=>document.getElementById('rkPrintPages')?.remove());
async function canvasFor(index,options){const p=makePaper(index,options.transparent||options.format==='eps'),holder=document.createElement('div');holder.style.cssText='position:fixed;left:0;top:0;z-index:-2147483647;pointer-events:none;';holder.append(p);document.body.append(holder);try{const c=await captureRekhtaCanvas(p,{width:page.offsetWidth,height:paperH,scale:(options.dpi||300)/96*(options.scaling||100)/100,backgroundColor:options.transparent||options.format==='eps'?null:'#ffffff'});if(options.gray){const x=c.getContext('2d'),d=x.getImageData(0,0,c.width,c.height);for(let i=0;i<d.data.length;i+=4)d.data[i]=d.data[i+1]=d.data[i+2]=Math.round(.299*d.data[i]+.587*d.data[i+1]+.114*d.data[i+2]);x.putImageData(d,0,0);}return c;}finally{holder.remove();}}
function zipStore(files){const parts=[],central=[];let offset=0;const enc=new TextEncoder();const crc=b=>{let c=0xffffffff;for(const x of b){c^=x;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;};for(const f of files){const name=enc.encode(f.name),b=f.bytes,c=crc(b),head=new Uint8Array(30+name.length),v=new DataView(head.buffer);v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint32(14,c,true);v.setUint32(18,b.length,true);v.setUint32(22,b.length,true);v.setUint16(26,name.length,true);head.set(name,30);parts.push(head,b);const cent=new Uint8Array(46+name.length),d=new DataView(cent.buffer);d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint32(16,c,true);d.setUint32(20,b.length,true);d.setUint32(24,b.length,true);d.setUint16(28,name.length,true);d.setUint32(42,offset,true);cent.set(name,46);central.push(cent);offset+=head.length+b.length;}const end=new Uint8Array(22),e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,central.reduce((n,c)=>n+c.length,0),true);e.setUint32(16,offset,true);return new Blob([...parts,...central,end],{type:'application/zip'});}
const exportOld=runConfiguredExport;runConfiguredExport=async function(o){if(o.area==='selection')return exportOld(o);const from=o.from||1,to=o.to||count;if(!Number.isInteger(from)||!Number.isInteger(to)||from<1||to>count||from>to)throw Error('Choose a valid page range.');const factor=(o.scaling||100)/100,w=page.offsetWidth/px*factor,h=paperH/px*factor,name=(o.name||'REKHTA').replace(/[<>:"/\\|?*]/g,'_').replace(/\.(png|jpe?g|gif|pdf|eps|zip)$/i,'')||'REKHTA';let pdf,files=[];
 for(let i=from-1;i<to;i++){const canvas=await canvasFor(i,o);if(o.format==='pdf'){if(!pdf)pdf=new jspdf.jsPDF({orientation:w>h?'landscape':'portrait',unit:'mm',format:[w,h]});else pdf.addPage([w,h],w>h?'landscape':'portrait');pdf.addImage(canvas.toDataURL('image/png'),'PNG',0,0,w,h);continue;}let blob;if(o.format==='eps')blob=await encodeRekhtaPathEPS(canvas,page.offsetWidth,paperH,o);else if(o.format==='gif')blob=encodeRekhtaGIF(canvas,o.gray);else blob=await new Promise(r=>canvas.toBlob(r,o.format==='jpg'?'image/jpeg':'image/png',o.quality));if(!blob)throw Error('Page export failed.');files.push({name:name+'-page-'+(i+1)+'.'+o.format,bytes:new Uint8Array(await blob.arrayBuffer())});}
 if(o.format==='eps'){
  for(let index=0;index<files.length;index++){
   const f=files[index],blob=new Blob([f.bytes],{type:'application/postscript'});let target=index===0?o.desktopTarget:null;
   if(index>0&&o.desktopTarget){target=await rekhtaDesktop.chooseSave({name:f.name,extension:'eps'});if(!target)throw Error('Remaining EPS pages were not saved. Choose their page range and export again.');}
   if(target)await rekhtaDesktop.writeSave(target.id,Array.from(f.bytes));
   else await saveConfiguredExport(blob,f.name,{...o,fileHandle:index===0?o.fileHandle:undefined,desktopTarget:undefined});
  }
  return new Blob([files[0].bytes],{type:'application/postscript'});
 }
 const blob=pdf?pdf.output('blob'):files.length===1?new Blob([files[0].bytes]):zipStore(files),filename=pdf?name+'.pdf':files.length===1?files[0].name:name+'-pages.zip';if(o.desktopTarget)await rekhtaDesktop.writeSave(o.desktopTarget.id,Array.from(new Uint8Array(await blob.arrayBuffer())));else await saveConfiguredExport(blob,filename,o);return blob;
};
const dialogOld=openExportDialog;openExportDialog=function(...args){dialogOld(...args);const root=ipDialogBackdrop.querySelector('.export-picture-dialog');if(!root)return;expFrom.max=expTo.max=String(count);expTo.value=count;root.querySelector('.export-range .export-note').textContent='This document has '+count+' page'+(count>1?'s.':'.');if(!args[1])expAll.checked=true;root.querySelector('.export-picture-help').onclick=()=>alert('All Pages exports the complete document. PDF has one sheet per page. Multiple PNG, JPEG or GIF pages are downloaded together in a ZIP. EPS exports one separate .eps file per page. Your browser may ask to allow multiple downloads. Selected Objects exports only the selection.');let desktopTarget;
 expBrowse.onclick=async()=>{try{if(!window.rekhtaDesktop?.chooseSave)return;const pages=expAll.checked?count:expPages.checked?Number(expTo.value)-Number(expFrom.value)+1:1,extension=pages>1&&!['pdf','eps'].includes(expFormat.value)?'zip':expFormat.value;desktopTarget=await rekhtaDesktop.chooseSave({name:(expName.value||'REKHTA')+'.'+extension,extension});expDestination.textContent=desktopTarget?.name||'Cancelled';}catch(e){expError.textContent=e.message;}};
 const original=ipDialogApply.onclick;ipDialogApply.onclick=async()=>{if(expSelected.checked)return original();ipDialogApply.disabled=true;try{const scaling=Number(expScaling.value);if(!Number.isFinite(scaling)||scaling<10||scaling>400)throw Error('Choose scaling from 10% to 400%.');await runConfiguredExport({name:expName.value,format:expFormat.value,area:'page',from:expAll.checked?1:Number(expFrom.value),to:expAll.checked?count:Number(expTo.value),dpi:Number(expDpi.value),scaling,gray:expColour.value==='gray',transparent:expTransparent.checked,quality:Number(expQuality.value)/100,desktopTarget});closeIpDialog();toast('All selected pages exported.');}catch(e){expError.textContent=e.message;}finally{ipDialogApply.disabled=false;}};
};
// CorelDRAW accepts one page per EPS. Default to the page currently being edited.
openCorelExport=function(){
 const top=selected?.isConnected?parseFloat(selected.style.top)||0:(typeof lastPageClick==='object'?lastPageClick.y||0:0);
 if(document.activeElement?.classList.contains('textobj'))paginate(document.activeElement);
 const number=Math.max(1,Math.min(count,Math.floor(top/(paperH+GAP))+1));
 openExportDialog('eps');expAll.checked=false;expSelected.checked=false;expPages.checked=true;expFrom.value=expTo.value=String(number);expTransparent.checked=true;
};
const status=document.createElement('span');status.id='rkCurrentPage';status.style.cssText='font-weight:600;white-space:nowrap';document.querySelector('.statusbar .grow')?.before(status);
let current=1,statusFrame=0,caretScrollUntil=0;
function showPage(n){current=Math.max(1,Math.min(count,n));const text='Page '+current+' of '+count;if(status.textContent!==text)status.textContent=text;}
function queueStatus(){if(statusFrame)return;statusFrame=requestAnimationFrame(()=>{statusFrame=0;showPage(current);});}
function caretPage(){const s=getSelection(),node=s.anchorNode,el=(node?.nodeType===1?node:node?.parentElement)?.closest('.textobj');if(el&&page.contains(el)){caretScrollUntil=performance.now()+180;showPage(Math.floor((parseFloat(el.style.top)||0)/(paperH+GAP))+1);}}
page.addEventListener('pointerdown',e=>{const r=page.getBoundingClientRect(),scale=r.width/page.offsetWidth;showPage(Math.floor(Math.max(0,(e.clientY-r.top)/scale)/(paperH+GAP))+1);});
document.addEventListener('selectionchange',caretPage);
stageWrap.addEventListener('scroll',()=>{if(performance.now()<caretScrollUntil)return;const r=page.getBoundingClientRect(),v=stageWrap.getBoundingClientRect(),scale=r.width/page.offsetWidth;showPage(Math.floor(Math.max(0,(v.top+Math.min(v.height/2,paperH*scale/2)-r.top)/scale)/(paperH+GAP))+1);},{passive:true});
showPage(1);
window.rekhtaPagination={paginate,makePaper,preparePrint,canvasFor,zipStore,get currentPage(){return current;},get count(){return count;},get height(){return paperH;},get frames(){return objects().filter(e=>e.dataset.flowId);},flush(){if(document.activeElement?.classList.contains('textobj'))paginate(document.activeElement);}};
})();
