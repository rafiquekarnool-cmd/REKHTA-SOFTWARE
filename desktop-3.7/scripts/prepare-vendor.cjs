const fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'..');fs.mkdirSync(path.join(root,'vendor'),{recursive:true});
for(const [from,to] of [['html2canvas/dist/html2canvas.min.js','html2canvas.min.js'],['jspdf/dist/jspdf.umd.min.js','jspdf.umd.min.js']])fs.copyFileSync(require.resolve(from),path.join(root,'vendor',to));

const zlib=require('zlib');fs.writeFileSync(path.join(root,'assets','JameelNooriNastaleeq.ttf'),zlib.brotliDecompressSync(fs.readFileSync(path.join(root,'assets','JameelNooriNastaleeq.ttf.br'))));
