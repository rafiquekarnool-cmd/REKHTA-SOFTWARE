/* REKHTA offline background remover: colour matching, connected edges, original-size PNG. */
(function(root){
'use strict';
async function removePixels(source,w,h,color,tolerance,all=false){
 if(!Number.isInteger(w)||!Number.isInteger(h)||w<1||h<1||w*h>12000000||source.length!==w*h*4)throw Error('Use a picture up to 12 megapixels.');
 const data=new Uint8ClampedArray(source),seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=0,count=0;
 const matches=i=>{const k=i*4;return source[k+3]===0||Math.max(Math.abs(source[k]-color[0]),Math.abs(source[k+1]-color[1]),Math.abs(source[k+2]-color[2]))<=tolerance;};
 const visit=i=>{if(seen[i])return;seen[i]=1;if(matches(i))queue[tail++]=i;};
 if(all){for(let i=0;i<w*h;i++){if(matches(i)){data[i*4+3]=0;count++;}if(i%100000===99999)await new Promise(r=>setTimeout(r,0));}}
 else{
  for(let x=0;x<w;x++){visit(x);visit((h-1)*w+x);}for(let y=0;y<h;y++){visit(y*w);visit(y*w+w-1);}
  while(head<tail){const i=queue[head++],x=i%w,y=Math.floor(i/w);data[i*4+3]=0;count++;if(x>0)visit(i-1);if(x<w-1)visit(i+1);if(y>0)visit(i-w);if(y<h-1)visit(i+w);if(head%100000===0)await new Promise(r=>setTimeout(r,0));}
 }
 return {data,count};
}
root.rekhtaBackgroundRemover={removePixels};
if(typeof module==='object')module.exports={removePixels};
if(typeof document==='undefined')return;
const bar=document.querySelector('.rk-vector-tools');if(!bar)return;
const css=document.createElement('style');css.textContent=`
#rkBackgroundDialog{position:fixed;inset:0;background:#172c2cb3;z-index:1500;display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box}
#rkBackgroundDialog .rk-bg-panel{background:#f5f8f6;color:#2b4242;border-radius:10px;padding:20px;width:720px;max-width:100%;max-height:90vh;overflow:auto;box-shadow:0 12px 40px #0004;font:14px Arial,sans-serif}
#rkBackgroundDialog h2{margin:0 0 12px;font-size:20px}#rkBackgroundDialog .rk-bg-controls{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:12px 0}
#rkBackgroundDialog label{display:flex;gap:6px;align-items:center}#rkBackgroundDialog button{padding:8px 14px;border:1px solid #93a4ab;border-radius:5px;background:#fff;color:#2b4242;cursor:pointer}#rkBackgroundDialog button:disabled{opacity:.5;cursor:wait}#rkBackgroundDialog #rkBgApply{background:#2b4242;color:white}
#rkBackgroundDialog .rk-bg-preview{background:repeating-conic-gradient(#ccd5d2 0% 25%,#fff 0% 50%) 0/20px 20px;text-align:center;padding:8px;min-height:140px}#rkBackgroundDialog canvas{max-width:100%;max-height:44vh;vertical-align:middle;cursor:crosshair}#rkBackgroundDialog .rk-bg-footer{display:flex;gap:8px;justify-content:flex-end;margin-top:14px}#rkBackgroundDialog p{line-height:1.5;margin:8px 0}
#rkWelcome h1,#rkWelcome .rkUrdu,#rkWelcome p,#rkWelcome button{flex-shrink:0}#rkWelcome .rkUrdu:not(.rkUrduName){overflow:visible;line-height:2.3;min-height:2.3em;padding:4px 10px;box-sizing:content-box}
`;document.head.append(css);
const button=document.createElement('button');button.type='button';button.id='rkBackgroundRemover';button.className='rk-added';button.title='Background Remover — select a picture';button.setAttribute('aria-label','Background Remover');button.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M3 3h18v18H3z M3 15l6-6 5 5 4-4 3 3 M5 5l14 14 M19 5L5 19"/></svg><span>Background Remover</span>';button.onclick=()=>open().catch(e=>toast(e.message));bar.append(button);
let active=null;
async function open(){
 if(active)return;
 const object=selected,image=object?.dataset.type==='image'?object.querySelector('img'):null;
 if(!image)return toast('Select a picture, then click Background Remover.');
 if(object.classList.contains('locked'))return toast('Unlock the picture first.');
 const loaded=new Image();loaded.src=image.src;await loaded.decode();const w=loaded.naturalWidth,h=loaded.naturalHeight;
 if(w*h>12000000)throw Error('Use a picture up to 12 megapixels. Resize a larger photo before removing its background.');
 const original=document.createElement('canvas');original.width=w;original.height=h;const ctx=original.getContext('2d',{willReadFrequently:true});ctx.drawImage(loaded,0,0);let pixels;
 try{pixels=ctx.getImageData(0,0,w,h);}catch(e){throw Error('Import the picture as a local file before removing its background.');}
 const originalSrc=image.src,dialog=document.createElement('div');dialog.id='rkBackgroundDialog';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','rkBgTitle');
 dialog.innerHTML='<div class="rk-bg-panel"><h2 id="rkBgTitle">Background Remover</h2><p>Offline colour removal. Best for plain backgrounds. Click the original picture to choose the background colour.</p><div class="rk-bg-controls"><label>Colour <input id="rkBgColor" type="color"></label><label>Sensitivity <input id="rkBgTolerance" type="range" min="0" max="150" value="35"><output id="rkBgValue">35</output></label><label><input id="rkBgAll" type="checkbox"> Remove matching colour everywhere</label></div><div class="rk-bg-controls"><button id="rkBgOriginal" type="button">Show original / Pick colour</button><button id="rkBgPreview" type="button">Preview removal</button></div><div class="rk-bg-preview"><canvas id="rkBgCanvas"></canvas></div><p id="rkBgStatus" role="status">Original picture. Transparent areas appear as a checkerboard.</p><div class="rk-bg-footer"><button id="rkBgCancel" type="button">Cancel</button><button id="rkBgApply" type="button" disabled>Apply</button></div></div>';
 document.body.append(dialog);active=dialog;
 const q=id=>dialog.querySelector('#'+id),canvas=q('rkBgCanvas'),view=canvas.getContext('2d');canvas.width=w;canvas.height=h;
 const hex=rgb=>'#'+rgb.map(v=>v.toString(16).padStart(2,'0')).join('');q('rkBgColor').value=pixels.data[3]?hex(Array.from(pixels.data.slice(0,3))):'#ffffff';
 let result=null,busy=false,version=0,showingOriginal=true;
 function drawOriginal(){view.putImageData(pixels,0,0);showingOriginal=true;}
 function invalidate(){version++;result=null;q('rkBgApply').disabled=true;q('rkBgStatus').textContent='Settings changed. Click Preview removal.';}
 function close(){version++;active=null;dialog.remove();document.removeEventListener('keydown',onKey,true);if(object.isConnected)selectObj(object);button.focus();}
 function onKey(e){if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();return;}if(e.key==='Tab'){const elements=[...dialog.querySelectorAll('button:not(:disabled),input')],first=elements[0],last=elements[elements.length-1];if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault();}}}
 q('rkBgCancel').onclick=close;document.addEventListener('keydown',onKey,true);
 q('rkBgColor').oninput=invalidate;q('rkBgAll').onchange=invalidate;q('rkBgTolerance').oninput=()=>{q('rkBgValue').value=q('rkBgTolerance').value;invalidate();};
 q('rkBgOriginal').onclick=()=>{drawOriginal();q('rkBgStatus').textContent='Click the background to pick its colour.';};
 canvas.onclick=e=>{if(!showingOriginal){drawOriginal();q('rkBgStatus').textContent='Original shown. Click its background to pick a colour.';return;}const rect=canvas.getBoundingClientRect(),x=Math.max(0,Math.min(w-1,Math.floor((e.clientX-rect.left)*w/rect.width))),y=Math.max(0,Math.min(h-1,Math.floor((e.clientY-rect.top)*h/rect.height))),i=(y*w+x)*4;if(!pixels.data[i+3]){q('rkBgStatus').textContent='That area is already transparent. Pick an opaque background colour.';return;}q('rkBgColor').value=hex(Array.from(pixels.data.slice(i,i+3)));invalidate();};
 q('rkBgPreview').onclick=async()=>{
  if(busy)return;busy=true;const stamp=++version;q('rkBgPreview').disabled=true;q('rkBgApply').disabled=true;q('rkBgStatus').textContent='Removing background…';
  try{const color=q('rkBgColor').value.match(/[a-f0-9]{2}/gi).map(v=>parseInt(v,16)),out=await removePixels(pixels.data,w,h,color,Number(q('rkBgTolerance').value),q('rkBgAll').checked);if(active!==dialog||stamp!==version)return;result=out;view.putImageData(new ImageData(out.data,w,h),0,0);showingOriginal=false;q('rkBgApply').disabled=!out.count;q('rkBgStatus').textContent=out.count?'Preview ready. Apply keeps the picture size and position.':'No matching background found. Pick another colour or raise sensitivity.';}catch(e){q('rkBgStatus').textContent=e.message;}finally{busy=false;q('rkBgPreview').disabled=false;}
 };
 q('rkBgApply').onclick=()=>{if(!result||busy)return;if(!object.isConnected||image.src!==originalSrc||object.classList.contains('locked')){q('rkBgStatus').textContent='Picture changed. Cancel and reopen this tool.';return;}const output=document.createElement('canvas');output.width=w;output.height=h;output.getContext('2d').putImageData(new ImageData(result.data,w,h),0,0);const src=output.toDataURL('image/png');snapshot();image.src=src;object.dataset.backgroundRemoved='1';snapshot();close();toast('Background removed. Undo restores the original picture.');};
 drawOriginal();q('rkBgColor').focus();
}
root.rekhtaBackgroundRemover.open=open;
})(typeof window!=='undefined'?window:globalThis);
