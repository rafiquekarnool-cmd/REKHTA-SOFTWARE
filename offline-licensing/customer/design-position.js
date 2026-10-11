(function(){
 const drawer=document.getElementById('designDrawer'),workspace=document.querySelector('.workspace');
 if(!drawer||!workspace)return;
 const style=document.createElement('style');style.textContent=`
 @media screen{
 #designDrawer{position:fixed;left:8px;top:var(--rk-design-top,160px);width:180px;max-height:var(--rk-design-height,60vh);box-sizing:border-box;padding:8px;overflow:auto;background:#f2f5f3;color:#2b4242;border:1px solid #93a4ab;box-shadow:0 4px 12px #20393622}
 #designDrawer h4{font-size:11px;color:#2b4242;margin-bottom:6px}
 #designDrawer button{font-size:11px;padding:5px 6px;min-height:24px}
 #designDrawer button svg,#designDrawer button img{width:14px;height:14px}
 #designDrawer .design-row{gap:4px}#designDrawer .design-group{margin-top:8px;padding-top:8px}
 #designDrawer .field span{font-size:11px!important}
 #designDrawer .preset{width:20px;height:20px;min-height:20px;padding:0}
 }
 @media print{#designDrawer{display:none!important}}
 `;document.head.append(style);
 function position(){const r=workspace.getBoundingClientRect();drawer.style.setProperty('--rk-design-top',(r.top+8)+'px');drawer.style.setProperty('--rk-design-height',Math.max(80,r.height-16)+'px');}
 new ResizeObserver(position).observe(workspace);window.addEventListener('resize',position);position();
})();
