const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');fs.mkdirSync(path.join(root,'vendor'),{recursive:true});
for(const [from,to] of [['html2canvas/dist/html2canvas.min.js','html2canvas.min.js'],['jspdf/dist/jspdf.umd.min.js','jspdf.umd.min.js']])fs.copyFileSync(require.resolve(from),path.join(root,'vendor',to));

const zlib=require('zlib');fs.writeFileSync(path.join(root,'assets','JameelNooriNastaleeq.ttf'),zlib.brotliDecompressSync(fs.readFileSync(path.join(root,'assets','JameelNooriNastaleeq.ttf.br'))));

const htmlFile=path.join(root,'REKHTA.html');let html=fs.readFileSync(htmlFile,'utf8');const marker='<!-- verified-vector-tools -->';
if(!html.includes(marker)){const addon=['vector-tools.js','vector-ui.js','layers-ui.js'].map(f=>fs.readFileSync(path.join(__dirname,f),'utf8')).join('\n');html=html.replace('</body>',marker+'\n<script>\n'+addon+'\n</script>\n</body>');fs.writeFileSync(htmlFile,html);}
