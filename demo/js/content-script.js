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




