# 001 init

## Prepare Directory

```sh
.
├── html
│   └── popup.html
├── icon.png
├── js
│   ├── background.js
│   └── content-script.js
└── manifest.json
```

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
    "scripts": ["js/background.js"],
    "persistent": false
  },
  "content_scripts": [
    {
      "matches": ["*://*/*"],
      "js": ["js/content-script.js"]
    }
  ]
}
```

### popup.html

```html
<html>
  <body>
    <p>hello world</p>
  </body>
</html>
```

### background.js

```js
console.log('this is background.js')
```

### content-script.js

```js
console.log('this is content-script.js')
```
