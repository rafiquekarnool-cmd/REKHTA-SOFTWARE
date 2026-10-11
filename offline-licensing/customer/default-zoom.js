(function(){
 const start=startStudio;startStudio=function(...args){const result=start.apply(this,args);setZoom(1);return result;};
 const create=newDoc;newDoc=function(...args){const result=create.apply(this,args);if(args[0]===false&&!app.classList.contains('hidden'))setZoom(1);return result;};
})();
