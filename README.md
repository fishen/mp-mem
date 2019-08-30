# mp-mem
A lightweight memoize library that can be used on both normal functions and class methods.

>`$ npm install --save mp-mem`

# Getting started
```
import { mem, memoize } from 'mp-mem';

function test() {
    return Math.random();
}

let memoized = mem(test);

console.log(memoized(), memoized());//0.1748406286127786 0.1748406286127786

class Demo {
    @memoize()
    do() {
        return test();
    }
}

const demo = new Demo();
const demo2 = new Demo();
console.log(demo.do(), demo2.do());/0.1666739674434854 0.1666739674434854
```
# API
## clear(fn: Function)
Clear all cached data of a memoized function.
* **fn**: the memoized function.
```
import { mem, clear } from 'mp-mem';

function test() {
    return Math.random();
}

let memoized = mem(test);
clear(memoized);
```
## clearAll()
Clear all cached data.
```
import { clearAll } from 'mp-mem';

clearAll();
```
## mem( fn: Function, options: object)
Memoize a function.
* **fn**: function to be memoized.
* **options**: memoize options.
* * **cacheKey**(optional): determines the cache key for storing the result based on the function arguments.
* * **cache**(optional, object): determines the cache key for storing the result based on the function arguments, default is new Map().
* * **cachePromiseRejection**(optional, boolean): cache rejected promises.
* * **maxAge**(optional, number): milliseconds until the cache expires, default is Infinity.
```
import { mem } from 'mp-mem';

function test() {
    return Math.random();
}

let memoized = mem(test);
console.log(memoized(), memoized());//0.1748406286127786 0.1748406286127786
```
## memoize( options?: object )
Memoize a method.
* **options**: memoize options, consistent with the options parameter of the **mem** function.
```
import { memoize } from 'mp-mem';

const cleanableCache = memoize();

class Demo {
    @memoize()
    do() {
        return test();
    }
    @cleanableCache
    do1() {
        return test();
    }
}

cleanableCache.clear();//clear cached data.
```