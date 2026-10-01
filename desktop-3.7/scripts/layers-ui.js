/* REKHTA object layer controls. State is saved in project HTML. */
(function(){
'use strict';
const style=document.createElement('style');style.textContent='#layers .rk-layer{display:flex;align-items:center;gap:3px;padding:5px 3px;border:1px solid #d6e1ef;margin:3px 0;background:#fff;border-radius:4px}#layers .rk-layer.active{background:#e0eeff;border-color:#7da7db}#layers .rk-layer button{padding:3px;min-width:23px;border:1px solid #d6e1ef;border-radius:3px;background:#f4f8ff;font-size:12px;cursor:pointer}#layers .rk-layer .rk-layer-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left;border:0;background:transparent}#layers .rk-layer button:disabled{opacity:.35;cursor:default}.obj[data-layer-hidden="1"]{display:none!important}.obj.locked .rk-node{display:none}';document.head.appendChild(style);
const ordered=()=>[...page.children].filter(el=>el.classList.contains('obj')).map((el,index)=>({el,index,z:Number(el.style.zIndex)||0})).sort((a,b)=>a.z-b.z||a.index-b.index).map(x=>x.el);
function syncLockedText(el){if(!el.classList.contains('textobj')&&el.dataset.type!=='text')return;if(el.classList.contains('locked')){if(!el.hasAttribute('data-layer-editable'))el.dataset.layerEditable=el.getAttribute('contenteditable')||'true';el.setAttribute('contenteditable','false');el.blur();}else if(el.hasAttribute('data-layer-editable')){el.setAttribute('contenteditable',el.dataset.layerEditable);delete el.dataset.layerEditable;}}
function lockLayer(el){el.classList.toggle('locked');syncLockedText(el);if(selected===el)addHandles(el);refreshLayers();snapshot();}
function hideLayer(el){el.dataset.layerHidden=el.dataset.layerHidden==='1'?'0':'1';if(el.dataset.layerHidden==='1'&&selected===el)selectObj(null);refreshLayers();snapshot();}
function moveLayer(el,delta){if(el.classList.contains('locked'))return toast('Unlock this layer before moving it');const list=ordered(),i=list.indexOf(el),j=i+delta;if(i<0||j<0||j>=list.length)return;[list[i],list[j]]=[list[j],list[i]];list.forEach((n,k)=>n.style.zIndex=String(k+1));refreshLayers();snapshot();}
const originalRefresh=refreshLayers;
refreshLayers=function(){layers.replaceChildren();const list=ordered().reverse();list.forEach((el,i)=>{syncLockedText(el);const row=document.createElement('div');row.className='rk-layer'+(el===selected?' active':'');function control(label,title,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.title=title;b.setAttribute('aria-label',title);b.onclick=e=>{e.stopPropagation();fn();};row.appendChild(b);return b;}
const hidden=el.dataset.layerHidden==='1',locked=el.classList.contains('locked');const eye=control(hidden?'○':'👁',hidden?'Show layer':'Hide layer',()=>hideLayer(el));eye.setAttribute('aria-pressed',String(!hidden));
const name=el.dataset.layerName||(el.dataset.type==='text'?(el.innerText.trim().slice(0,26)||'Text'):(el.dataset.type||'Object'));
const nameButton=control(name,'Select '+name,()=>selectObj(el));nameButton.className='rk-layer-name';nameButton.title=name+(hidden?' (hidden)':'');
const lock=control(locked?'🔒':'🔓',locked?'Unlock layer':'Lock layer',()=>lockLayer(el));lock.setAttribute('aria-pressed',String(locked));
const up=control('↑','Move one layer forward',()=>moveLayer(el,1));up.disabled=i===0||locked;
const down=control('↓','Move one layer backward',()=>moveLayer(el,-1));down.disabled=i===list.length-1||locked;
layers.appendChild(row);});};
refreshLayerName=function(){refreshLayers();};
toggleLock=function(){if(selected)lockLayer(selected);};
// Locked text must also stay protected from synthetic typing handlers.
page.addEventListener('keydown',e=>{const el=e.target.closest('.obj');if(el?.classList.contains('locked')&&el.dataset.type==='text'&&!(e.ctrlKey||e.metaKey)&&!['Tab','Escape'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();}},true);
refreshLayers();
window.rekhtaLayerControls={ordered,lockLayer,hideLayer,moveLayer};
})();
