(function(){
 const style=document.createElement('style');style.textContent=`
 #ipDialogBackdrop:has(.export-picture-dialog){background:rgba(43,66,66,.38)}
 #ipDialogBackdrop .ip-dialog.export-picture-dialog{background:#f2f5f3;color:#2b4242;border-color:#7d8f8b;box-shadow:0 20px 48px #20393640}
 .export-picture-dialog h3{background:#2b4242;color:#fff;margin:-16px -16px 16px;padding:14px 16px}
 .export-picture-dialog label,.export-picture-dialog legend{color:#2b4242}
 .export-picture-dialog .export-range{border-color:#93a4ab;background:#e5eeeb}
 .export-picture-dialog .export-note{color:#526b66}
 .export-picture-dialog input:not([type=radio]):not([type=checkbox]),.export-picture-dialog select{background:#fff!important;color:#2b4242!important;border:1px solid #93a4ab!important;border-radius:6px;box-sizing:border-box}
 .export-picture-dialog input[type=radio],.export-picture-dialog input[type=checkbox]{accent-color:#2b4242}
 .export-picture-dialog input:focus-visible,.export-picture-dialog select:focus-visible,.export-picture-dialog button:focus-visible{outline:2px solid #6b8784;outline-offset:2px}
 .export-picture-dialog button,.export-picture-dialog #expBrowse{background:#e5eeeb!important;color:#2b4242!important;border:1px solid #93a4ab!important;border-radius:6px!important}
 .export-picture-dialog #ipDialogApply,.export-picture-dialog #expBrowse{background:#2b4242!important;color:#fff!important;border-color:#2b4242!important}
 .export-picture-dialog button:hover:not(:disabled){background:#6b8784!important;color:#fff!important}
 .export-picture-dialog button:disabled{opacity:.55}
 `;document.head.append(style);
})();
