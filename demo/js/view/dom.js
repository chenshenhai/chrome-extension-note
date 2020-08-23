export function setDomStyle($dom, style) {
  const keys = Object.keys(style);
  keys.forEach((key) => {
    $dom.style.setProperty(key, style[key]);
  });
}
