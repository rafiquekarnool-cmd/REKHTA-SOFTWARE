const {app,BrowserWindow,ipcMain,dialog,session,safeStorage}=require('electron');
const path=require('path');const fs=require('fs/promises');const crypto=require('crypto');
const offline=require('./license.cjs');let licenseStore,trialStore,pcCode,licenseError;
function canUse(){return !!licenseStore?.active||!!trialStore?.check().active;}
let window;const saveTargets=new Map();
const smoke=process.argv.includes('--smoke-test'),demoStartup=process.argv.includes('--demo-startup-test');
function isOwnFrame(event){return window&&event.sender===window.webContents&&event.senderFrame===window.webContents.mainFrame;}
app.whenReady().then(async()=>{
 try{pcCode=offline.getPCCode();licenseStore=offline.createStore(app.getPath('userData'),pcCode,await fs.readFile(path.join(__dirname,'license-public.pem'),'utf8'));licenseStore.load();if(!licenseStore.active){
 const {execFileSync}=require('child_process'),reg=path.join(process.env.SystemRoot||'C:\\Windows','System32','reg.exe'),key='HKCU\\Software\\RK SOLUTION\\REKHTA';
 if(!safeStorage.isEncryptionAvailable())throw Error('Windows encrypted storage unavailable. Activate with a key.');
 trialStore=require('./trial-store.cjs').createTrial({dir:app.getPath('userData'),pc:pcCode,protect:s=>safeStorage.encryptString(s).toString('base64'),unprotect:s=>safeStorage.decryptString(Buffer.from(s,'base64')),readAnchor:()=>{try{const text=execFileSync(reg,['query',key,'/v','TrialV1'],{encoding:'utf8',windowsHide:true,timeout:5000});return text.match(/TrialV1\s+REG_SZ\s+(\S+)/)?.[1]||null;}catch(e){if(e.status===1)return null;throw e;}},writeAnchor:s=>execFileSync(reg,['add',key,'/v','TrialV1','/t','REG_SZ','/d',s,'/f'],{windowsHide:true,timeout:5000})});
 }}catch(e){licenseError=e.message;}

 window=new BrowserWindow({width:1366,height:900,minWidth:900,minHeight:600,show:false,backgroundColor:'#f1f3f5',title:'REKHTA 3.7 — RK Solution',autoHideMenuBar:true,webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
 window.removeMenu();
 session.defaultSession.setPermissionRequestHandler((_wc,_perm,cb)=>cb(false));
 window.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 window.webContents.on('will-navigate',e=>e.preventDefault());
 session.defaultSession.on('will-download',(_event,item)=>{if(smoke||!canUse()){item.cancel();return;}item.setSaveDialogOptions({title:'Save REKHTA File',defaultPath:path.join(app.getPath('documents'),item.getFilename())});});
 ipcMain.handle('rekhta:text-curves',async(event,runs)=>{
  if(!isOwnFrame(event)||!canUse())throw Error('Activation required');
  return require('./curves-engine.cjs').shapeRuns(runs);
 });
 ipcMain.handle('rekhta:capture-page',async(event,options)=>{
  if(!isOwnFrame(event)||!canUse())throw Error('Activation required');
  const {width,height,scale,html}=options;
  if(![width,height,scale].every(Number.isFinite)||width<=0||height<=0||scale<=0||scale>16||typeof html!=='string'||html.length>32*1024*1024)throw Error('Invalid export');
  const w=Math.ceil(width*scale),h=Math.ceil(height*scale);
  if(w>16000||h>16000||w*h>80000000)throw Error('Export resolution too large');
  const {pathToFileURL}=require('url');
  const font=pathToFileURL(path.join(__dirname,'assets','JameelNooriNastaleeq.ttf')).href;
  const temp=path.join(app.getPath('temp'),'rekhta-export-'+crypto.randomBytes(12).toString('hex')+'.html');
  let exportWindow;
  try {
   const document=`<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; font-src file: data:; img-src file: data: blob: https:; script-src 'none'"><style>@font-face{font-family:"Jameel Noori Nastaleeq";src:url("${font}")}html,body{margin:0;padding:0;overflow:hidden;background:${options.transparent?'transparent':'white'}}#exportRoot{position:absolute;left:0;top:0;width:${width}px;height:${height}px;transform-origin:0 0;transform:scale(${scale});}</style></head><body><div id="exportRoot">${html}</div></body></html>`;
   await fs.writeFile(temp,document);
   exportWindow=new BrowserWindow({width:w,height:h,useContentSize:true,enableLargerThanScreen:true,show:false,backgroundColor:options.transparent?'#00000000':'#ffffff',webPreferences:{offscreen:true,backgroundThrottling:false,contextIsolation:true,nodeIntegration:false,sandbox:true}});
   exportWindow.webContents.setWindowOpenHandler(()=>({action:'deny'}));
   exportWindow.webContents.on('will-navigate',e=>e.preventDefault());
   await exportWindow.loadFile(temp);
   await exportWindow.webContents.executeJavaScript(`(async()=>{await document.fonts.load('34px "Jameel Noori Nastaleeq"');await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()));await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));})()`);
   await new Promise(r=>setTimeout(r,100));
   exportWindow.webContents.debugger.attach('1.3');
   if(options.transparent)await exportWindow.webContents.debugger.sendCommand('Emulation.setDefaultBackgroundColorOverride',{color:{r:0,g:0,b:0,a:0}});
   const image=await exportWindow.webContents.debugger.sendCommand('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:true,clip:{x:0,y:0,width:w,height:h,scale:1}});
   if(!image.data)throw Error('Page capture failed');
   return 'data:image/png;base64,'+image.data;
  } finally {if(exportWindow&&!exportWindow.isDestroyed())exportWindow.destroy();await fs.unlink(temp).catch(()=>{});}
 });
 ipcMain.handle('rekhta:choose-save',async(event,options)=>{
  if(!isOwnFrame(event)||!canUse())throw Error('Activation required');
  const safeName=path.basename(String(options.name||'REKHTA_Design.png')).replace(/[<>:"|?*]/g,'_');
  const extension=String(options.extension||'png');if(!['png','gif','jpg','pdf','eps','zip'].includes(extension))throw Error('Invalid format');
  const result=await dialog.showSaveDialog(window,{title:'Export As Picture',defaultPath:path.join(app.getPath('documents'),safeName),filters:[{name:extension.toUpperCase()+' File',extensions:[extension]}]});
  if(result.canceled)return null;const id=crypto.randomBytes(16).toString('hex');saveTargets.set(id,result.filePath);return{id,name:path.basename(result.filePath)};
 });
 ipcMain.handle('rekhta:save-data',async(event,id,data)=>{if(!isOwnFrame(event)||!canUse()||!saveTargets.has(id))throw Error('Invalid save target');const target=saveTargets.get(id);saveTargets.delete(id);const bytes=Buffer.from(data);if(bytes.length>400*1024*1024)throw Error('Export too large');await fs.writeFile(target,bytes);return true;});
 let errors=[];window.webContents.on('console-message',(_e,level,message)=>{if(level===3){errors.push(message);console.error('Renderer: '+message);}});window.webContents.on('render-process-gone',(_e,details)=>{console.error(details);app.exit(1);});
 ipcMain.handle('rekhta:license-info',event=>{if(!isOwnFrame(event))throw Error('Invalid sender');return licenseError?{error:licenseError}:{pc:pcCode,licensed:!!licenseStore?.active,trial:trialStore?.check()};});
 ipcMain.handle('rekhta:activate',async(event,token)=>{if(!isOwnFrame(event))throw Error('Invalid sender');if(!licenseStore)return {error:licenseError||'PC identification unavailable'};try{const license=licenseStore.activate(token);setTimeout(()=>window.loadFile(path.join(__dirname,'REKHTA.html')).catch(e=>dialog.showErrorBox('REKHTA',e.message)),80);return{customer:license.customer};}catch(e){return{error:e.message};}});
 await window.loadFile(path.join(__dirname,canUse()?'REKHTA.html':'activation.html'));
 if(demoStartup){try{const info=await window.webContents.executeJavaScript('activation.info()');if(!info.trial?.active||info.trial.days!==7)throw Error('Fresh demo did not start with 7 days');await new Promise(r=>setTimeout(r,150));if(!await window.webContents.executeJavaScript("document.getElementById('rkDemoBadge')?.textContent.includes('7 day(s)')"))throw Error('Demo badge missing');console.log('PASS: real Windows PC code, encrypted trial storage, native preload IPC and 7-day editor startup');app.exit(0);}catch(e){console.error(e);app.exit(1);}return;}
 if(smoke){window.show();window.focus();try{await new Promise(r=>setTimeout(r,200));await require('./scripts/smoke.cjs')(window);if(errors.some(e=>/Uncaught|SyntaxError|ReferenceError/.test(e)))throw Error(errors.join('\n'));console.log('REKHTA smoke tests passed');app.exit(0);}catch(e){console.error(e);console.error('Renderer errors:',errors);app.exit(1);}return;}
 window.maximize();window.show();
});
app.on('window-all-closed',()=>app.quit());

