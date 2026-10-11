'use strict';
const fs=require('fs/promises'),path=require('path'),crypto=require('crypto');
function valid(data){if(!data||!data.page||!Number.isFinite(data.page.w)||!Number.isFinite(data.page.h)||data.page.w<=0||data.page.h<=0||typeof data.html!=='string')throw Error('Invalid REKHTA project file');}
function createProjectFiles({chooseSave,chooseOpen}){let current=null,queue=Promise.resolve();const serial=fn=>{const next=queue.then(fn);queue=next.catch(()=>{});return next;};return{
 save(data,saveAs=false){return serial(async()=>{valid(data);const text=JSON.stringify(data,null,2);if(Buffer.byteLength(text)>64*1024*1024)throw Error('Project is too large');const target=saveAs||!current?await chooseSave(current):current;if(!target)return null;const tmp=target+'.'+crypto.randomBytes(8).toString('hex')+'.tmp';try{await fs.writeFile(tmp,text,{mode:0o600});await fs.rename(tmp,target);}finally{await fs.unlink(tmp).catch(()=>{});}current=target;return{name:path.basename(target)};});},
 open(){return serial(async()=>{const file=await chooseOpen();if(!file)return null;const stat=await fs.stat(file);if(stat.size>64*1024*1024)throw Error('Project is too large');const data=JSON.parse(await fs.readFile(file,'utf8'));valid(data);current=file;return{data,name:path.basename(file)};});},
 reset(){return serial(async()=>{current=null;});}
};}
module.exports={createProjectFiles};
