/* REKHTA / RK Solution visual identity. Editor behaviour is unchanged. */
(function(){
const css=document.createElement('style');css.id='rekhtaBrandIdentity';css.textContent=`
@media screen {
 :root{--accent:#2365bd;--line:#cfdbeb;--panel:#f7faff;--text:#263e5b;--muted:#697f99;}
 #dashboard{background:radial-gradient(ellipse at 15% 10%,#ffffff 0%,transparent 48%),linear-gradient(135deg,#edf5ff,#e4effb);}
 .dash-card{border-color:#c9daef;box-shadow:0 24px 64px #244a7917;background:#ffffff;border-radius:18px;}
 .brand-row h1{color:#184b87;font-family:Georgia,serif;letter-spacing:2px;}
 .logo,.appmark .mini{background:linear-gradient(145deg,#194c8c,#3c84d8);box-shadow:0 3px 9px #1d579b24;border:1px solid #ffffff55;letter-spacing:-1px;font-family:Georgia,serif;}
 .dash-btn{border-color:#d3e0ef;box-shadow:0 5px 20px #234c7710;background:linear-gradient(145deg,#ffffff,#f3f8ff);}
 .dash-btn:hover{border-color:#79a5da;box-shadow:0 8px 26px #2359981a;}
 .fullmenubar{background:linear-gradient(#eff6ff,#e6f0fc);border-bottom:1px solid #b9cde7;}
 .menu-head{color:#345477;font-size:12px;border-radius:4px;}
 .menu-head:hover,.menu-wrap.open>.menu-head{background:#d7e8fb;color:#134782;}
 .topbar{background:#ffffff;border-bottom:1px solid #cedcec;gap:5px;}
 .topbar button{font-family:'Segoe UI',Arial,sans-serif;font-size:12px;}
 .topbar .appmark{min-width:138px;gap:8px;margin-right:9px;color:#17497f;}
 .appmark .mini{width:33px;height:33px;border-radius:9px;font-size:16px;}
 .rk-brand-word{display:flex;flex-direction:column;line-height:1.05;}
 .rk-brand-name{font:700 20px Georgia,serif;letter-spacing:1px;}
 .rk-brand-credit{font:10px 'Segoe UI',Arial,sans-serif;letter-spacing:.6px;color:#6282a6;margin-top:4px;}
 .smart-two button{background:#f2f7ff;border:1px solid #c7d9ee;border-radius:5px;color:#235388;padding:6px 9px;}
 .menu-btn:hover,.tool-btn:hover{background:#edf5ff;border-color:#c2d7ef;}
 .formatbar{background:#f6faff;border-bottom:1px solid #cfdeed;gap:5px;}
 .formatbar input,.formatbar select,.rightbar input,.rightbar select{background:#ffffff;border:1px solid #cad9ea;border-radius:5px;color:#2a4669;}
 button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #2776d3;outline-offset:2px;}
 .workspace{background:#e8eff8;}
 .stage-wrap{background:radial-gradient(ellipse at top,#f2f7fd,#e5edf7);}
 .rightbar{background:#f7faff;border-left:1px solid #c8d9ed;padding:10px;}
 .panel-title{font:600 11px 'Segoe UI',Arial,sans-serif;letter-spacing:.65px;color:#365b85;background:#eaf2fc;border:1px solid #d0e0f3;border-radius:5px;padding:8px 9px;}
 .rightbar label{font-size:11px;color:#647e9a;}
 .rightbar .actions button{background:#fff;border:1px solid #ccdced;border-radius:5px;color:#345579;}
 .rk-vector-tools{background:#f0f6fe;border-right:1px solid #c2d6ef;}
 .rk-vector-tools button{padding:4px 2px;overflow-wrap:normal;background:#f8fbff;border:1px solid #c7d9ec;border-radius:5px;color:#315b88;}
 .rk-vector-tools button:hover{background:#e4f0ff;border-color:#8fb5e2;}
 .rk-vector-tools button.active{background:#dcecff;border-color:#78a4d7;color:#164d8c;box-shadow:inset 3px 0 #2771c9;}
 .rk-trace-dialog{background:#ffffff;border:1px solid #b9cde7;border-radius:12px;padding:20px;box-shadow:0 18px 70px #16345738;}
 .rk-trace-dialog h3{color:#214d81;font:600 18px 'Segoe UI',Arial,sans-serif;border-bottom:1px solid #dae5f3;padding-bottom:13px;margin-top:0;}
 .rk-trace-dialog button{background:#f2f7fe;border:1px solid #bdd2ec;border-radius:5px;color:#245182;padding:7px 12px;}
 .rk-trace-dialog [data-apply]{background:#246ac2;border-color:#246ac2;color:white;}
 .rk-trace-dialog [data-apply]:disabled{opacity:.45;}
 .rk-trace-dialog input,.rk-trace-dialog select{border:1px solid #c5d7ec;border-radius:4px;padding:5px;}
 .statusbar{background:#eaf3ff;border-top:1px solid #c3d7ee;color:#57779c;font:11px 'Segoe UI',Arial,sans-serif;}
 .menu-drop,.ip-menu-panel{border-color:#cad9eb;border-radius:6px;box-shadow:0 10px 30px #2149781c;}
}
`;document.head.appendChild(css);
const mark=document.querySelector('.appmark');if(mark){const badge=mark.querySelector('.mini');if(badge)badge.textContent='RK';[...mark.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.remove());const word=document.createElement('span');word.className='rk-brand-word';const name=document.createElement('span');name.className='rk-brand-name';name.textContent='REKHTA';const credit=document.createElement('span');credit.className='rk-brand-credit';credit.textContent='RK SOLUTION';word.append(name,credit);mark.appendChild(word);}
const heading=document.querySelector('.rightbar .panel-title');if(heading)heading.textContent='Design Properties';const footer=[...document.querySelectorAll('.statusbar span')].find(n=>n.textContent==='Fresh Build 3.7');if(footer)footer.textContent='REKHTA Studio';
const logo=document.querySelector('#dashboard .logo');if(logo)logo.textContent='RK';
})();

