# Page Action

## Prepare Directory

```sh
.
├── css
│   └── popup.css
├── html
│   ├── page.html
│   └── popup.html
├── icon.png
├── js
│   ├── background.js
│   ├── content-script.js
│   └── popup.js
└── manifest.json
```

## Files Source

### Popup

#### popup.html

```html
<html>
  <head>
    <link rel="stylesheet" href="/css/popup.css"/>
  </head>
  <body>
    <div class="popup-container" id="J_PopupContainer"></div>
  </body>
  <script type="module" src="/js/popup.js"></script>
</html>
```

#### popup.js

```js
const $container = document.querySelector('#J_PopupContainer');

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

function renderList() {
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

function main() {
  renderList();
}

main();
```

#### popup.css

```css
body,html {
  margin: 0;
  padding: 0;
}

.popup-container {
  width: 320px;
  max-height: 640px;
}

.popup-list {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: rgba(0,0,0,.65);
  font-size: 14px;
  /* font-variant: tabular-nums; */
  line-height: 1.5715;
  list-style: none;
  /* font-feature-settings: "tnum"; */
  background-color: #fafafa;
  /* border: 1px solid #d9d9d9; */
  border-bottom: 0;
  border-radius: 2px;
}

.popup-list-item {
  position: relative;
  padding: 12px 16px 12px 40px;
  color: rgba(0,0,0,.85);
  line-height: 1.5715;
  cursor: pointer;
  border-bottom: 1px solid #d9d9d9;
}

.popup-list-item:hover {
  background-color: #f0f0f0;
}
```


### Extension Page

./html/page.html

```html 
<html>
  <head>
  </head>
  <body>
    <h1>This is extension-page</h1>
  </body>
</html>
```

### Content Script

#### content-script.js

```js

function setDomStyle($dom, style) {
  const keys = Object.keys(style);
  keys.forEach((key) => {
    $dom.style.setProperty(key, style[key]);
  });
}

function renderSider() {
  const id = 'J_Crx_Sider';
  const $body = document.querySelector('body');
  if ($body.querySelectorAll(`#${id}`).length > 0) {
    return;
  }
  // console.log('renderSider -----  renderSider ---- renderSider');
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

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.name === 'content-script/render/sider') {
    renderSider();
  }
  sendResponse({ success: true, })
});
```

