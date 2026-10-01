/* REKHTA contour tracer: pixel boundaries become editable SVG paths. */
(function(root){
'use strict';
function tracePixels(data,w,h,{threshold=160,color=false,minArea=4}={}){
 const labels=new Array(w*h);for(let i=0;i<labels.length;i++){const p=i*4;if(data[p+3]<128){labels[i]=null;continue;}const r=data[p],g=data[p+1],b=data[p+2];labels[i]=color?'#'+[r,g,b].map(v=>Math.round(v/85)*85).map(v=>v.toString(16).padStart(2,'0')).join(''):(.299*r+.587*g+.114*b<threshold?'#000000':null);}
 const groups=new Map();const at=(x,y)=>x<0||y<0||x>=w||y>=h?null:labels[y*w+x];
 function edge(c,a,b){if(!groups.has(c))groups.set(c,new Map());const m=groups.get(c),k=a.join(',');if(!m.has(k))m.set(k,[]);m.get(k).push(b);}
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const c=at(x,y);if(!c)continue;if(at(x,y-1)!==c)edge(c,[x,y],[x+1,y]);if(at(x+1,y)!==c)edge(c,[x+1,y],[x+1,y+1]);if(at(x,y+1)!==c)edge(c,[x+1,y+1],[x,y+1]);if(at(x-1,y)!==c)edge(c,[x,y+1],[x,y]);}
 const result=[];for(const [fill,m] of groups){const rings=[];while(m.size){const key=m.keys().next().value,start=key.split(',').map(Number),points=[start];let current=start;let guard=0;do{const k=current.join(','),nexts=m.get(k);if(!nexts)break;current=nexts.pop();if(!nexts.length)m.delete(k);points.push(current);if(++guard>w*h*4)throw Error('Contour limit');}while(current[0]!==start[0]||current[1]!==start[1]);if(points.length<4)continue;points.pop();let area=0;for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];area+=a[0]*b[1]-b[0]*a[1];}if(Math.abs(area)/2<minArea)continue;const simple=points.filter((b,i)=>{const a=points[(i+points.length-1)%points.length],c=points[(i+1)%points.length];return (b[0]-a[0])*(c[1]-b[1])!==(b[1]-a[1])*(c[0]-b[0]);});rings.push(simple);}
 if(rings.length)result.push({fill,rings});}return result;
}
function pathData(rings){return rings.map(p=>'M'+p.map(a=>a.join(' ')).join(' L')+' Z').join(' ');}
root.RekhtaTrace={tracePixels,pathData};if(typeof module!=='undefined')module.exports=root.RekhtaTrace;
})(typeof window!=='undefined'?window:globalThis);
