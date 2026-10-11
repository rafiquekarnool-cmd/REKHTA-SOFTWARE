(function(){
 const workspace=document.querySelector('.workspace'),drawer=document.getElementById('designDrawer');
 if(!workspace||!drawer)return;
 const layers=document.getElementById('layers');
 if(layers){const title=layers.previousElementSibling;if(title?.classList.contains('panel-title'))title.hidden=true;layers.hidden=true;}
 document.querySelectorAll('[data-ip-action="showlayers"]').forEach(b=>b.hidden=true);
 const dock=document.createElement('aside');dock.id='rkDesignDock';dock.setAttribute('aria-label','Design options');workspace.prepend(dock);dock.append(drawer);
 const style=document.createElement('style');style.textContent=`
 #layers,[data-ip-action="showlayers"]{display:none!important}
 @media screen{
 .workspace.rk-design-left{grid-template-columns:240px minmax(0,1fr) 260px!important}
 .workspace.rk-design-left.with-palette{grid-template-columns:240px minmax(0,1fr) 294px!important}
 #rkDesignDock{grid-column:1;grid-row:1;min-height:0;overflow:auto;background:#f2f5f3;border-right:1px solid #93a4ab}
 #rkDesignDock[hidden]{display:none!important}
 #rkDesignDock #designDrawer{position:static;width:auto;max-height:none;border:0;border-radius:0;box-shadow:none;background:#f2f5f3;color:#2b4242;padding:10px}
 .workspace.rk-design-left>.stage-wrap{grid-column:2;grid-row:1}
 .workspace.rk-design-left>.rightbar{grid-column:3;grid-row:1}
 #rkDesignDock h4{color:#2b4242}#rkDesignDock button{color:#2b4242}
 }
 @media print{#rkDesignDock{display:none!important}}
 `;document.head.append(style);
 function sync(){dock.hidden=drawer.hidden;workspace.classList.toggle('rk-design-left',!drawer.hidden);}
 new MutationObserver(sync).observe(drawer,{attributes:true,attributeFilter:['hidden']});
 const toggle=window.toggleDesignDrawer;
 window.toggleDesignDrawer=function(force){if(force===false)return;toggle(force);};
 toggleDesignDrawer(true);sync();
})();
