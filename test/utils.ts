import { isFn, isObj, isPrimitive, isPromise, defaultCacheKey } from '../src/utils';

declare var __dirname;

console.log(__dirname);
console.assert(isFn(Function.prototype), "isFn");
console.assert(isObj({}), "isObj({})");
console.assert(isObj(null), "isObj(null)");
console.assert(isPrimitive(1), "isPrimitive(1)");
console.assert(isPrimitive("str"), "isPrimitive('str')");
console.assert(!isPrimitive({}), "isPrimitive({})");
console.assert(!isPrimitive(null), "isPrimitive(null)");
console.assert(isPromise(Promise.resolve()), "isPromise(Promise.resolve())");
console.assert(!isPromise(Function.prototype), "isPromise(Function.prototype)");
console.assert(typeof defaultCacheKey() === 'symbol');
console.assert(defaultCacheKey(1) === 1, "defaultCacheKey(1)");
console.assert(defaultCacheKey("") === "", "defaultCacheKey('')");
console.assert(defaultCacheKey(null) === "[null]", "defaultCacheKey(null)");
console.assert(defaultCacheKey({}) === '[{}]', `defaultCacheKey({}):${defaultCacheKey({})}`);
console.assert(defaultCacheKey(1, 2) === '[1,2]', "defaultCacheKey(1, 2)");