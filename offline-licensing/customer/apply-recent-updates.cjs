const fs=require('fs'),zlib=require('zlib');
const file='REKHTA.html';let html=fs.readFileSync(file,'utf8');html=html.replaceAll('Developed by RK Solution','Developed by RK SOLUTION — Rafique Ahmed N. Karnool');const updates=zlib.gunzipSync(fs.readFileSync('recent-updates.html.gz')).toString('utf8');fs.writeFileSync(file,html+'\n'+updates);for(const marker of ['rkWelcomeStart','rkGalleryTabs','rekhtaDateTime','RAFIQUE AHMED N. KARNOOL'])if(!updates.includes(marker))throw Error('Missing '+marker);console.log('Welcome, design gallery, date/time and branding applied');
fs.appendFileSync(file,'\n<script>'+fs.readFileSync('line-size-fix.js','utf8')+'</script>');

fs.appendFileSync(file,'<style>#rkWelcomeArt::after{content:"";position:absolute;left:0;top:0;width:275px;max-width:76.4%;height:34px;background:#f2f5f3;pointer-events:none}</style>');
fs.appendFileSync(file,'\n<script>'+fs.readFileSync('vector-additions.js','utf8')+'</script>');


fs.appendFileSync(file,'\n<script>'+fs.readFileSync('pagination.js','utf8')+'</script>');

fs.appendFileSync(file,'\n<script>'+fs.readFileSync('free-text-edit.js','utf8')+'</script>');

fs.appendFileSync(file,'\n<script>'+fs.readFileSync('inpage-insert-fix.js','utf8')+'</script>');
fs.appendFileSync(file,'\n<script>'+fs.readFileSync('background-remover.js','utf8')+'</script>');
fs.appendFileSync(file,'\n<script>'+fs.readFileSync('rtl-paste-fix.js','utf8')+'</script>');
fs.appendFileSync(file,'\n<script>'+fs.readFileSync('paragraph-alignment.js','utf8')+'</script>');

fs.appendFileSync(file,'\n<script>'+fs.readFileSync('splash-layout.js','utf8')+'</script>');

fs.appendFileSync(file,'\n<script>'+fs.readFileSync('demo-ui.js','utf8')+'</script>');
