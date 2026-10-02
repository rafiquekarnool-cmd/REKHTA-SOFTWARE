const assert=require('assert'),crypto=require('crypto'),fs=require('fs'),os=require('os'),path=require('path');
const {PRODUCT,verify,createStore}=require('./license.cjs');
const {privateKey,publicKey}=crypto.generateKeyPairSync('rsa',{modulusLength:2048});
const pc='RK1-'+'A'.repeat(64),data={product:PRODUCT,version:1,id:crypto.randomUUID(),customer:'Test Customer',pc};
const sign=d=>{const b=Buffer.from(JSON.stringify(d));return b.toString('base64url')+'.'+crypto.sign('RSA-SHA256',b,privateKey).toString('base64url');};
const token=sign(data);assert.equal(verify(token,pc,publicKey).customer,data.customer);
assert.throws(()=>verify(token,'RK1-'+'B'.repeat(64),publicKey));
const tamper=Buffer.from(JSON.stringify({...data,customer:'Changed'})).toString('base64url')+'.'+token.split('.')[1];assert.throws(()=>verify(tamper,pc,publicKey));
assert.throws(()=>verify(sign({...data,product:'OTHER'}),pc,publicKey));assert.throws(()=>verify('invalid',pc,publicKey));
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'rekhta-license-test-'));try{const store=createStore(dir,pc,publicKey);assert.equal(store.load(),null);store.activate(token);assert.equal(createStore(dir,pc,publicKey).load().customer,data.customer);assert.equal(createStore(dir,'OTHER-PC',publicKey).load(),null);fs.writeFileSync(path.join(dir,'activation.rklicense'),'invalid');assert.equal(store.load(),null);}finally{fs.rmSync(dir,{recursive:true,force:true});}
console.log('PASS: valid activation, wrong PC, tampering, wrong product, malformed key, persistence and corrupt storage.');
