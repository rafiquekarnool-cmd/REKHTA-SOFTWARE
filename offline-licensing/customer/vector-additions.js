(function(){
'use strict';
const NS='http://www.w3.org/2000/svg';let busy=false;
const bar=document.querySelector('.rk-vector-tools');if(!bar)return;
const css=document.createElement('style');css.textContent='#page.tool-smartfill,#page.tool-smartfill *{cursor:crosshair!important}.rk-vector-tools button.rk-added{display:block!important;color:#2b4242;background:#f5f8f6;border:1px solid #a9bfb2}.rk-vector-tools button.rk-added.active{background:#c8ddd4}.rk-vector-tools .rk-added svg{display:block;width:23px;height:23px;margin:2px auto 4px}.rk-vector-tools .rk-added span{font-size:10px;line-height:1.25;display:block}.rk-vector-tools button[disabled]{opacity:.5}';document.head.append(css);
function addButton(id,label,icon,fn){const b=document.createElement('button');b.type='button';b.id=id;b.className='rk-added';b.title=label;b.setAttribute('aria-label',label);b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="'+icon+'"/></svg><span></span>';b.querySelector('span').textContent=label;b.onclick=fn;bar.append(b);return b;}
const trace=[...bar.querySelectorAll('button')].find(b=>b.title?.startsWith('Image Trace')||b.textContent.trim()==='Image Trace'||b.textContent.trim()==='Trace');
if(trace){trace.id='rkPictureTrace';trace.title='Picture Trace — select a picture, then choose Black / White, Colour or Outline';trace.setAttribute('aria-label','Picture Trace');const label=trace.querySelector('.rk-icon-label');if(label)label.textContent='Picture Trace';else trace.textContent='Picture Trace';}
const fillButton=addButton('rkSmartFill','Smart Fill','M3 12l9-9 9 9-9 9z M3 12h18 M19 18l2 3h-4z',()=>{if(busy)return;setTool('smartfill');fillButton.classList.add('active');toast('Click inside a closed area. Escape cancels.');});
const curvesButton=addButton('rkTextCurves','Urdu Text to Curves','M4 4h16 M12 4v14 M7 18h10 M3 22c4-8 14-8 18 0',()=>convertText().catch(showError));
addButton('rkCurveSVG','Export Vector SVG','M6 3h9l4 4v14H6z M14 3v5h5 M8 13l3 3 5-6',exportSVG);
function showError(e){toast(e.message||String(e));console.error('Vector tool:',e);}
function createVector(svg,x,y,w,h,name){const el=baseObj('vector',x,y,Math.max(1,w),Math.max(1,h));el.dataset.vectorKind=name;el.style.minWidth='1px';el.style.minHeight='1px';svg.setAttribute('xmlns',NS);svg.setAttribute('width','100%');svg.setAttribute('height','100%');svg.setAttribute('preserveAspectRatio','none');svg.style.overflow='visible';el.append(svg);selectObj(el);return el;}
function exportSVG(){const svg=selected?.querySelector('svg');if(!svg)return toast('Select a traced vector, Smart Fill shape or text curves.');const copy=svg.cloneNode(true);copy.querySelectorAll('.handle,.rk-node').forEach(n=>n.remove());copy.querySelectorAll('[data-rings]').forEach(n=>n.removeAttribute('data-rings'));copy.setAttribute('xmlns',NS);copy.setAttribute('width',(selected.offsetWidth*25.4/96)+'mm');copy.setAttribute('height',(selected.offsetHeight*25.4/96)+'mm');const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml'})),a=document.createElement('a');a.href=url;a.download='REKHTA_Vector.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
// Four-neighbour flood fill: reject any component touching a page edge.
function closedRegion(data,w,h,sx,sy,tolerance=40){
 if(w*h>12000000)throw Error('Page is too large for Smart Fill.');sx=Math.floor(sx);sy=Math.floor(sy);if(sx<0||sy<0||sx>=w||sy>=h)throw Error('Click inside the page.');
 const seed=sy*w+sx,p=seed*4,base=[data[p],data[p+1],data[p+2],data[p+3]],mask=new Uint8Array(w*h),queue=new Int32Array(w*h);let head=0,tail=1;queue[0]=seed;mask[seed]=1;let left=sx,right=sx,top=sy,bottom=sy;
 function visit(i){if(mask[i])return;const k=i*4;if(Math.max(Math.abs(data[k]-base[0]),Math.abs(data[k+1]-base[1]),Math.abs(data[k+2]-base[2]),Math.abs(data[k+3]-base[3]))>tolerance)return;mask[i]=1;queue[tail++]=i;}
 while(head<tail){const i=queue[head++],x=i%w,y=Math.floor(i/w);if(x===0||y===0||x===w-1||y===h-1)throw Error('This area is open. Close its outline before using Smart Fill.');left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);visit(i-1);visit(i+1);visit(i-w);visit(i+w);}
 if(tail<4)throw Error('Click inside a larger closed area.');
 const rw=right-left+1,rh=bottom-top+1,pixels=new Uint8ClampedArray(rw*rh*4);
 for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++)if(mask[y*w+x])pixels[((y-top)*rw+x-left)*4+3]=255;
 return {pixels,width:rw,height:rh,x:left,y:top,count:tail};
}
async function smartFill(p){
 if(busy)return;busy=true;fillButton.disabled=true;
 try{
  toast('Finding closed area…');const w=page.offsetWidth,h=page.offsetHeight;
  const canvas=await captureRekhtaCanvas(page,{width:w,height:h,scale:1,backgroundColor:'#ffffff'}),ctx=canvas.getContext('2d');
  const region=closedRegion(ctx.getImageData(0,0,canvas.width,canvas.height).data,canvas.width,canvas.height,p.x*canvas.width/w,p.y*canvas.height/h);
  const groups=RekhtaTrace.tracePixels(region.pixels,region.width,region.height,{minArea:0}),svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 '+region.width+' '+region.height);
  for(const g of groups){const path=document.createElementNS(NS,'path');path.setAttribute('d',RekhtaTrace.pathData(g.rings));path.dataset.rings=JSON.stringify(g.rings);path.setAttribute('fill',fillColor.value||'#2b4242');path.setAttribute('fill-rule','evenodd');svg.append(path);}
  if(!svg.childNodes.length)throw Error('No closed region found.');
  createVector(svg,region.x*w/canvas.width,region.y*h/canvas.height,region.width*w/canvas.width,region.height*h/canvas.height,'smart-fill');snapshot();toast('Smart Fill vector created.');
 }finally{busy=false;fillButton.disabled=false;fillButton.classList.remove('active');setTool('select');}
}
page.addEventListener('mousedown',e=>{if(tool!=='smartfill')return;e.preventDefault();e.stopImmediatePropagation();if(e.button===0)smartFill(pagePoint(e)).catch(showError);},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')fillButton.classList.remove('active');});
function textRuns(el){
 const runs=[],origin=el.getBoundingClientRect(),canvas=document.createElement('canvas'),ctx=canvas.getContext('2d'),walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;
 while((node=walker.nextNode())){
  if(node.parentElement.closest('.handle,.geometric-inline,[contenteditable="false"]'))continue;
  const style=getComputedStyle(node.parentElement),size=parseFloat(style.fontSize),family=style.fontFamily.includes('Jameel Noori Nastaleeq')?'Jameel Noori Nastaleeq':style.fontFamily.includes('Times New Roman')?'Times New Roman':null;
  if(!family&&node.textContent.trim())throw Error('Use Jameel Noori Nastaleeq or Times New Roman before converting.');
  if(parseFloat(style.letterSpacing)||parseFloat(style.wordSpacing))throw Error('Set letter and word spacing to normal before converting.');
  ctx.font=style.fontStyle+' '+style.fontWeight+' '+size+'px "'+family+'"';const metrics=ctx.measureText(node.textContent),ascent=metrics.fontBoundingBoxAscent;
  if(!Number.isFinite(ascent))throw Error('Font metrics are unavailable.');
  let run=null,previousDirection=style.direction;
  for(let i=0;i<node.length;){const ch=String.fromCodePoint(node.textContent.codePointAt(i)),n=ch.length,range=document.createRange();range.setStart(node,i);range.setEnd(node,i+n);i+=n;if(ch==='\n'||ch==='\r'){run=null;continue;}
   const r=range.getBoundingClientRect();if(!r.height){run=null;continue;}const direction=/[\u0600-\u08ff\ufb50-\ufeff]/.test(ch)?'rtl':/[A-Za-z0-9]/.test(ch)?'ltr':previousDirection;previousDirection=direction;
   const baseline=(r.top-origin.top)/zoom+ascent,left=(r.left-origin.left)/zoom,right=(r.right-origin.left)/zoom;
   if(!run||Math.abs(run.baseline-baseline)>1||run.direction!==direction){run={text:'',family,size,bold:Number(style.fontWeight)>=600,italic:style.fontStyle!=='normal',color:style.color,direction,baseline,left,right};runs.push(run);}
   run.text+=ch;run.left=Math.min(run.left,left);run.right=Math.max(run.right,right);
  }
 }
 const merged=[];for(const r of runs){const prev=merged[merged.length-1];if(prev&&['family','size','bold','italic','color','direction'].every(k=>prev[k]===r[k])&&Math.abs(prev.baseline-r.baseline)<1&&Math.min(Math.abs(prev.left-r.right),Math.abs(prev.right-r.left))<2){prev.text+=r.text;prev.left=Math.min(prev.left,r.left);prev.right=Math.max(prev.right,r.right);}else merged.push(r);}return merged.filter(r=>r.text.trim());
}
async function convertText(){
 const source=selected;if(!source||source.dataset.type!=='text')return toast('Select an Urdu text object first.');if(source.classList.contains('locked'))return toast('Unlock the text before converting.');if(!source.textContent.trim())return toast('Type some text first.');if(!window.rekhtaDesktop?.textCurves)return toast('Text to Curves is available in the REKHTA desktop EXE.');if(busy)return;
 if(source.querySelector('.geometric-inline,img,svg'))throw Error('Convert text separately from inline symbols and pictures.');
 busy=true;curvesButton.disabled=true;const transform=source.style.transform;
 try{
  await document.fonts.ready;source.style.transform='none';let runs;try{runs=textRuns(source);}finally{source.style.transform=transform;}
  const shaped=await window.rekhtaDesktop.textCurves(runs);if(!source.isConnected)throw Error('The text object was removed.');
  const w=source.offsetWidth,h=source.offsetHeight,svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 '+w+' '+h);let count=0;
  shaped.forEach((out,i)=>{const run=runs[i],scale=run.size/out.upem,x=run.direction==='rtl'?run.right-out.advance*scale:run.left;
   for(const glyph of out.glyphs){const path=document.createElementNS(NS,'path');path.setAttribute('d',glyph.d);path.setAttribute('fill',run.color);path.setAttribute('transform',`translate(${x+glyph.x*scale} ${run.baseline-glyph.y*scale}) scale(${scale} ${-scale})`);svg.append(path);count++;}
  });
  if(!count)throw Error('The text has no visible glyph outlines.');
  const el=createVector(svg,parseFloat(source.style.left)||0,parseFloat(source.style.top)||0,w,h,'text-curves');el.style.transform=transform;el.style.transformOrigin=source.style.transformOrigin;el.style.opacity=source.style.opacity;el.dataset.rotation=source.dataset.rotation||'0';el.dataset.originalText=source.textContent;el.dataset.sourceTextId=source.dataset.id;
  source.dataset.layerName=source.textContent.trim().slice(0,26);source.dataset.layerHidden='1';refreshLayers();snapshot();toast('Text curves created. Editable original is kept in a hidden layer.');
 }finally{source.style.transform=transform;busy=false;curvesButton.disabled=false;}
}
const oldPalette=applyPaletteColor;
applyPaletteColor=function(color,mode=colorApplyMode){if(selected?.dataset.vectorKind!=='text-curves')return oldPalette(color,mode);if(selected.classList.contains('locked'))return toast('Unlock the layer first.');if(color!=='none'&&!/^#[0-9a-f]{6}$/i.test(color))return;selected.querySelectorAll('svg path').forEach(p=>{p.setAttribute(mode==='fill'?'fill':'stroke',color);if(mode!=='fill')p.setAttribute('stroke-width','20');});snapshot();};
fillColor.addEventListener('change',()=>{if(selected?.dataset.vectorKind==='text-curves')applyPaletteColor(fillColor.value,'fill');});
shapeColor.addEventListener('change',()=>{if(selected?.dataset.vectorKind==='text-curves')applyPaletteColor(shapeColor.value,'outline');});
window.rekhtaVectorAdditions={closedRegion,smartFill,convertText,textRuns,exportSVG};
})();
