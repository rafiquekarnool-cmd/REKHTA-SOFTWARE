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
 .rk-vector-tools button{background:#f8fbff;border:1px solid #c7d9ec;border-radius:5px;color:#315b88;}
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
const logo=document.querySelector('#dashboard .logo');if(logo)logo.textContent='RK';
})();
