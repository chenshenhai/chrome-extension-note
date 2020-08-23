


const menuListConfig = [
  {
    name: 'Open new extension page',
    callback: () => {
      window.open(chrome.extension.getURL('html/page.html'));
    }
  },
  {
    name: 'Append sider area',
    callback: () => {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            name: 'content-script/render/sider'
          },
          function(response) {
            console.log('response -', response);
          }
        );
      });
    }
  }
]

export function renderMenu(id) {
  const $container = document.querySelector(id);
  if ($container.getAttribute('data-render') === 'ok') {
    return;
  }
  const html = `
  <ul class="popup-list">
    ${menuListConfig.map((item, i) => {
      return `
      <li class="popup-list-item" data-menu-index="${i}" >
        <a>${item.name}</a>
      </li>
      `;
    }).join('')}
  </ul>`;
  $container.innerHTML = html;
  const $menus = $container.querySelectorAll('[data-menu-index]');
  for (let i = 0; i < $menus.length; i++) {
    const $item = $menus[i];
    const config = menuListConfig[i];
    $item.addEventListener('click', (e) => {
      config.callback();
    }, false)
  }
  $container.setAttribute('data-render', 'ok');
}
