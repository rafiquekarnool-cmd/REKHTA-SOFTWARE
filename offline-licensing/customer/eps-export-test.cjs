const {app,BrowserWindow}=require('electron'),assert=require('assert/strict'),fs=require('fs');
app.whenReady().then(async()=>{let w;try{
 fs.mkdirSync('test-output',{recursive:true});w=new BrowserWindow({width:1400,height:1000,show:true,webPreferences:{contextIsolation:true}});await w.loadFile('REKHTA.html');const run=s=>w.webContents.executeJavaScript(s);
 await run(`(()=>{rkWelcomeStart.click();newDoc(false);language.value='en';window.t=createText(80,48,false);t.style.left='48px';t.style.width='600px';t.innerHTML=Array.from({length:80},(_,i)=>'PAGE LINE '+i+'<br>').join('');t.focus();placeCaretEnd(t);rekhtaPagination.paginate(t);window.exports=[];saveConfiguredExport=async(blob,name,o)=>{exports.push({blob,name});};captureRekhtaCanvas=async(_s,o)=>{const c=document.createElement('canvas');c.width=20;c.height=30;const x=c.getContext('2d');x.fillStyle='black';x.fillRect(2,3,4,5);return c;};})()`);
 assert(await run(`rekhtaPagination.count>=2`));
 await run(`selectObj(rekhtaPagination.frames[1],false);openCorelExport();void 0`);
 assert.deepEqual(await run(`({format:expFormat.value,from:expFrom.value,to:expTo.value,pages:expPages.checked,all:expAll.checked,transparent:expTransparent.checked})`),{format:'eps',from:'2',to:'2',pages:true,all:false,transparent:true});
 await run(`ipDialogApply.onclick().then(()=>{})`);assert.equal(await run(`exports.length`),1);assert(await run(`exports[0].name.endsWith('-page-2.eps')`));
 const first=await run(`exports[0].blob.text()`);assert(first.startsWith('%!PS-Adobe-3.0 EPSF-3.0'));assert(first.includes('eofill')&&first.includes('closepath'),'EPS contains visible paths');assert(!first.startsWith('PK'),'EPS is not ZIP');
 await run(`exports=[];runConfiguredExport({name:'Corel.eps',format:'eps',area:'page',from:1,to:2,dpi:72,scaling:100}).then(()=>{})`);
 assert.deepEqual(await run(`exports.map(f=>f.name)`),['Corel-page-1.eps','Corel-page-2.eps']);assert(await run(`Promise.all(exports.map(async f=>(await f.blob.text()).startsWith('%!PS-Adobe-3.0 EPSF-3.0'))).then(a=>a.every(Boolean))`));
 for(let i=0;i<2;i++)fs.writeFileSync('test-output/Corel-page-'+(i+1)+'.eps',await run(`exports[${i}].blob.text()`));
 // Desktop multi-page EPS must choose a new path for each following page, never overwrite the first file.
 await run(`window.nativeSaves=[];window.choices=[];window.rekhtaDesktop={chooseSave:async o=>{choices.push(o);return {id:'second'};},writeSave:async(id,b)=>{nativeSaves.push({id,head:String.fromCharCode(...b.slice(0,20))});}};runConfiguredExport({name:'Desktop',format:'eps',area:'page',from:1,to:2,dpi:72,scaling:100,desktopTarget:{id:'first'}}).then(()=>{})`);
 assert.deepEqual(await run(`nativeSaves.map(x=>x.id)`),['first','second']);assert.equal(await run(`choices[0].extension`),'eps');assert.equal(await run(`choices[0].name`),'Desktop-page-2.eps');
 console.log('PASS: Corel EPS default/current page, actual EPS path data, multi-page separate EPS files, clean names and distinct desktop save targets');app.exit(0);
 }catch(e){console.error(e);if(w)fs.writeFileSync('test-output/eps-export-failure.png',(await w.webContents.capturePage()).toPNG());app.exit(1);}});