/* Large scalable toolbar icons; existing buttons and handlers are retained. */
(function(){
const shapes={
New:'M6 3h9l4 4v14H6z M14 3v5h5',Save:'M4 3h14l3 3v15H3V3z M7 3v6h10V3 M7 21v-8h10v8',Load:'M3 7h7l2 2h9v11H3z M3 7V4h7l2 3',Print:'M7 8V3h10v5 M7 17H3V9h18v8h-4 M7 14h10v7H7z',Picture:'M3 3h18v18H3z M3 17l6-6 4 4 3-3 5 5 M16 7h.01',PDF:'M6 3h9l4 4v14H6z M14 3v5h5 M9 16l6-5 M9 11l6 5',Undo:'M9 5L3 11l6 6 M3 11h10a7 7 0 0 1 7 7',Redo:'M15 5l6 6-6 6 M21 11H11a7 7 0 0 0-7 7',Duplicate:'M8 8h13v13H8z M16 8V3H3v13h5',Delete:'M3 6h18 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',Pick:'M5 2v19l5-6 5 7 3-2-5-7h8z',Nodes:'M4 17C4 5 20 5 20 17 M2 15h4v4H2z M18 15h4v4h-4z M10 3h4v4h-4z',Crop:'M7 2v15h15 M2 7h15v15',Zoom:'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14 M15 15l7 7 M7 10h6',Fit:'M8 3H3v5 M16 3h5v5 M3 16v5h5 M21 16v5h-5 M7 7h10v10H7z',Freehand:'M3 18c5-15 5 7 10-5s5-6 8-10',Pen:'M3 21l5-11 8-7 5 5-7 8z M3 21l9-9 M11 12h.01',Text:'M3 4h18 M12 4v17 M7 21h10',Fill:'M3 12l9-9 9 9-9 9z M3 12h18 M19 18l2 3h-4z',Trace:'M3 8V3h5 M16 3h5v5 M3 16v5h5 M16 21h5v-5 M7 16l3-8 7 8z',SVG:'M4 3h16v18H4z M8 10l-3 3 3 3 M16 10l3 3-3 3 M13 9l-2 8',Design:'M4 4h16v16H4z M8 8h8v8H8z',Wedding:'M4 5h16v16H4z M8 3v4 M16 3v4 M4 10h16 M9 15l3 3 3-3'};
function icon(key){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox','0 0 24 24');s.setAttribute('aria-hidden','true');s.setAttribute('focusable','false');s.classList.add('rk-large-icon');const p=document.createElementNS(s.namespaceURI,'path');p.setAttribute('d',shapes[key]||shapes.Design);s.append(p);return s;}
const map={'Design Tool':'Design','Export PNG':'Picture','Export PDF':'PDF','Wedding Data Form':'Wedding','CorelDRAW Export':'SVG','SVG Export':'SVG'};
for(const b of document.querySelectorAll('.topbar>.menu-btn,.topbar>.tool-btn,.topbar .smart-two>button,.rk-vector-tools button')){
b.dataset.rekhtaCommand=b.textContent.trim();const label=b.textContent.trim().replace(/^[^A-Za-z]+/,'').trim().replace(/^T Text$/,'Text');const key=map[label]||label;const name=document.createElement('span');name.className='rk-icon-label';name.textContent=label;b.replaceChildren(icon(key),name);b.classList.add('rk-icon-button');if(!b.title)b.title=label;b.setAttribute('aria-label',label);
}
const style=document.createElement('style');style.id='rekhtaLargeIcons';style.textContent=`@media screen{
.topbar{flex-wrap:nowrap!important;overflow-x:auto;overflow-y:hidden;min-height:76px;gap:5px;padding:5px 8px;}
.topbar>.rk-icon-button,.topbar .smart-two>.rk-icon-button{flex:0 0 auto;min-width:58px;min-height:62px;padding:5px 7px;}
.smart-two{flex-shrink:0;display:flex;gap:5px;}.topbar .appmark{flex-shrink:0;}.topbar .zoom-box,.topbar .corel-page-controls{flex-shrink:0;}
.rk-icon-button{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;}
.rk-large-icon{display:block;width:30px;height:30px;flex-shrink:0;fill:none;stroke:#2365bd;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;pointer-events:none;}
.rk-icon-label{font:11px 'Segoe UI',Arial,sans-serif;white-space:nowrap;pointer-events:none;}
.rk-vector-tools .rk-icon-button{min-height:62px;padding:6px 2px;}.rk-vector-tools .rk-icon-label{font-size:10px;white-space:normal;}
.rk-vector-tools .rk-large-icon{width:30px;height:30px;}
}
`;document.head.append(style);
})();

/* After an input-language change, the first plain Space continues at line end. */
(function(){
const pending=new WeakSet();const original=switchLanguage;
switchLanguage=function(code){
const el=selected?.dataset.type==='text'?selected:null;
const before=el?.dataset.inputLanguage||language.value;
original(code);
if(el&&before!==code&&!el.classList.contains('locked'))pending.add(el);
};window.switchLanguage=switchLanguage;
window.addEventListener('keydown',function(e){
if(e.key!==' '||e.ctrlKey||e.altKey||e.metaKey||e.shiftKey||e.isComposing)return;
const el=document.activeElement;
if(!el?.classList.contains('textobj')||!pending.has(el)||el.classList.contains('locked')||!el.isContentEditable)return;
const sel=getSelection();if(!sel.rangeCount||!el.contains(sel.anchorNode)||!sel.isCollapsed)return;
// Browser line boundaries include soft wraps, connected Urdu runs and mixed text.
if(typeof sel.modify!=='function')return;
const saved=sel.getRangeAt(0).cloneRange();
sel.modify('move','forward','lineboundary');
if(!el.contains(sel.anchorNode)){sel.removeAllRanges();sel.addRange(saved);return;}
e.preventDefault();e.stopImmediatePropagation();pending.delete(el);
insertRekhtaText(el,' ');debouncedSnapshot();
},true);
})();

/* Tool cursors follow the active mode, including objects beneath the pointer. */
(function(){
const oldSetTool=setTool;
setTool=function(name,btn){
for(const c of [...page.classList])if(c.startsWith('tool-'))page.classList.remove(c);
oldSetTool(name,btn);
};
const style=document.createElement('style');style.id='rekhtaToolCursors';style.textContent=`@media screen{
#page.tool-select,#page.tool-select .obj,#page.tool-select .obj *{cursor:default!important;}
#page.tool-text,#page.tool-text .obj,#page.tool-text .obj *{cursor:text!important;}
#page.tool-freehand,#page.tool-vectorpen,#page.tool-rect,#page.tool-circle,#page.tool-line,#page.tool-star,#page.tool-polygon{cursor:crosshair!important;}
#page.tool-freehand .obj,#page.tool-freehand .obj *,#page.tool-vectorpen .obj,#page.tool-vectorpen .obj *{cursor:crosshair!important;}
#page .obj.locked,#page .obj.locked *{cursor:not-allowed!important;}
#page .handle.nw,#page .handle.se{cursor:nwse-resize!important;}#page .handle.ne,#page .handle.sw{cursor:nesw-resize!important;}
#page .handle.n,#page .handle.s{cursor:ns-resize!important;}#page .handle.e,#page .handle.w{cursor:ew-resize!important;}#page .handle.rot{cursor:grab!important;}
#page .rk-node{cursor:move!important;}
}`;document.head.append(style);
})();

/* Save offers editable projects and the existing output formats. */
(function(){
const saveJson=saveProject;
saveProject=function(){
const vector=!!selected?.querySelector('svg path[data-rings]');
openIpDialog('Save As',`<label>File format<select id="rkSaveFormat"><option value="json">REKHTA Project (*.json) — editable</option><option value="png">PNG Picture (*.png)</option><option value="jpg">JPEG Picture (*.jpg)</option><option value="gif">GIF Picture (*.gif)</option><option value="pdf">PDF — image (*.pdf)</option><option value="eps">EPS — image (*.eps)</option><option value="svg" ${vector?'':'disabled'}>SVG — selected vector (*.svg)</option></select></label><p>JSON opens again in REKHTA for editing. Picture formats open export settings for file name, resolution and page range. SVG saves only a selected traced vector or Pen shape.</p>`,null);
ipDialogApply.textContent='Continue';ipDialogApply.disabled=false;
ipDialogApply.onclick=function(){const format=document.getElementById('rkSaveFormat').value;closeIpDialog();if(format==='json')return saveJson();if(format==='svg'){const b=[...document.querySelectorAll('.rk-vector-tools button')].find(x=>x.textContent.trim()==='SVG Export');if(b)b.click();return;}openExportDialog(format,false);};
};window.saveProject=saveProject;
})();

/* Visible clipboard commands retain the page selection while using menus. */
(function(){
const menu=document.getElementById('mainMenu'),edit=menu.querySelector('[data-menu="edit"]').closest('.menu-wrap').querySelector('.menu-drop');
let range=null,target=null;
menu.addEventListener('mousedown',e=>{if(e.target.closest('button')){const s=getSelection();if(s.rangeCount&&selected?.classList.contains('textobj')&&selected.contains(s.anchorNode)){range=s.getRangeAt(0).cloneRange();target=selected;}e.preventDefault();}},true);
function textTarget(){const el=target?.isConnected?target:selected?.classList.contains('textobj')?selected:null;if(!el)return null;el.focus({preventScroll:true});if(range&&el.contains(range.startContainer)&&el.contains(range.endContainer)){const s=getSelection();s.removeAllRanges();s.addRange(range);}return el;}
function selectAll(){const el=textTarget();if(!el)return toast('Select a text object first');const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);range=r.cloneRange();target=el;}
async function copy(cut){const el=textTarget();if(!el)return toast('Select text first');if(cut&&el.classList.contains('locked'))return toast('Unlock the layer before editing');let s=getSelection();if(s.isCollapsed)selectAll();const r=s.getRangeAt(0).cloneRange(),text=s.toString();if(!text)return;let success=false;try{success=document.execCommand('copy');if(!success){await navigator.clipboard.writeText(text);success=true;}}catch(err){toast('Use Ctrl+C to copy the selected text');}if(success&&cut){r.deleteContents();s.removeAllRanges();s.addRange(r);range=r.cloneRange();debouncedSnapshot();}}
async function paste(){const el=textTarget();if(!el)return toast('Click a text object first');if(el.classList.contains('locked'))return toast('Unlock the layer before editing');try{const raw=await navigator.clipboard.readText();const converted=convertLegacyInPage(raw.replace(/\r\n?/g,'\n'));if(converted.unknown.length)return toast('Review text in InPage Encoding first');insertRekhtaText(el,converted.text);range=getSelection().getRangeAt(0).cloneRange();debouncedSnapshot();}catch(err){openIpDialog('Paste Text','<p>Press Ctrl+V here, then choose OK.</p><textarea id="rkPasteText" rows="5" style="width:100%" dir="auto"></textarea>',()=>{const raw=document.getElementById('rkPasteText').value;const converted=convertLegacyInPage(raw.replace(/\r\n?/g,'\n'));if(converted.unknown.length)return toast('Review text in InPage Encoding first');textTarget();insertRekhtaText(el,converted.text);debouncedSnapshot();});document.getElementById('rkPasteText').focus();}}
const entries=[['Cut','Ctrl+X',()=>copy(true)],['Copy','Ctrl+C',()=>copy(false)],['Paste','Ctrl+V',paste],['Select All','Ctrl+A',selectAll]];
const before=edit.querySelector('[data-action="duplicate"]');
for(const [name,key,fn] of entries){const b=document.createElement('button');b.type='button';b.dataset.clipboardAction=name.toLowerCase().replace(' ','');b.append(document.createTextNode(name+' '));const shortcut=document.createElement('span');shortcut.className='menu-shortcut';shortcut.textContent=key;b.append(shortcut);b.title=name+' ('+key+')';b.onclick=()=>{closeAllMenus();fn();};edit.insertBefore(b,before);}
const open=menu.querySelector('[data-action="open"]');if(open?.firstChild?.nodeType===3)open.firstChild.textContent='Open… ';
const save=menu.querySelector('[data-action="save"]');if(save?.firstChild?.nodeType===3)save.firstChild.textContent='Save As… ';
})();

