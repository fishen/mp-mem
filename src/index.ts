let cacheStore = new WeakMap();
const innerCacheStores: Set<ICacheStore> = new Set();
import clean from "map-age-cleaner";
import { defaultCacheKey, isFn, isPromise } from "./utils";

export interface ICacheStore<TKey = any, TValue = any> {
    has(key: TKey): boolean;
    get(key: TKey): TValue;
    set(key: TKey, value: TValue): void;
    delete(key: TKey): void;
    clear(): void;
    [Symbol.iterator]();
}

export interface IMemOptions<TKey = any, TValue = any> {
    /**
     * Determines the cache key for storing the result based on the function arguments.
     */
    cacheKey?: (...args: any[]) => TKey;
    /**
     * Use a different cache storage.
     * @default new Map()
     */
    cache?: ICacheStore<TKey, TValue>;
    /**
     * Cache rejected promises.
     */
    cachePromiseRejection?: boolean;
    /**
     * Milliseconds until the cache expires.
     * @default Infinity
     */
    maxAge?: number;
}

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
export function clear(fn: (...args: any[]) => any) {
    const cache = cacheStore.get(fn);
    if (cache && typeof cache.clear === "function") {
        cache.clear();
    }
}

/**
 * Clear all cache
 * @example
 * import { clearAll } from 'mp-mem';
 *
 * clearAll();
 */
export function clearAll() {
    innerCacheStores.forEach((store) => store.clear());
    cacheStore = new WeakMap();
}

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
export function mem(fn: (...args: any[]) => any, options?: IMemOptions) {
    options = Object.assign({ maxAge: Infinity, cache: new Map(), cacheKey: defaultCacheKey }, options);
    const { maxAge, cacheKey, cache, cachePromiseRejection } = options;
    if (typeof maxAge === "number" && maxAge !== Infinity) {
        clean(cache as any);
    }
    const memoized = function (...args: any[]) {
        const key = cacheKey!(...args);
        if (cache!.has(key)) {
            const { data, maxAge: expiredTime } = cache!.get(key);
            if (typeof maxAge === "number" && Date.now() < expiredTime) {
                return data;
            } else {
                cache!.delete(key);
            }
        }
        const cacheItem = fn.apply(this, args);
        cache!.set(key, {
            data: cacheItem,
            maxAge: maxAge ? Date.now() + maxAge : Infinity,
        });
        if (isPromise(cacheItem) && !cachePromiseRejection) {
            cacheItem.catch(() => cache!.delete(key));
        }
        return cacheItem;
    };
    innerCacheStores.add(cache!);
    cacheStore.set(memoized, cache);
    return memoized;
}

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
export function memoize(options?: IMemOptions): MethodDecorator & { clear(): void; } {
    let memoized: any;
    const decorator = function (target: any, name: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        if (typeof original !== "function") {
            throw new Error("The decorator memoize can only be used on functions.");
        }
        memoized = mem(original, options!);
        descriptor.value = memoized;
    };
    decorator.clear = () => isFn(memoized) && clear(memoized);
    return decorator;
}
