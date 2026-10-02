const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('rekhtaDesktop',{
 capturePage:(options)=>ipcRenderer.invoke('rekhta:capture-page',options),
 chooseSave:(options)=>ipcRenderer.invoke('rekhta:choose-save',options),
 writeSave:(id,bytes)=>ipcRenderer.invoke('rekhta:save-data',id,bytes)
});

contextBridge.exposeInMainWorld('activation',{info:()=>ipcRenderer.invoke('rekhta:license-info'),activate:key=>ipcRenderer.invoke('rekhta:activate',key)});