/* Object, arrange and effects above the page; Color and Layers stay right. */
(function(){
const right=document.querySelector('.rightbar'),workspace=document.querySelector('.workspace');if(!right||!workspace)return;
const top=document.createElement('aside');top.className='rk-topdesign';top.setAttribute('aria-label','Object and design properties');
const object=document.createElement('section');object.className='rk-top-object';
const headings=[...right.children].filter(n=>n.classList.contains('panel-title'));
if(headings[0])headings[0].textContent='Color & Layers';
const note=headings[0]?.nextElementSibling;if(note&&!note.classList.contains('panel-title'))note.remove();
if(headings[1])object.append(headings[1]);
[...right.children].filter(n=>n.classList.contains('two')).forEach(n=>object.append(n));top.append(object);
[...right.querySelectorAll(':scope > .right-section')].forEach(n=>top.append(n));
right.querySelector(':scope > .hr')?.remove();workspace.before(top);
const style=document.createElement('style');style.id='rekhtaTopProperties';style.textContent=`@media screen{
#app{grid-template-rows:auto auto auto 134px minmax(0,1fr) 28px!important;}
.rk-topdesign{display:flex;align-items:stretch;gap:10px;padding:6px 8px;min-width:0;overflow-x:auto;overflow-y:hidden;background:#f6faff;border-bottom:1px solid #c8d9ed;}
.rk-topdesign>section,.rk-topdesign>.right-section{flex:0 0 auto;border-right:1px solid #d4e0ef;padding:0 10px 0 0;margin:0;}
.rk-top-object{width:330px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:5px;align-content:start;}
.rk-top-object>.panel-title{grid-column:1/-1;}.rk-top-object>.two{display:flex;flex-direction:column;gap:5px;margin:0;}
.rk-topdesign .field{display:flex;align-items:center;justify-content:space-between;gap:4px;margin:0;}
.rk-topdesign .field label{font:11px 'Segoe UI',Arial,sans-serif;color:#476581;}
.rk-topdesign input{width:65px;height:25px;padding:2px 4px;border:1px solid #c5d5e8;border-radius:4px;}
.rk-topdesign .panel-title{margin:0 0 5px;padding:5px 7px;}
.rk-topdesign .right-section{width:310px;}.rk-topdesign .actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4px;}
.rk-topdesign .actions button{font:11px 'Segoe UI',Arial,sans-serif;padding:4px 3px;min-height:23px;background:#fff;border:1px solid #c8d9ec;border-radius:4px;color:#345579;white-space:nowrap;}
.rk-topdesign .right-section:last-child{width:290px;}.rightbar{overflow-y:auto;}
}@media print{.rk-topdesign{display:none!important;}}
`;document.head.append(style);
requestAnimationFrame(()=>{if(!app.classList.contains('hidden'))fitPage();window.dispatchEvent(new Event('resize'));});
})();

