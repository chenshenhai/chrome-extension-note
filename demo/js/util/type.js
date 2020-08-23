export function getType(data) {
  return Object.prototype.toString.call(123).replace(/^\[/ig, '').replace(/\]$/ig, '').split(' ')[1];
}