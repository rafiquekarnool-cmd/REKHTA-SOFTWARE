const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('rekhtaDesktop',{
 saveProject:(data,saveAs)=>ipcRenderer.invoke('rekhta:project-save',data,saveAs),
 openProject:()=>ipcRenderer.invoke('rekhta:project-open'),
 resetProject:()=>ipcRenderer.invoke('rekhta:project-reset'),
 capturePage:(options)=>ipcRenderer.invoke('rekhta:capture-page',options),
 chooseSave:(options)=>ipcRenderer.invoke('rekhta:choose-save',options),
 writeSave:(id,bytes)=>ipcRenderer.invoke('rekhta:save-data',id,bytes),
 textCurves:runs=>ipcRenderer.invoke('rekhta:text-curves',runs)
});

contextBridge.exposeInMainWorld('activation',{info:()=>ipcRenderer.invoke('rekhta:license-info'),activate:key=>ipcRenderer.invoke('rekhta:activate',key)});