/* Compact upper controls leave more room for the document. */
(function(){const style=document.createElement('style');style.id='rekhtaCompactTop';style.textContent=`@media screen{
.fullmenubar{min-height:28px;padding:2px 7px;gap:2px;}.menu-head{font-size:11px;padding:4px 7px;}
.topbar{min-height:56px;gap:3px;padding:3px 7px;}
.topbar>.rk-icon-button,.topbar .smart-two>.rk-icon-button{min-width:48px;min-height:46px;padding:3px 5px;gap:3px;}
.topbar .rk-large-icon{width:22px;height:22px;stroke-width:1.8;}.topbar .rk-icon-label{font-size:10px;}
.topbar .appmark{min-width:115px;margin-right:5px;gap:6px;}.appmark .mini{width:28px;height:28px;border-radius:6px;font-size:14px;}.rk-brand-name{font-size:17px;}.rk-brand-credit{font-size:9px;letter-spacing:.4px;margin-top:3px;}
.formatbar{flex-wrap:nowrap!important;overflow-x:auto;overflow-y:hidden;min-height:36px;padding:3px 7px;gap:4px;}.formatbar>*{flex-shrink:0;}.formatbar input,.formatbar select{font-size:11px;height:27px;}.formatbar button{font-size:11px;min-height:26px;padding:3px 6px;}
#app{grid-template-rows:auto auto auto 100px minmax(0,1fr) 26px!important;}
.rk-topdesign{gap:8px;padding:4px 7px;}.rk-topdesign .panel-title{font-size:10px;padding:4px 6px;margin-bottom:4px;letter-spacing:.3px;}
.rk-top-object{width:310px;gap:3px;}.rk-top-object>.two{gap:4px;}.rk-topdesign input{height:23px;width:60px;font-size:11px;}
.rk-topdesign .right-section{width:370px;}.rk-topdesign .actions{grid-template-columns:repeat(4,minmax(0,1fr));gap:3px;}.rk-topdesign .actions button{font-size:10px;min-height:21px;padding:3px 2px;}
.rk-topdesign .right-section:last-child{width:285px;}.rk-topdesign .right-section:last-child .actions{grid-template-columns:repeat(3,minmax(0,1fr));}
.statusbar{font-size:10px;}.rk-topdesign button:hover{background:#e9f3ff;border-color:#8bb3df;}
}`;document.head.append(style);requestAnimationFrame(()=>{if(!app.classList.contains('hidden'))fitPage();window.dispatchEvent(new Event('resize'));});})();

