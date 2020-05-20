(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.memoize = exports.mem = exports.clearAll = exports.clear = void 0;
var cacheStore = new WeakMap();
var innerCacheStores = new Set();
var utils_1 = __webpack_require__(1);
/**
 * Clear all cached data of a memoized function.
 * @param fn the memoized function.
 * @example
 * import { mem, clear } from 'mp-mem';
 *
 * function test() { return Math.random(); }
 * const memoized = mem(test);
 * clear(memoized);
 */
function clear(fn) {
    var cache = cacheStore.get(fn);
    if (cache && typeof cache.clear === "function") {
        cache.clear();
    }
}
exports.clear = clear;
/**
 * Clear all cache
 * @example
 * import { clearAll } from 'mp-mem';
 *
 * clearAll();
 */
function clearAll() {
    innerCacheStores.forEach(function (store) { return store.clear(); });
    cacheStore = new WeakMap();
}
exports.clearAll = clearAll;
/**
 * Memoize a function.
 * @param fn function to be memoized.
 * @param options memoize options.
 * @example
 *
 * import { mem } from 'mp-mem';
 *
 * function test() {return Math.random();}
 * let memoized = mem(test);
 * memoized();
 */
function mem(fn, options) {
    options = Object.assign({ maxAge: Infinity, cache: new Map(), cacheKey: utils_1.defaultCacheKey }, options);
    var maxAge = options.maxAge, cacheKey = options.cacheKey, cache = options.cache, cachePromiseRejection = options.cachePromiseRejection;
    var memoized = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var key = cacheKey.apply(void 0, args);
        if (cache.has(key)) {
            var _a = cache.get(key), data = _a.data, expiredTime = _a.expiredTime;
            if (typeof maxAge === "number" && Date.now() < expiredTime) {
                return data;
            }
            else {
                cache.delete(key);
            }
        }
        var cacheItem = fn.apply(this, args);
        cache.set(key, {
            data: cacheItem,
            expiredTime: maxAge ? Date.now() + maxAge : Infinity,
        });
        if (utils_1.isPromise(cacheItem) && !cachePromiseRejection) {
            cacheItem.catch(function () { return cache.delete(key); });
        }
        return cacheItem;
    };
    innerCacheStores.add(cache);
    cacheStore.set(memoized, cache);
    return memoized;
}
exports.mem = mem;
/**
 * Memoize a method
 * @param options memoize options
 * @example
 *
 * import { memoize } from 'mp-mem';
 *
 * const cleanableMem=memoize();
 *
 * class Demo{
 *  @memoize()
 *  do(){}
 *
 *  @cleanableMem
 *  do(){}
 * }
 *
 * cleanableMem.clear();
 */
function memoize(options) {
    var memoized;
    var decorator = function (target, name, descriptor) {
        var original = descriptor.value;
        if (typeof original !== "function") {
            throw new Error("The decorator memoize can only be used on functions.");
        }
        memoized = mem(original, options);
        descriptor.value = memoized;
    };
    decorator.clear = function () { return utils_1.isFn(memoized) && clear(memoized); };
    return decorator;
}
exports.memoize = memoize;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCacheKey = exports.isPromise = exports.isPrimitive = exports.isObj = exports.isFn = void 0;
function isFn(fn) {
    return typeof fn === "function";
}
exports.isFn = isFn;
function isObj(obj) {
    return typeof obj === "object";
}
exports.isObj = isObj;
function isPrimitive(obj) {
    return !isObj(obj) && obj !== null;
}
exports.isPrimitive = isPrimitive;
function isPromise(p) {
    if (p instanceof Promise) {
        return true;
    }
    if (p === null) {
        return false;
    }
    if (!isObj(p) && !isFn(p)) {
        return false;
    }
    return isFn(p.then) && isFn(p.catch);
}
exports.isPromise = isPromise;
var defaultKey = Symbol();
function defaultCacheKey() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length === 0) {
        return defaultKey;
    }
    var first = args[0];
    return args.length === 1 && isPrimitive(first) ? first : JSON.stringify(args);
}
exports.defaultCacheKey = defaultCacheKey;


/***/ })
/******/ ])));
//# sourceMappingURL=index.js.map