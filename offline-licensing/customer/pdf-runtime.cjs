const fs=require('fs'),path=require('path');
module.exports=function(root){
 root=root||path.dirname(require.resolve('pdfjs-dist/package.json'));
 const escape=s=>s.replace(/<\/script/gi,'<\\/script');
 const resources={};for(const folder of ['cmaps','standard_fonts']){resources[folder]={};for(const name of fs.readdirSync(path.join(root,folder))){if(name.endsWith('.bcmap')||name.endsWith('.pfb')||name.endsWith('.ttf'))resources[folder][name]=fs.readFileSync(path.join(root,folder,name)).toString('base64');}}
 const worker=fs.readFileSync(path.join(root,'build/pdf.worker.min.js')).toString('base64');
 return '\n<script>'+escape(fs.readFileSync(path.join(root,'build/pdf.min.js'),'utf8'))+'</script>\n<script>window.rkPDFResources='+JSON.stringify(resources)+';pdfjsLib.GlobalWorkerOptions.workerSrc=URL.createObjectURL(new Blob([Uint8Array.from(atob('+JSON.stringify(worker)+'),c=>c.charCodeAt(0))],{type:"text/javascript"}));</script>';
};
