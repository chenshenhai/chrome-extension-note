import { setDomStyle } from './dom.js';

function renderSider() {
  const id = 'J_Crx_Sider';
  const $body = document.querySelector('body');
  if ($body.querySelectorAll(`#${id}`).length > 0) {
    return;
  }
  const $sider = document.createElement('div');
  setDomStyle($sider, {
    position: 'fixed',
    'z-index': 9999999,
    left: '0',
    top: '0',
    bottom: '0',
    width: '320px',
    background: '#f0f0f0',
    'box-shadow': '0px 0px 6px 4px #ccc',
    padding: '20px 0',
    'box-sizing': 'border-box',
  })
  $sider.setAttribute('id', id);
  $sider.innerHTML = `
    <p style="font-size:20px; color:#000;">This is chrome-extension-sider</p>
  `;
  $body.appendChild($sider);
}

renderSider();