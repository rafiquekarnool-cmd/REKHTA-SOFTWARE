const assert=require('assert');
module.exports=async function(win){
 await win.webContents.executeJavaScript(`startStudio();`);await new Promise(r=>setTimeout(r,300));
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
};
