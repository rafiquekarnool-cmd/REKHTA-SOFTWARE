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
const label=b.textContent.trim().replace(/^[^A-Za-z]+/,'').trim();const key=map[label]||label;const name=document.createElement('span');name.className='rk-icon-label';name.textContent=label;b.replaceChildren(icon(key),name);b.classList.add('rk-icon-button');if(!b.title)b.title=label;b.setAttribute('aria-label',label);
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