/* Muted teal and grey identity, applied only to the software interface. */
(function(){const s=document.createElement('style');s.id='rekhtaMutedTeal';s.textContent=`@media screen{
:root{--accent:#2b4242;--line:#aab7b5;--panel:#edf0ee;--text:#2b4242;--muted:#617671;}
#dashboard{background:radial-gradient(ellipse at top,#edf2f0,transparent 65%),linear-gradient(135deg,#c3c6c3,#93a4ab);}.dash-card{border-color:#a5b5b0;box-shadow:0 18px 55px #2b424225;}.brand-row h1{color:#2b4242;}.logo,.appmark .mini{background:linear-gradient(145deg,#2b4242,#6b8784);box-shadow:0 2px 7px #2b424225;}.dash-btn{border-color:#b6c4bf;background:linear-gradient(#fff,#edf2ef);}.dash-btn:hover{border-color:#6b8784;}
.fullmenubar{background:#2b4242;border-bottom:1px solid #49625e;}.menu-head{color:#f5f8f7;}.menu-head:hover,.menu-wrap.open>.menu-head{background:#49635f;color:#fff;}
.topbar{background:#e3e8e5;border-color:#aab9b4;}.topbar .appmark{color:#2b4242;}.rk-brand-credit{color:#526e68;}.rk-large-icon{stroke:#2b4242;}.topbar .rk-icon-label{color:#2b4242;}.smart-two button{background:#edf2ef;border-color:#b4c4bd;color:#2b4242;}
.formatbar,.rk-topdesign{background:#e8ece9;border-color:#a9b9b2;}.formatbar input,.formatbar select,.rightbar input,.rightbar select,.rk-topdesign input{background:#fafcfb;border-color:#aebfb7;color:#2b4242;}
.workspace{background:#93a4ab;}.stage-wrap{background:radial-gradient(ellipse at top,#c3c6c3,#7d8f8b);}
.rightbar{background:#e8ece9;border-color:#a5b5ae;}.panel-title{background:#d6dfda;color:#2b4242;border-color:#b0c0b7;}.rightbar label,.rk-topdesign .field label{color:#49645b;}
.rightbar .actions button,.rk-topdesign .actions button{background:#f8faf9;color:#2b4242;border-color:#b0c0b7;}.rk-topdesign button:hover{background:#d6e3dc;border-color:#6b8784;}
.rk-vector-tools{background:#dce4df;border-color:#9db2a7;}.rk-vector-tools button{background:#edf2ef;color:#2b4242;border-color:#b2c2b9;}.rk-vector-tools button:hover{background:#cfdfd6;border-color:#6b8784;}.rk-vector-tools button.active{background:#b8cdc3;border-color:#6b8784;color:#203b32;box-shadow:inset 3px 0 #2b4242;}
button:focus-visible,input:focus-visible,select:focus-visible{outline-color:#3a7161;}.menu-drop,.ip-menu-panel{background:#f8faf9;border-color:#a9bcb2;box-shadow:0 8px 25px #2b424225;}.menu-drop button:hover{background:#dbe7e0;}
.rk-trace-dialog{border-color:#a7bdb1;}.rk-trace-dialog h3{color:#2b4242;border-color:#bccdc3;}.rk-trace-dialog button{background:#e8efeb;color:#2b4242;border-color:#a9bfb2;}.rk-trace-dialog [data-apply]{background:#2b4242;color:#fff;}
.statusbar{background:#2b4242;color:#f2f6f4;border-color:#49625e;}.rightbar #layers button{color:#2b4242;}
}`;document.head.append(s);})();

