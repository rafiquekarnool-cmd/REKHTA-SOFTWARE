(function(){
'use strict';
const css=document.createElement('style');css.textContent=`
@media screen{
#rkWelcome{padding:16px!important;box-sizing:border-box;justify-content:center!important;overflow:hidden!important}
#rkSplashContent{width:460px;max-width:none;display:flex;flex-direction:column;align-items:center;flex:0 0 auto;transform-origin:center center}
#rkWelcome h1{font-size:24px!important;margin:0 0 4px!important}
#rkWelcome .rkUrdu{font-size:24px!important;line-height:2.3!important;min-height:2.3em!important;padding:0 8px!important;margin:0!important}
#rkWelcome .rkName{font-size:36px!important;margin:0!important}
#rkWelcome .rkUrdu.rkUrduName{font-size:32px!important}
#rkWelcomeArt{width:360px!important;height:200px!important;margin:4px auto!important;flex-shrink:0}
#rkWelcomeStart{font-size:14px!important;padding:9px 20px!important;margin:8px!important}
#rkWelcome footer{font-size:11px!important;margin-top:6px!important}#rkWelcome footer strong{font-size:15px!important}
#app>.topbar{position:relative;padding-right:260px!important}
#rekhtaDateTime{position:absolute!important;right:12px!important;top:50%!important;bottom:auto!important;transform:translateY(-50%);font:12px/1.4 Arial,sans-serif!important;padding:3px 6px!important;white-space:nowrap;color:#2b4242!important;z-index:10!important;background:#eef4f3!important}
}
`;document.head.append(css);
const welcome=document.getElementById('rkWelcome');
if(welcome){const content=document.createElement('div');content.id='rkSplashContent';while(welcome.firstChild)content.append(welcome.firstChild);welcome.append(content);
 const fit=()=>{if(!welcome.isConnected)return;content.style.transform='none';const scale=Math.min(1,(innerWidth-32)/460,(innerHeight-32)/Math.max(1,content.offsetHeight));content.style.transform='scale('+Math.max(.1,scale)+')';};
 fit();document.fonts.ready.then(fit);window.addEventListener('resize',fit);
}
const clock=document.getElementById('rekhtaDateTime'),bar=document.querySelector('#app>.topbar');if(clock&&bar)bar.append(clock);
})();
