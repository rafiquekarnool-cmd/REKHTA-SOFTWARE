'use strict';
const fs=require('fs'),path=require('path');
let ready;const cache=new Map();
function init(){return ready||(ready=require('harfbuzzjs'));}
function loadFont(hb,family,bold,italic){
 const urdu=family==='Jameel Noori Nastaleeq';
 if(!urdu&&family!=='Times New Roman')throw Error('Text to Curves supports Jameel Noori Nastaleeq and Times New Roman.');
 if(urdu&&(bold||italic))throw Error('Use regular Jameel Noori Nastaleeq before converting to curves.');
 const file=urdu?path.join(__dirname,'assets','JameelNooriNastaleeq.ttf'):path.join(process.env.WINDIR||'C:\\Windows','Fonts',bold?(italic?'timesbi.ttf':'timesbd.ttf'):(italic?'timesi.ttf':'times.ttf'));
 if(cache.has(file))return cache.get(file);
 const bytes=fs.readFileSync(file),blob=hb.createBlob(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)),face=hb.createFace(blob,0),font=hb.createFont(face);
 const entry={blob,face,font};cache.set(file,entry);return entry;
}
async function shapeRuns(runs){
 if(!Array.isArray(runs)||runs.length>1000)throw Error('Too many text runs. Convert a smaller text object.');
 if(runs.reduce((n,r)=>n+(typeof r.text==='string'?r.text.length:100001),0)>20000)throw Error('Text is too long.');
 const hb=await init();const result=[];
 for(const run of runs){
  if(typeof run.text!=='string'||!['rtl','ltr'].includes(run.direction))throw Error('Invalid text run');
  const {font,face}=loadFont(hb,run.family,!!run.bold,!!run.italic),buf=hb.createBuffer();
  try{
   buf.addText(run.text);buf.guessSegmentProperties();buf.setDirection(run.direction);if(run.direction==='rtl')buf.setLanguage('ur');hb.shape(font,buf);
   let x=0,y=0;const glyphs=[];
   for(const g of buf.json()){
    if(g.g===0&&run.text.trim())throw Error('A character is missing from '+run.family+'.');
    const d=font.glyphToPath(g.g);if(d)glyphs.push({d,x:x+(g.dx||0),y:y+(g.dy||0)});x+=g.ax||0;y+=g.ay||0;
   }
   result.push({upem:face.upem,advance:x,glyphs});
  }finally{buf.destroy();}
 }
 return result;
}
module.exports={shapeRuns};
