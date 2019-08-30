declare module "mp-mem/src/utils" {
    export function isFn(fn: any): boolean;
    export function isObj(obj: any): boolean;
    export function isPrimitive(obj: any): boolean;
    export function isPromise(p: any): boolean;
    export function defaultCacheKey(...args: any[]): any;
}
declare module "mp-mem" {
    export interface ICacheStore<TKey = any, TValue = any> {
        has(key: TKey): boolean;
        get(key: TKey): TValue;
        set(key: TKey, value: TValue): void;
        delete(key: TKey): void;
        clear(): void;
        [Symbol.iterator](): any;
    }
    export interface IMemOptions<TKey = any, TValue = any> {
        /**
         * Determines the cache key for storing the result based on the function arguments.
         */
        cacheKey?: (...args: any[]) => TKey;
        /**
         * Use a different cache storage.
         * default is new Map().
         */
        cache?: ICacheStore<TKey, TValue>;
        /**
         * Cache rejected promises.
         */
        cachePromiseRejection?: boolean;
        /**
         * Milliseconds until the cache expires.
         * default is Infinity.
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
    export function clear(fn: (...args: any[]) => any): void;
    /**
     * Clear all cache
     * @example
     * import { clearAll } from 'mp-mem';
     *
     * clearAll();
     */
    export function clearAll(): void;
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
    export function mem(fn: (...args: any[]) => any, options?: IMemOptions): (...args: any[]) => any;
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
    export function memoize(options?: IMemOptions): {
        (target: any, name: string, descriptor: PropertyDescriptor): void;
        clear(): void;
    };
}