import { getType } from './util/type.js';

console.log('this is background.js')

const type = getType(123);
console.log('type =', type);