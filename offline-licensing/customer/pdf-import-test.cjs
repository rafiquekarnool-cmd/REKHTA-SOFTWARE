const {app,BrowserWindow}=require('electron'),assert=require('assert/strict');
app.whenReady().then(async()=>{try{
 const w=new BrowserWindow({width:1400,height:1000,show:true,webPreferences:{contextIsolation:true}});await w.loadFile('REKHTA.html');const run=s=>w.webContents.executeJavaScript(s);
 await run('rkWelcomeStart.click();newDoc(false);void 0;');
 const result=await run(`(async()=>{const doc=new jspdf.jsPDF();doc.setFillColor(220,0,0);doc.rect(15,15,60,40,'F');doc.text('PDF page one',20,80);doc.addPage();doc.setFillColor(0,0,220);doc.rect(15,15,60,40,'F');doc.text('PDF page two',20,80);await rekhtaImportPDF(doc.output('arraybuffer'),{dpi:72});const images=[...page.querySelectorAll('.obj[data-pdf-page]')];return {count:rekhtaPagination.count,images:images.map(el=>({page:el.dataset.pdfPage,top:parseFloat(el.style.top),width:el.querySelector('img').naturalWidth})),menu:!!document.getElementById('rkImportPDF'),accept:fileInput.accept,serialized:serialize().html};})()`);
 assert.equal(result.count,2);assert.equal(result.images.length,2);assert(result.images[1].top>result.images[0].top+1000);assert(result.images.every(x=>x.width>500));assert(result.menu&&result.accept.includes('.pdf'));assert(result.serialized.includes('data:image/png'));
 const invalid=await run(`rekhtaImportPDF(new Uint8Array([1,2,3])).then(()=>false,()=>true)`);assert(invalid);assert.equal(await run(`page.querySelectorAll('.obj[data-pdf-page]').length`),2);
 console.log('PASS: embedded offline PDF parser, two-page import, image insertion, serialization and invalid PDF handling');app.exit(0);
 }catch(e){console.error(e);app.exit(1);}});
