const {app,BrowserWindow,ipcMain,dialog,session}=require('electron');
const path=require('path');const fs=require('fs/promises');const crypto=require('crypto');
let window;const saveTargets=new Map();
const smoke=process.argv.includes('--smoke-test');
function isOwnFrame(event){return window&&event.sender===window.webContents&&event.senderFrame===window.webContents.mainFrame;}
app.whenReady().then(async()=>{
 window=new BrowserWindow({width:1366,height:900,minWidth:900,minHeight:600,show:false,backgroundColor:'#f1f3f5',title:'REKHTA 3.7 — RK Solution',autoHideMenuBar:true,webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
 window.removeMenu();
 session.defaultSession.setPermissionRequestHandler((_wc,_perm,cb)=>cb(false));
 window.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 window.webContents.on('will-navigate',e=>e.preventDefault());
 session.defaultSession.on('will-download',(_event,item)=>{if(smoke){item.cancel();return;}item.setSaveDialogOptions({title:'Save REKHTA File',defaultPath:path.join(app.getPath('documents'),item.getFilename())});});
 ipcMain.handle('rekhta:choose-save',async(event,options)=>{
  if(!isOwnFrame(event))throw Error('Invalid sender');
  const safeName=path.basename(String(options.name||'REKHTA_Design.png')).replace(/[<>:"|?*]/g,'_');
  const extension=String(options.extension||'png');if(!['png','gif','jpg','pdf','eps'].includes(extension))throw Error('Invalid format');
  const result=await dialog.showSaveDialog(window,{title:'Export As Picture',defaultPath:path.join(app.getPath('documents'),safeName),filters:[{name:extension.toUpperCase()+' File',extensions:[extension]}]});
  if(result.canceled)return null;const id=crypto.randomBytes(16).toString('hex');saveTargets.set(id,result.filePath);return{id,name:path.basename(result.filePath)};
 });
 ipcMain.handle('rekhta:save-data',async(event,id,data)=>{if(!isOwnFrame(event)||!saveTargets.has(id))throw Error('Invalid save target');const target=saveTargets.get(id);saveTargets.delete(id);const bytes=Buffer.from(data);if(bytes.length>400*1024*1024)throw Error('Export too large');await fs.writeFile(target,bytes);return true;});
 let errors=[];window.webContents.on('console-message',(_e,level,message)=>{if(level===3)errors.push(message);});window.webContents.on('render-process-gone',(_e,details)=>{console.error(details);app.exit(1);});
 await window.loadFile('REKHTA.html');
 if(smoke){window.show();window.focus();try{await new Promise(r=>setTimeout(r,200));await require('./scripts/smoke.cjs')(window);if(errors.some(e=>/Uncaught|SyntaxError|ReferenceError/.test(e)))throw Error(errors.join('\n'));console.log('REKHTA smoke tests passed');app.exit(0);}catch(e){console.error(e);app.exit(1);}return;}
 window.maximize();window.show();
});
app.on('window-all-closed',()=>app.quit());