/* Dark menu labels and balanced use of the available upper strip width. */
(function(){const s=document.createElement('style');s.id='rekhtaHeaderBalance';s.textContent=`@media screen{
.fullmenubar{background:#dce5df;border-bottom:1px solid #a6b8ad;}
.menu-head{color:#203b32;font-weight:600;}
.menu-head:hover,.menu-wrap.open>.menu-head{background:#b7cec0;color:#18352a;}
.topbar .rk-icon-label{color:#203b32;font-weight:600;}
.topbar>.spacer{flex:1 1 0;min-width:0;}
.topbar .corel-page-controls{margin-left:auto;}
.rk-topdesign>.rk-top-object{flex:1 0 310px;max-width:420px;}
.rk-topdesign>.right-section{flex:1.2 0 350px;width:auto;}
.rk-topdesign>.right-section:last-child{flex:1 0 285px;width:auto;border-right:0;}
.rk-topdesign .field{justify-content:flex-start;}.rk-topdesign .field label{min-width:40px;color:#203b32;font-weight:600;}
.rk-topdesign .panel-title{color:#203b32;font-weight:700;}
}`;document.head.append(s);})();

/* Only Image Trace remains in the left tool strip. */
(function(){const bar=document.querySelector('.rk-vector-tools');if(!bar)return;
bar.classList.add('rk-trace-only');bar.setAttribute('aria-label','Image Trace');
for(const b of bar.querySelectorAll('button')){
if(b.textContent.trim()==='Trace'){const label=b.querySelector('.rk-icon-label');if(label)label.textContent='Image Trace';b.title='Image Trace — select a picture first';b.setAttribute('aria-label','Image Trace');}
else{b.hidden=true;b.setAttribute('aria-hidden','true');b.tabIndex=-1;}
}
const s=document.createElement('style');s.id='rekhtaTraceOnly';s.textContent='.rk-trace-only button[hidden]{display:none!important}';document.head.append(s);
})();

