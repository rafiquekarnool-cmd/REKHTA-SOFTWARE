const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('rekhtaDesktop',{
 chooseSave:(options)=>ipcRenderer.invoke('rekhta:choose-save',options),
 writeSave:(id,bytes)=>ipcRenderer.invoke('rekhta:save-data',id,bytes)
});
