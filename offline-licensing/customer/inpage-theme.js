(function(){
const style=document.createElement('style');style.textContent=`
#ipDialogBackdrop:has(#legacyInPageInput){background:rgba(43,66,66,.38)}
#ipDialogBackdrop:has(#legacyInPageInput) .ip-dialog{background:#f2f5f3;color:#2b4242;border-color:#7d8f8b;box-shadow:0 20px 48px #20393640;overflow:hidden}
#ipDialogBackdrop:has(#legacyInPageInput) h3{background:#2b4242;color:#fff;margin:-16px -16px 16px;padding:14px 16px;font-size:17px}
#ipDialogBackdrop:has(#legacyInPageInput) label,#ipDialogBackdrop:has(#legacyInPageInput) p{color:#2b4242}
#ipDialogBackdrop:has(#legacyInPageInput) textarea,#ipDialogBackdrop:has(#legacyInPageInput) input,#ipDialogBackdrop:has(#legacyInPageInput) select{background:#fff!important;color:#2b4242!important;border:1px solid #93a4ab!important;border-radius:6px;padding:10px;box-sizing:border-box}
#ipDialogBackdrop:has(#legacyInPageInput) textarea:focus{outline:2px solid #6b8784;outline-offset:1px}
#ipDialogBackdrop:has(#legacyInPageInput) button{background:#e5eeeb!important;color:#2b4242!important;border:1px solid #93a4ab!important;border-radius:6px}
#ipDialogBackdrop:has(#legacyInPageInput) #legacyConvertButton,#ipDialogBackdrop:has(#legacyInPageInput) #ipDialogApply{background:#2b4242!important;color:#fff!important;border-color:#2b4242!important}
#ipDialogBackdrop:has(#legacyInPageInput) button:hover:not(:disabled){background:#6b8784!important;color:#fff!important}
#ipDialogBackdrop:has(#legacyInPageInput) button:disabled{opacity:.55}
#legacyInPageStatus{background:#e5eeeb;color:#2b4242!important;padding:8px 10px;border-radius:5px}
`;document.head.append(style);
})();
