// UI helper: toasts and confirm modal (global `UI`)
(function(){
  const UI = {
    init(){
      if(document.getElementById('toastContainer')) return;
      const container = document.createElement('div');
      container.id = 'toastContainer';
      container.setAttribute('aria-live','polite');
      container.className = 'toast-container';
      document.body.appendChild(container);

      // confirm modal
      const modal = document.createElement('div');
      modal.id = 'uiConfirmModal';
      modal.className = 'ui-confirm-modal hidden';
      modal.innerHTML = `
        <div class="ui-confirm-backdrop"></div>
        <div class="ui-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="uiConfirmTitle">
          <p id="uiConfirmMessage"></p>
          <div class="ui-confirm-actions">
            <button id="uiConfirmCancel" class="btn btn-ghost">Cancelar</button>
            <button id="uiConfirmOk" class="btn btn-primary">Aceptar</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('#uiConfirmCancel').addEventListener('click', ()=>{ UI._resolveConfirm(false); });
      modal.querySelector('#uiConfirmOk').addEventListener('click', ()=>{ UI._resolveConfirm(true); });
      UI._confirmResolve = null;


    }
  ,
    toast(type, message, opts = {}){
      UI.init();
      const container = document.getElementById('toastContainer');
      const toast = document.createElement('div');
      toast.className = 'toast ' + (type || 'info');
      toast.setAttribute('role','status');
      toast.innerHTML = `<div class="toast-body">${message}</div>`;

      if(opts.actionText && typeof opts.actionCallback === 'function'){
        const btn = document.createElement('button');
        btn.className = 'toast-action';
        btn.textContent = opts.actionText;
        btn.addEventListener('click', ()=>{
          try{ opts.actionCallback(); }catch(e){console.error(e)}
          clearTimeout(timeout);
          if(toast.parentNode) toast.parentNode.removeChild(toast);
        });
        toast.appendChild(btn);
      }

      container.appendChild(toast);
      // show
      setTimeout(()=>toast.classList.add('visible'), 10);
      const duration = opts.duration || 4000;
      const timeout = setTimeout(()=>{
        toast.classList.remove('visible');
        setTimeout(()=>{ if(toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
      }, duration);

      return {
        dismiss(){ clearTimeout(timeout); toast.classList.remove('visible'); setTimeout(()=>{ if(toast.parentNode) toast.parentNode.removeChild(toast); },300); }
      };
    },

    confirm(message, opts = { okText: 'Aceptar', cancelText: 'Cancelar' }){
      UI.init();
      const modal = document.getElementById('uiConfirmModal');
      document.getElementById('uiConfirmMessage').textContent = message;
      modal.querySelector('#uiConfirmOk').textContent = opts.okText;
      modal.querySelector('#uiConfirmCancel').textContent = opts.cancelText;
      modal.classList.remove('hidden');
      return new Promise((resolve)=>{ UI._confirmResolve = resolve; });
    },

    _resolveConfirm(res){
      const modal = document.getElementById('uiConfirmModal');
      modal.classList.add('hidden');
      if(UI._confirmResolve) UI._confirmResolve(res);
      UI._confirmResolve = null;
    }
  };

  window.UI = UI;
  document.addEventListener('DOMContentLoaded', ()=>UI.init());
})();