/* Full Page Setup reuses document controls without clearing the design. */
(function(){
const px=96/25.4;
function flow(t,v,y=v.top*px){if(!t||t.dataset.type!=='text')return;t.style.left=v.left*px+'px';t.style.top=y+'px';t.style.width=(v.width-v.left-v.right)*px+'px';t.classList.add('flow-text');t.style.setProperty('--flow-columns',v.columns);t.style.setProperty('--flow-gutter',v.gutter*px+'px');t.style.setProperty('--flow-height',Math.max(10,(v.height-v.bottom)*px-y)+'px');}
ipPageSetup=function(){
// Display current actual page dimensions, including sizes chosen on the toolbar.
const width=parseFloat(page.style.width||794)/px,height=parseFloat(page.style.height||1123)/px;
documentSettings={...documentSettings,width,height,orientation:width>height?'landscape':'portrait'};
openNewDocumentSettings();ipDialogTitle.textContent='Page Setup — Size, Orientation, Margins & Columns';
ipDialogApply.onclick=()=>{try{
const v=validateDocumentSettings({size:ndSize.value,width:+ndWidth.value,height:+ndHeight.value,orientation:ndLandscape.checked?'landscape':'portrait',left:+nd_left.value,right:+nd_right.value,top:+nd_top.value,bottom:+nd_bottom.value,columns:+ndColumns.value,gutter:+ndGutter.value,direction:documentSettings.direction,automatic:ndAutomatic.checked});
documentSettings={...v};page.style.width=v.width*px+'px';page.style.height=v.height*px+'px';for(const k of ['left','right','top','bottom'])page.style.setProperty('--margin-'+k,v[k]*px+'px');page.classList.add('margin-guides');page.dataset.pageSetupConfigured='1';
const texts=[...page.querySelectorAll('.textobj.flow-text')];if(v.automatic){if(selected?.dataset.type==='text'&&!texts.includes(selected))texts.push(selected);if(!texts.length&&!page.querySelector('.obj'))texts.push(createText((v.width-v.right)*px,v.top*px,false));texts.forEach(t=>flow(t,v));}
else texts.forEach(t=>{t.classList.remove('flow-text');t.style.columnCount='1';});
closeIpDialog();fitPage();snapshot();toast('Page setup applied');
}catch(err){ndError.textContent=err.message;}};
};
const originalCreate=createText;createText=function(x,y,focus=false){const t=originalCreate(x,y,focus);if(page.dataset.pageSetupConfigured==='1'&&documentSettings.automatic)flow(t,documentSettings,Math.max(documentSettings.top*px,Math.min(y,(documentSettings.height-documentSettings.bottom)*px-20)));return t;};
const oldSerialize=serialize;serialize=function(){const data=oldSerialize();data.documentSettings={...documentSettings};data.pageSetupConfigured=page.dataset.pageSetupConfigured==='1';return data;};
const oldRestore=restore;restore=function(data){oldRestore(data);if(data.documentSettings)documentSettings={...rekhtaDocumentDefaults,...data.documentSettings};if(data.pageSetupConfigured)page.dataset.pageSetupConfigured='1';else delete page.dataset.pageSetupConfigured;};
const menu=document.querySelector('[data-menu="page"]')?.closest('.menu-wrap').querySelector('.menu-drop');if(menu){const b=document.createElement('button');b.type='button';b.textContent='Page Setup…';b.onclick=()=>{closeAllMenus();ipPageSetup();};menu.prepend(b);}
const b=document.createElement('button');b.type='button';b.className='small-btn';b.textContent='Page Setup';b.title='Size, Orientation, Margins and Columns';b.onclick=ipPageSetup;document.querySelector('.corel-page-controls')?.append(b);
})();

