(function(){
 let busy=false;
 const input=document.createElement('input');input.type='file';input.accept='.pdf,application/pdf';input.hidden=true;input.id='rkPDFInput';document.body.append(input);
 const menu=document.querySelector('[data-menu="file"]')?.closest('.menu-wrap')?.querySelector('.menu-drop');
 const button=document.createElement('button');button.type='button';button.id='rkImportPDF';button.textContent='Import PDF…';button.onclick=()=>{closeAllMenus();input.click();};menu?.append(button);
 function bytes(s){return Uint8Array.from(atob(s),c=>c.charCodeAt(0));}
 class CMaps{async fetch({name}){const s=rkPDFResources.cmaps[name+'.bcmap'];if(!s)throw Error('Missing PDF character map');return {cMapData:bytes(s),compressionType:1};}}
 class Fonts{async fetch({filename}){const s=rkPDFResources.standard_fonts[filename];if(!s)throw Error('Missing PDF standard font');return bytes(s);}}
 async function load(data){return pdfjsLib.getDocument({data:new Uint8Array(data),CMapReaderFactory:CMaps,StandardFontDataFactory:Fonts,isEvalSupported:false}).promise;}
 async function insert(pdf,from,to,dpi){
  if(busy)throw Error('PDF import is already running.');
  if(!Number.isInteger(from)||!Number.isInteger(to)||from<1||to<from||to>pdf.numPages||to-from>=20)throw Error('Choose up to 20 valid pages per import.');
  busy=true;button.disabled=true;const created=[];
  try{
   const h=rekhtaPagination.height,w=page.offsetWidth;
   const existing=[...page.querySelectorAll('.obj')].some(el=>el.dataset.type!=='text'||el.textContent.trim());const first=existing?rekhtaPagination.count:0;
   for(let n=from;n<=to;n++){
    toast('Importing PDF page '+n+' / '+to);
    const p=await pdf.getPage(n),base=p.getViewport({scale:1});let scale=dpi/72;
    scale=Math.min(scale,Math.sqrt(12000000/(base.width*base.height)),8192/base.width,8192/base.height);
    const viewport=p.getViewport({scale}),canvas=document.createElement('canvas');canvas.width=Math.ceil(viewport.width);canvas.height=Math.ceil(viewport.height);
    await p.render({canvasContext:canvas.getContext('2d'),viewport}).promise;
    const ratio=Math.min(w/base.width,h/base.height),iw=base.width*ratio,ih=base.height*ratio;
    const el=baseObj('image',(w-iw)/2,(first+n-from)*(h+32)+(h-ih)/2,iw,ih);created.push(el);el.classList.add('imageobj');el.dataset.pdfPage=String(n);
    const image=document.createElement('img');image.alt='PDF page '+n;image.src=canvas.toDataURL('image/png');el.append(image);await image.decode();canvas.width=canvas.height=1;p.cleanup();
    await new Promise(r=>setTimeout(r,0));
   }
   rekhtaPagination.refresh();selectObj(created[0]);snapshot();created[0].scrollIntoView({block:'start',inline:'nearest'});toast('PDF imported: '+created.length+' page(s).');return created;
  }catch(e){created.forEach(el=>el.remove());rekhtaPagination.refresh();throw e;}
  finally{busy=false;button.disabled=false;}
 }
 async function choose(file){
  if(busy)return toast('Wait for PDF import to finish.');
  if(file.size>100*1024*1024)return toast('PDF is too large. Choose a file under 100 MB.');
  let pdf;
  try{
   pdf=await load(await file.arrayBuffer());
   openIpDialog('Import PDF','<p>'+pdf.numPages+' page(s). Import as pictures, preserving the PDF appearance. Text will not be directly editable.</p><label>From page<input id="rkPDFfrom" type="number" min="1" max="'+pdf.numPages+'" value="1"></label><label>To page<input id="rkPDFto" type="number" min="1" max="'+pdf.numPages+'" value="'+Math.min(20,pdf.numPages)+'"></label><label>Resolution<select id="rkPDFdpi"><option value="150">150 DPI</option><option value="300">300 DPI</option></select></label><p>Up to 20 pages per import.</p>');
   const cancel=ipDialogBackdrop.querySelector('button[onclick="closeIpDialog()"]');const original=cancel.onclick;
   cancel.onclick=()=>{pdf.destroy();original?.();};
   ipDialogApply.onclick=async()=>{const from=+document.getElementById('rkPDFfrom').value,to=+document.getElementById('rkPDFto').value,dpi=+document.getElementById('rkPDFdpi').value;if(from<1||to<from||to>pdf.numPages||to-from>=20)return toast('Choose a valid range of up to 20 pages.');closeIpDialog();try{await insert(pdf,from,to,dpi);}catch(e){toast('PDF import failed: '+e.message);}finally{await pdf.destroy();}};
  }catch(e){await pdf?.destroy();toast('Cannot open PDF: '+(e.name==='PasswordException'?'Remove the PDF password before importing.':e.message));}
 }
 input.onchange=()=>{const f=input.files[0];input.value='';if(f)choose(f);};
 const pictures=document.getElementById('fileInput');pictures.accept='image/*,.pdf,application/pdf';pictures.addEventListener('change',e=>{const f=pictures.files[0];if(f&&(f.type==='application/pdf'||/\.pdf$/i.test(f.name))){e.stopImmediatePropagation();pictures.value='';choose(f);}},true);
 window.rekhtaImportPDF=async(data,options={})=>{const pdf=await load(data);try{return await insert(pdf,options.from||1,options.to||Math.min(20,pdf.numPages),options.dpi||150);}finally{await pdf.destroy();}};
})();
