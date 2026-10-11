(function(){
 const drawer=document.getElementById('designDrawer'),workspace=document.querySelector('.workspace');
 if(!drawer||!workspace)return;
 const style=document.createElement('style');style.textContent=`
 @media screen{
 .rk-vector-tools button.rk-icon-button,.rk-vector-tools button.rk-added{min-height:36px;padding:4px 2px;margin:2px 0;gap:2px}
 .rk-vector-tools button svg,.rk-vector-tools .rk-large-icon,.rk-vector-tools .rk-added svg{width:16px;height:16px;margin:0 auto 2px}
 .rk-vector-tools .rk-icon-label,.rk-vector-tools .rk-added span{font-size:9px;line-height:1.2;white-space:normal}
 #designDrawer{width:220px;box-sizing:border-box;padding:8px;background:#f2f5f3;color:#2b4242;border:1px solid #93a4ab;box-shadow:0 4px 12px #20393622}
 #designDrawer h4{font-size:11px;color:#2b4242;margin-bottom:6px}
 #designDrawer button{font-size:11px;padding:5px 6px;min-height:24px}
 #designDrawer button svg,#designDrawer button img{width:14px;height:14px}
 #designDrawer .design-row{gap:4px}#designDrawer .design-group{margin-top:8px;padding-top:8px}
 #designDrawer .field span{font-size:11px!important}
 #designDrawer .preset{width:20px;height:20px;min-height:20px;padding:0}
 }
 @media print{#designDrawer{display:none!important}}
 `;document.head.append(style);
})();