/* Geometry insertion always releases the chooser and restores a typing caret. */
(function(){const insert=insertGeometricSymbol;
insertGeometricSymbol=function(kind){
if(!rekhtaGeometricShapes[kind])return;
const mode=document.getElementById('geometricPlacement')?.value||'inline';
if(mode==='inline'&&rekhtaSymbolRange?.object?.classList.contains('locked')){closeIpDialog();toast('Unlock the text layer before inserting a symbol');return;}
closeIpDialog();
try{insert(kind);
if(mode==='inline'&&selected?.dataset.type==='text'){
const el=selected,s=getSelection();if(s.rangeCount&&el.contains(s.anchorNode)){
const r=s.getRangeAt(0);if(r.collapsed&&r.startContainer.nodeType===Node.ELEMENT_NODE){const tail=document.createTextNode('\u200b');r.insertNode(tail);r.setStart(tail,1);r.collapse(true);s.removeAllRanges();s.addRange(r);rekhtaSymbolRange={object:el,range:r.cloneRange()};}
}setTool('text');el.focus({preventScroll:true});
}else{setTool('select');page.focus({preventScroll:true});}
}catch(err){console.error('Geometry insertion failed',err);toast('Symbol could not be inserted. Choose it again.');}
finally{closeIpDialog();}
};})();
