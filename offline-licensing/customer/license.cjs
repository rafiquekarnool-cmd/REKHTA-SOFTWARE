'use strict';
const crypto=require('crypto');
const fs=require('fs');
const path=require('path');
const {execFileSync}=require('child_process');
const PRODUCT='REKHTA-OFFLINE-1';
function getPCCode(){
 if(process.platform!=='win32')throw Error('This activation build requires Windows.');
 const system=path.join(process.env.SystemRoot||'C:\\Windows','System32');
 const reg=execFileSync(path.join(system,'reg.exe'),['query','HKLM\\SOFTWARE\\Microsoft\\Cryptography','/v','MachineGuid','/reg:64'],{encoding:'utf8',windowsHide:true,timeout:8000});
 const guid=reg.match(/MachineGuid\s+REG_SZ\s+([0-9a-f-]+)/i)?.[1]?.toLowerCase();
 const uuid=execFileSync(path.join(system,'WindowsPowerShell','v1.0','powershell.exe'),['-NoProfile','-NonInteractive','-Command','(Get-CimInstance Win32_ComputerSystemProduct).UUID'],{encoding:'utf8',windowsHide:true,timeout:15000}).trim().toLowerCase();
 if(!guid||!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(uuid)||/^0+-0+-0+-0+-0+$/.test(uuid)||/^f+-f+-f+-f+-f+$/.test(uuid))throw Error('PC identification unavailable. Contact RK Solution.');
 return 'RK1-'+crypto.createHash('sha256').update(PRODUCT+'\n'+guid+'\n'+uuid).digest('hex').toUpperCase();
}
function verify(token,pcCode,publicKey){
 if(typeof token!=='string'||token.length>16000)throw Error('Invalid license key.');
 const parts=token.trim().split('.');if(parts.length!==2||parts.some(x=>!/^[A-Za-z0-9_-]+$/.test(x)))throw Error('Invalid license key.');
 const bytes=Buffer.from(parts[0],'base64url'),sig=Buffer.from(parts[1],'base64url');
 if(!crypto.verify('RSA-SHA256',bytes,publicKey,sig))throw Error('License signature is invalid.');
 let license;try{license=JSON.parse(bytes.toString('utf8'));}catch{throw Error('Invalid license data.');}
 if(license.product!==PRODUCT||license.version!==1||license.pc!==pcCode)throw Error('This key belongs to a different PC.');
 if(typeof license.customer!=='string'||!license.customer.trim()||license.customer.length>120||typeof license.id!=='string'||!/^[0-9a-f-]{36}$/i.test(license.id))throw Error('Invalid customer license.');
 return license;
}
function createStore(dir,pcCode,publicKey){
 const file=path.join(dir,'activation.rklicense');let active=null;
 return {load(){active=null;try{active=verify(fs.readFileSync(file,'utf8'),pcCode,publicKey);}catch{}return active;},get active(){return active;},activate(token){const license=verify(token,pcCode,publicKey);fs.mkdirSync(dir,{recursive:true});const temp=file+'.tmp';fs.writeFileSync(temp,token.trim(),{mode:0o600});fs.renameSync(temp,file);active=license;return license;}};
}
module.exports={PRODUCT,getPCCode,verify,createStore};
