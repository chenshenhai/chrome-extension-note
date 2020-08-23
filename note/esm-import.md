# ESM import


## Prepare Directory

```sh
.
├── css
│   └── popup.css
├── html
│   ├── background.html
│   ├── page.html
│   └── popup.html
├── icon.png
├── js
│   ├── background.js
│   ├── content
│   │   └── global.js
│   ├── content-script.js
│   ├── popup.js
│   ├── util
│   │   └── type.js
│   └── view
│       ├── dom.js
│       ├── menu.js
│       └── render-sider.js
└── manifest.json
```

## Files Source

### manifest.json

```json
{
  "manifest_version": 2,
  "name": "Chrome-Extension-Note",
  "description": "A Chrome-Extension-Note",
  "version": "0.0.1",
  "permissions": [
    "activeTab"
  ],
  "icons": {
		"48": "icon.png",
		"128": "icon.png"
	},
  "browser_action": {
    "default_icon": "icon.png",
    "default_popup": "html/popup.html"
  },
  "background": {
    "page": "html/background.html",
    "persistent": false
  },
  "content_scripts": [
    {
      "matches": ["*://*/*"],
      "js": [
        "js/content-script.js"
      ]
    }
  ],
  "web_accessible_resources": [
    "js/content/global.js",
    "js/view/sider.js",
    "js/view/dom.js"
  ]
}
```

### Popup

#### html/popup.html

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

#### js/popup.js

```js
import { renderMenu } from './view/menu.js';

renderMenu('#J_PopupContainer');
```

#### js/view/menu.js

```js
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
```

#### css/popup.css

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
  line-height: 1.5715;
  list-style: none;
  background-color: #fafafa;
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

#### html/page.html

```html
<html>
  <body>
    <h1>This is extension-page</h1>
  </body>
</html>
```

### Content-Script

#### js/content-script.js

```js
function load(path) {
  let script = document.createElement('script');
  script.setAttribute('type', 'module')
  script.src = chrome.extension.getURL(path);
  const head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;
  head.insertBefore(script, head.lastChild);
}

load('js/content/global.js');

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.name === 'content-script/render/sider') {
    load('js/view/render-sider.js');
  }
  sendResponse({ success: true, });
});
```

#### js/view/render-sider.js

```js
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
```

### Background

#### html/background.html

```html
<html>
  <body>
    <div>background page</div>
  </body>
  <script type="module" src="/js/background.js"></script>
</html>
```

#### js/background.js

```js
import { getType } from './util/type.js';

console.log('this is background.js')

const type = getType(123);
console.log('type =', type);
```

