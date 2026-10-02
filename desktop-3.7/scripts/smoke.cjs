const assert=require('assert');
module.exports=async function(win){
 const execute=win.webContents.executeJavaScript.bind(win.webContents);win.webContents.executeJavaScript=async(...args)=>{await new Promise(r=>setTimeout(r,35));return execute(...args);};
 console.log('Smoke: editor startup');await win.webContents.executeJavaScript(`(()=>{try{startStudio();}catch(e){console.error(e.stack);throw e;}})()`);await new Promise(r=>setTimeout(r,300));
 const initial=await win.webContents.executeJavaScript(`(async()=>{await document.fonts.load('34px "Jameel Noori Nastaleeq"');return {visible:!app.classList.contains('hidden'),font:document.fonts.check('34px "Jameel Noori Nastaleeq"'),vendor:typeof html2canvas==='function'&&!!window.jspdf};})()`);
 assert(initial.visible&&initial.font&&initial.vendor,'Editor, font and offline exports must load');

 console.log('Smoke: browser EPS capture');
 const browserExport=await win.webContents.executeJavaScript(`(async()=>{
 const holder=document.createElement('div');holder.style.cssText='position:fixed;left:0;top:0;z-index:-2147483647;pointer-events:none;';
 const sheet=document.createElement('div');sheet.style.cssText='position:relative;width:240px;height:160px;background:white;color:black';sheet.innerHTML='<div style="position:absolute;left:20px;top:20px;width:80px;height:50px;background:#e02020"></div><div style="position:absolute;left:20px;top:90px;color:black;font:24px Arial">EPS TEST</div>';holder.appendChild(sheet);document.body.appendChild(holder);
 try{const c=await captureRekhtaBrowserCanvas(sheet,{width:240,height:160,scale:1,backgroundColor:'#ffffff',logging:false});const ctx=c.getContext('2d'),red=[...ctx.getImageData(40,40,1,1).data],d=ctx.getImageData(0,90,240,60).data;let ink=0;for(let i=0;i<d.length;i+=4)if(d[i]<100&&d[i+1]<100&&d[i+2]<100)ink++;return{red,ink};}finally{holder.remove();}
 })()`);
 assert(browserExport.red[0]>180&&browserExport.red[1]<70&&browserExport.ink>20,'Browser export must include colours and text, not white pixels');

 const epsBrowser=await win.webContents.executeJavaScript(`(async()=>{
 const capture=captureRekhtaCanvas,save=saveConfiguredExport,previous=page.innerHTML;
 let output;
 try{page.innerHTML='';const text=createText(60,60,false);text.textContent='نکاح EPS Test';captureRekhtaCanvas=captureRekhtaBrowserCanvas;saveConfiguredExport=async blob=>{output=await blob.text();};
 await runConfiguredExport({name:'Browser EPS',format:'eps',area:'page',dpi:96,scaling:100,gray:false});
 return{header:output.startsWith('%!PS-Adobe'),length:output.length,ink:output.includes('closepath fill'),noRaster:!output.includes('colorimage')};
 }finally{captureRekhtaCanvas=capture;saveConfiguredExport=save;page.innerHTML=previous;selectObj(null);}
 })()`);
 assert(epsBrowser.header&&epsBrowser.length>1000&&epsBrowser.ink&&epsBrowser.noRaster,'Actual browser EPS export of Urdu/English must contain nonwhite RGB data');
 // Rulers use document millimetres, track zoom and keep zero at the page edge.
 const ruler=await win.webContents.executeJavaScript(`(async()=>{setZoom(.5);refreshRekhtaRulers();const half=+rekhtaRulerX.dataset.pixelsPerMm;setZoom(1);stageWrap.scrollTop=100;stageWrap.scrollLeft=20;refreshRekhtaRulers();const f=document.querySelector('.rekhta-ruler-frame').getBoundingClientRect(),p=page.getBoundingClientRect();const result={half,full:+rekhtaRulerX.dataset.pixelsPerMm,x:+rekhtaRulerX.dataset.zero,y:+rekhtaRulerY.dataset.zero,expectedX:p.left-f.left-26,expectedY:p.top-f.top-26,unit:rekhtaRulerX.dataset.unit};fitPage();refreshRekhtaRulers();return result;})()`);
 assert.equal(ruler.unit,'mm');assert(Math.abs(ruler.full-96/25.4)<.00001);assert(Math.abs(ruler.half*2-ruler.full)<.00001);assert(Math.abs(ruler.x-ruler.expectedX)<1&&Math.abs(ruler.y-ruler.expectedY)<1,'Ruler zero must track page edges after scroll');
 console.log('Rulers: calibrated millimetres; zoom scaling and scroll origin verified');

 await win.webContents.executeJavaScript(`(()=>{page.innerHTML='';language.value='ur';currentTextDirection='rtl';const t=createText(450,120,false);t.textContent='نکاح';t.focus();placeCaretEnd(t);})()`);
 const before=await win.webContents.executeJavaScript(`({font:getComputedStyle(selected).fontFamily,dir:selected.dir,count:page.querySelectorAll('.textobj').length})`);
 win.webContents.sendInputEvent({type:'keyDown',keyCode:'Space',modifiers:['control']});win.webContents.sendInputEvent({type:'keyUp',keyCode:'Space',modifiers:['control']});
 await new Promise(r=>setTimeout(r,60));
 const switched=await win.webContents.executeJavaScript(`({language:language.value,font:getComputedStyle(selected).fontFamily,dir:selected.dir,count:page.querySelectorAll('.textobj').length})`);
 assert.equal(switched.language,'en');assert.equal(switched.font,before.font);assert.equal(switched.dir,before.dir);assert.equal(switched.count,1);
 for(const character of ' Wedding')win.webContents.sendInputEvent({type:'char',keyCode:character});await new Promise(r=>setTimeout(r,60));
 const mixed=await win.webContents.executeJavaScript(`selected.textContent`);assert(mixed.includes('نکاح')&&mixed.includes('Wedding'),'Mixed typing must share the same object');
 const pos=await win.webContents.executeJavaScript(`({left:selected.style.left,top:selected.style.top})`);
 for(const keyCode of ['Left','Right','Up','Down']){win.webContents.sendInputEvent({type:'keyDown',keyCode});win.webContents.sendInputEvent({type:'keyUp',keyCode});}
 assert.deepEqual(await win.webContents.executeJavaScript(`({left:selected.style.left,top:selected.style.top})`),pos,'Text arrows must not move the object');
 await win.webContents.executeJavaScript(`setTextDirection('ltr')`);assert.equal(await win.webContents.executeJavaScript(`selected.dir`),'ltr');
 win.webContents.sendInputEvent({type:'keyDown',keyCode:'N',modifiers:['control']});win.webContents.sendInputEvent({type:'keyUp',keyCode:'N',modifiers:['control']});await new Promise(r=>setTimeout(r,50));
 assert.equal(await win.webContents.executeJavaScript(`ipDialogTitle.textContent`),'New Document');await win.webContents.executeJavaScript(`closeIpDialog();openExportDialog();`);assert.equal(await win.webContents.executeJavaScript(`ipDialogTitle.textContent`),'Export As Picture');await win.webContents.executeJavaScript(`closeIpDialog();openKeyboardSettings();`);assert.equal(await win.webContents.executeJavaScript(`ipDialogTitle.textContent`),'Keyboard Preferences');await win.webContents.executeJavaScript(`closeIpDialog();`);
 // Test an actual blank-page mouse click and immediate caret focus.
 const point=await win.webContents.executeJavaScript(`(()=>{page.innerHTML='';selectObj(null);tool='select';const r=page.getBoundingClientRect();return{x:Math.round(r.left+200*zoom),y:Math.round(r.top+100*zoom)};})()`);
 win.webContents.sendInputEvent({type:'mouseDown',x:point.x,y:point.y,button:'left',clickCount:1});win.webContents.sendInputEvent({type:'mouseUp',x:point.x,y:point.y,button:'left',clickCount:1});await new Promise(r=>setTimeout(r,100));
 assert(await win.webContents.executeJavaScript(`document.activeElement?.classList.contains('textobj')`),'Mouse click must show the typing caret');

 // Regression checks for settings isolation, selection, Enter and Hamza.
 const compact=await win.webContents.executeJavaScript(`(()=>{const p=page.getBoundingClientRect(),s=stageWrap.getBoundingClientRect(),d=designDrawer.getBoundingClientRect();return{fits:p.left>=s.left&&p.right<=s.right&&p.top>=s.top&&p.bottom<=s.bottom,left:d.right<=s.left+1,props:designDrawer.contains(document.querySelector('.rightbar')),colors:designDrawer.contains(colorPalette),screen:document.documentElement.scrollWidth<=innerWidth};})()`);
 assert(compact.fits&&!compact.props&&!compact.colors&&compact.screen,'Page must fit the screen without moving baseline side controls');
 console.log('Layout: page fits screen; baseline side controls preserved');
 await win.webContents.executeJavaScript(`(()=>{page.innerHTML='';language.value='ur';currentTextDirection='rtl';const t=createText(450,80,false);t.textContent='می';selectObj(t,false);t.focus();placeCaretEnd(t);})()`);
 assert.equal(await win.webContents.executeJavaScript(`getComputedStyle(selected).fontSize`),'24px');
 await win.webContents.executeJavaScript(`(()=>{applyPaletteColor('#ef4444','fill');fontSize.value='32';fontSize.dispatchEvent(new Event('change',{bubbles:true}));})()`);
 const settings=await win.webContents.executeJavaScript(`({size:getComputedStyle(selected).fontSize,color:getComputedStyle(selected).color,font:getComputedStyle(selected).fontFamily,dir:selected.dir,text:selected.textContent})`);
 assert.equal(settings.size,'32px');assert.equal(settings.color,'rgb(239, 68, 68)');assert(settings.font.includes('Jameel Noori'));assert.equal(settings.dir,'rtl');assert.equal(settings.text,'می');
 await win.webContents.executeJavaScript(`(()=>{selected.focus();const r=document.createRange();r.selectNodeContents(selected);const s=getSelection();s.removeAllRanges();s.addRange(r);rekhtaScriptRange={object:selected,range:r.cloneRange()};insertHamzaAbove();})()`);
 assert.equal(await win.webContents.executeJavaScript(`selected.textContent`),'میٔ','Hamza must preserve selected base letters');
 await win.webContents.executeJavaScript(`(()=>{selected.textContent='first';switchLanguage('en');selected.focus();placeCaretEnd(selected);})()`);
 const firstTop=await win.webContents.executeJavaScript(`(()=>{const r=document.createRange();r.selectNodeContents(selected);return r.getBoundingClientRect().top;})()`);
 win.webContents.sendInputEvent({type:'keyDown',keyCode:'Return'});win.webContents.sendInputEvent({type:'keyUp',keyCode:'Return'});
 win.webContents.sendInputEvent({type:'char',keyCode:'x'});await new Promise(r=>setTimeout(r,80));
 const line=await win.webContents.executeJavaScript(`(()=>{const w=document.createTreeWalker(selected,NodeFilter.SHOW_TEXT);let n,last;while(n=w.nextNode())if(n.data.includes('x'))last=n;const r=document.createRange();r.selectNodeContents(last);return {top:r.getBoundingClientRect().top,breaks:selected.querySelectorAll('br').length,text:selected.innerText};})()`);
 assert(line.breaks>=1&&line.top>firstTop+10,'Enter must put following text on the next line');
 await win.webContents.executeJavaScript(`(()=>{setColorMode('outline');createShape('rect',100,300);document.querySelector('#colorPalette [data-color="#3b82f6"]').click();})()`);
 assert.equal(await win.webContents.executeJavaScript(`getComputedStyle(selected).borderColor`),'rgb(59, 130, 246)','Palette must follow Outline mode');
 console.log('Settings: font size isolated; Hamza keeps base; Enter advances line; Outline changes correctly');
 // Space must preserve standalone and combining Hamza after real phonetic keys.
 await win.webContents.executeJavaScript(`(()=>{page.innerHTML='';language.value='ur';keyboardPrefs.mode='phonetic';const t=createText(450,80,false);t.focus();placeCaretEnd(t);})()`);
 win.webContents.sendInputEvent({type:'keyDown',keyCode:'U',modifiers:['shift']});win.webContents.sendInputEvent({type:'keyUp',keyCode:'U',modifiers:['shift']});
 assert.equal(await win.webContents.executeJavaScript(`selected.textContent`),'ئ','Shift U inserts Urdu Yeh with Hamza');
 win.webContents.sendInputEvent({type:'keyDown',keyCode:'Space'});win.webContents.sendInputEvent({type:'char',keyCode:' '});win.webContents.sendInputEvent({type:'keyUp',keyCode:'Space'});
 assert.equal(await win.webContents.executeJavaScript(`selected.textContent`),'ئ ','Space preserves Yeh with Hamza');
 await win.webContents.executeJavaScript(`(()=>{selected.textContent='می';selected.focus();placeCaretEnd(selected);rekhtaScriptRange=null;insertHamzaAbove();})()`);
 win.webContents.sendInputEvent({type:'keyDown',keyCode:'Space'});win.webContents.sendInputEvent({type:'char',keyCode:' '});win.webContents.sendInputEvent({type:'keyUp',keyCode:'Space'});
 assert.equal(await win.webContents.executeJavaScript(`selected.textContent`),'میٔ ','Space preserves combining Hamza');
 console.log('Hamza: standalone and combining marks survive Space');
 // Type the photographed word one key at a time. Caret must stay inside
 // the uninterrupted word, including at the last letter before Space.
 await win.webContents.executeJavaScript(`(()=>{selected.textContent='';selected.focus();placeCaretEnd(selected);keyboardPrefs.map={...defaultUrduPhonetic};})()`);
 for(const keyCode of ['A','S','L','A','M']){win.webContents.sendInputEvent({type:'keyDown',keyCode});win.webContents.sendInputEvent({type:'keyUp',keyCode});}
 const word=await win.webContents.executeJavaScript(`({text:selected.textContent,nodes:selected.childNodes.length,caret:getSelection().anchorNode.nodeType,offset:getSelection().anchorOffset})`);
 assert.equal(word.text,'اسلام');assert.equal(word.nodes,1);assert.equal(word.caret,3);assert.equal(word.offset,5,'Caret must follow the final Urdu letter within the same text run');
 win.webContents.sendInputEvent({type:'keyDown',keyCode:'Space'});win.webContents.sendInputEvent({type:'char',keyCode:' '});win.webContents.sendInputEvent({type:'keyUp',keyCode:'Space'});
 assert.equal(await win.webContents.executeJavaScript(`selected.textContent`),'اسلام ');
 await win.webContents.executeJavaScript(`(()=>{selected.textContent='می';selected.focus();placeCaretEnd(selected);rekhtaScriptRange=null;insertHamzaAbove();})()`);
 win.webContents.sendInputEvent({type:'keyDown',keyCode:'Space'});win.webContents.sendInputEvent({type:'char',keyCode:' '});win.webContents.sendInputEvent({type:'keyUp',keyCode:'Space'});
 assert.equal(await win.webContents.executeJavaScript(`selected.textContent`),'میٔ ');
 console.log('Urdu: photographed word stays in one text run with caret after the last letter; Space retains all letters and Hamza');


 // Verify the exact RTL Urdu-English workflow requested by the user.
 await win.webContents.executeJavaScript(`(()=>{page.innerHTML='';language.value='ur';currentTextDirection='ltr';const t=createText(100,100,false);t.style.width='600px';t.focus();placeCaretEnd(t);textDirection.value='rtl';textDirection.dispatchEvent(new Event('change',{bubbles:true}));})()`);
 const rtlBefore=await win.webContents.executeJavaScript(`({font:selected.style.fontFamily,dir:selected.dir})`);
 assert.equal(rtlBefore.dir,'rtl');
 const toggle=async()=>{win.webContents.sendInputEvent({type:'keyDown',keyCode:'Space',modifiers:['control']});win.webContents.sendInputEvent({type:'keyUp',keyCode:'Space',modifiers:['control']});await new Promise(r=>setTimeout(r,30));};
 for(const keyCode of ['S','L','A','M']){win.webContents.sendInputEvent({type:'keyDown',keyCode});win.webContents.sendInputEvent({type:'keyUp',keyCode});}
 await toggle();
 for(const character of ' English ')win.webContents.sendInputEvent({type:'char',keyCode:character});
 await toggle();
 for(const keyCode of ['D','N','I','A']){win.webContents.sendInputEvent({type:'keyDown',keyCode});win.webContents.sendInputEvent({type:'keyUp',keyCode});}
 const rtlMixed=await win.webContents.executeJavaScript(`({text:selected.textContent,dir:selected.dir,setting:selected.dataset.textDirection,font:selected.style.fontFamily,count:page.querySelectorAll('.textobj').length,breaks:selected.querySelectorAll('br').length})`);
 assert.equal(rtlMixed.text,'سلام English دنیا');assert.equal(rtlMixed.dir,'rtl');assert.equal(rtlMixed.setting,'rtl');assert.equal(rtlMixed.font,rtlBefore.font);assert.equal(rtlMixed.count,1);assert.equal(rtlMixed.breaks,0);
 for(let i=0;i<4;i++)await toggle();
 assert.equal(await win.webContents.executeJavaScript(`selected.dir`),'rtl','Repeated language changes preserve RTL');
 const restored=await win.webContents.executeJavaScript(`(()=>{const saved=serialize();restore(saved);const t=page.querySelector('.textobj');selectObj(t,false);return {text:t.textContent,dir:t.dir,setting:textDirection.value};})()`);
 assert.equal(restored.text,'سلام English دنیا');assert.equal(restored.dir,'rtl');assert.equal(restored.setting,'rtl');
 console.log('RTL workflow: menu RTL, Urdu-English-Urdu typing in one line, repeated Ctrl+Space and save/restore passed');

 // Arrow keys must actually move the editing caret, not merely leave objects still.
 await win.webContents.executeJavaScript(`(()=>{page.innerHTML='';language.value='en';currentTextDirection='ltr';const t=createText(120,100,false);insertRekhtaText(t,'alpha\\nbeta\\ngamma');const nodes=[...t.childNodes].filter(n=>n.nodeType===3);const r=document.createRange();r.setStart(nodes[1],2);r.collapse(true);getSelection().removeAllRanges();getSelection().addRange(r);t.focus();})()`);
 const caret=()=>win.webContents.executeJavaScript(`({text:getSelection().focusNode.textContent,offset:getSelection().focusOffset})`);
 const arrow=async keyCode=>{win.webContents.sendInputEvent({type:'keyDown',keyCode});win.webContents.sendInputEvent({type:'keyUp',keyCode});await new Promise(r=>setTimeout(r,30));};
 const middle=await caret();assert.equal(middle.text,'beta');assert.equal(middle.offset,2);
 await arrow('Left');assert.equal((await caret()).offset,1,'Left must move caret');
 await arrow('Right');assert.equal((await caret()).offset,2,'Right must move caret');
 await arrow('Up');assert.equal((await caret()).text,'alpha','Up must reach previous line');
 await arrow('Down');assert.equal((await caret()).text,'beta','Down must reach following line');
 console.log('Caret: Left, Right, Up and Down change the actual text selection');
 await win.webContents.executeJavaScript(`(()=>{page.innerHTML='';language.value='ur';currentTextDirection='rtl';const t=createText(500,100,false);t.style.width='600px';insertRekhtaText(t,'سلام\\nدنیا\\nنکاح');const n=[...t.childNodes].filter(n=>n.nodeType===3)[1];const r=document.createRange();r.setStart(n,2);r.collapse(true);getSelection().removeAllRanges();getSelection().addRange(r);t.focus();})()`);
 const urduMiddle=await caret();await arrow('Left');const urduLeft=await caret();assert(urduLeft.offset!==urduMiddle.offset||urduLeft.text!==urduMiddle.text,'RTL Left must move the caret');
 await arrow('Right');const urduRight=await caret();assert(urduRight.offset!==urduLeft.offset||urduRight.text!==urduLeft.text,'RTL Right must move the caret');
 await arrow('Up');assert.equal((await caret()).text,'سلام','RTL Up must reach previous line');
 await arrow('Down');assert.equal((await caret()).text,'دنیا','RTL Down must reach following line');
 console.log('Urdu RTL caret: all four Arrow keys move the text cursor');

 await require('./vector-interactions.cjs')(win);
 // Native Urdu export must preserve live-browser shaping and produce requested pixel dimensions.
 await win.webContents.executeJavaScript(`(()=>{page.innerHTML='';language.value='ur';currentTextDirection='rtl';const t=createText(150,100,false);t.textContent='نکاح مبارک محمد رفیق';t.style.width='500px';t.style.height='150px';t.style.fontSize='48px';})()`);
 const exported=await win.webContents.executeJavaScript(`(async()=>{const c=await captureRekhtaCanvas(page,{scale:1,width:page.offsetWidth,height:page.offsetHeight,backgroundColor:'#ffffff'});const px=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let ink=0;for(let i=0;i<px.length;i+=4)if(px[i]<200&&px[i+1]<200&&px[i+2]<200&&px[i+3]>0)ink++;return {width:c.width,height:c.height,ink,expectedWidth:page.offsetWidth,expectedHeight:page.offsetHeight};})()`);
 assert.equal(exported.width,exported.expectedWidth);assert.equal(exported.height,exported.expectedHeight);assert(exported.ink>100,'Native export must contain visible Urdu glyphs');
 console.log('Export: native Urdu rendering captured');
 // Check real Chromium print-media layout, including newly added editor panels.
 win.webContents.debugger.attach('1.3');
 try {
  await win.webContents.executeJavaScript(`window.dispatchEvent(new Event('beforeprint'))`);
  await win.webContents.debugger.sendCommand('Emulation.setEmulatedMedia',{media:'print'});
  const layout=await win.webContents.executeJavaScript(`(()=>{const outside=[...document.body.querySelectorAll('*')].filter(e=>!e.closest('#page')&&!e.classList.contains('rekhta-print-path'));return {leaks:outside.filter(e=>getComputedStyle(e).display!=='none').map(e=>e.id||e.className||e.tagName),page:getComputedStyle(page).display,transform:getComputedStyle(page).transform,handles:[...page.querySelectorAll('.handle')].every(e=>getComputedStyle(e).display==='none'),paper:document.getElementById('rekhtaPrintPaperSize').textContent};})()`);
  assert.deepEqual(layout.leaks,[],'Only page and its ancestors may appear in print');
  assert.equal(layout.page,'block');assert.equal(layout.transform,'none');assert(layout.handles);assert(layout.paper.includes('@page{size:'));
  const pdf=await win.webContents.printToPDF({printBackground:true,preferCSSPageSize:true});
  assert(pdf.length>1000&&pdf.subarray(0,4).toString()==='%PDF','Print must produce a PDF');
  assert.equal((pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length,1,'Print must contain exactly one sheet, without a blank first page');
  console.log('Print: menus, panels, dialogs and handles excluded; PDF generated');
 } finally {
  await win.webContents.debugger.sendCommand('Emulation.setEmulatedMedia',{media:'screen'});win.webContents.debugger.detach();
 }

 await win.webContents.executeJavaScript(`window.dispatchEvent(new Event('afterprint'))`);
};
