const {app,BrowserWindow}=require('electron'),assert=require('assert');
app.whenReady().then(async()=>{try{
const w=new BrowserWindow({show:true,webPreferences:{contextIsolation:true}});await w.loadFile('REKHTA.html');
await w.webContents.executeJavaScript(`(()=>{document.getElementById('rkWelcomeStart').click();const t=createText(50,50,false);t.innerHTML='<div>FIRST LINE</div><div>SECOND LINE</div><div>THIRD LINE</div>';t.focus();const r=document.createRange();r.selectNodeContents(t.children[1]);const s=getSelection();s.removeAllRanges();s.addRange(r);document.dispatchEvent(new Event('selectionchange'));fontSize.value=48;applyTextStyle('fontSize');fontSize.focus();})()`);
const read=()=>w.webContents.executeJavaScript(`({value:fontSize.value,sizes:[...selected.children].map(x=>getComputedStyle(x.querySelector('font')||x).fontSize)})`);
assert.deepStrictEqual((await read()).sizes,['24px','48px','24px']);
for(const [key,value] of [['Up',49],['Down',48]]){w.webContents.sendInputEvent({type:'keyDown',keyCode:key});w.webContents.sendInputEvent({type:'keyUp',keyCode:key});await new Promise(r=>setTimeout(r,250));const result=await read();assert.equal(+result.value,value);assert.deepStrictEqual(result.sizes,['24px',value+'px','24px']);}
console.log('Native size stepper up/down and selected-line isolation passed');app.exit(0);
}catch(e){console.error(e);app.exit(1);}});