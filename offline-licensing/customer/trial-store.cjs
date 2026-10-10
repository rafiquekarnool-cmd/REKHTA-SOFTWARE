'use strict';
const fs=require('fs'),path=require('path');
const DURATION=7*24*60*60*1000,TOLERANCE=5*60*1000;
function createTrial({dir,pc,protect,unprotect,readAnchor,writeAnchor,now=Date.now}){
 const file=path.join(dir,'trial-v1.dat');let state,blocked=false,lastWrite=0;
 function save(){const blob=protect(JSON.stringify(state));fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(file+'.tmp',blob,{mode:0o600});fs.renameSync(file+'.tmp',file);writeAnchor(blob);lastWrite=now();}
 function parse(blob){const s=JSON.parse(unprotect(blob));if(s.pc!==pc||s.version!==1||![s.start,s.last].every(Number.isFinite)||s.start<=0||s.last<s.start)throw Error('Invalid trial record');return s;}
 function init(){try{const a=fs.existsSync(file)?parse(fs.readFileSync(file,'utf8')):null,raw=readAnchor(),b=raw?parse(raw):null;if(a&&b&&a.start!==b.start)throw Error('Trial mismatch');state=a||b||{version:1,pc,start:now(),last:now()};if(a&&b)state.last=Math.max(a.last,b.last);check(true);}catch{blocked=true;}}
 function check(force=false){if(blocked)return{active:false,reason:'Trial record unavailable. Activate with a license key.',days:0};if(!state)return{active:false,days:0};const t=now();if(t+TOLERANCE<state.last){blocked=true;return{active:false,days:0,reason:'Computer date moved backwards. Restore the correct date or activate.'};}state.last=Math.max(state.last,t);const expires=state.start+DURATION;if(force||t-lastWrite>=60000){try{save();}catch{blocked=true;return{active:false,days:0,reason:'Unable to save trial record. Activate with a license key.'};}}return{active:t<expires,days:Math.max(0,Math.ceil((expires-t)/86400000)),expires,reason:t>=expires?'Your 7-day demo has ended. Activate REKHTA to continue.':undefined};}
 init();return{check};
}
module.exports={createTrial,DURATION};
