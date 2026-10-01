const assert=require('assert');
module.exports=async function(win){
 console.log('Smoke: editor startup');await win.webContents.executeJavaScript(`(()=>{try{startStudio();}catch(e){console.error(e.stack);throw e;}})()`);await new Promise(r=>setTimeout(r,300));
 const initial=await win.webContents.executeJavaScript(`(async()=>{await document.fonts.load('34px "Jameel Noori Nastaleeq"');return {visible:!app.classList.contains('hidden'),font:document.fonts.check('34px "Jameel Noori Nastaleeq"'),vendor:typeof html2canvas==='function'&&!!window.jspdf};})()`);
 assert(initial.visible&&initial.font&&initial.vendor,'Editor, font and offline exports must load');
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
  await win.webContents.debugger.sendCommand('Emulation.setEmulatedMedia',{media:''});win.webContents.debugger.detach();
 }

};
