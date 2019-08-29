import { memoize, mem, clear, clearAll } from '../src/index';

function test() {
    return Math.random();
}

let memoized = mem(test);
console.log(memoized(), memoized());

const value1 = memoized();
console.assert(value1 === memoized());
clear(memoized);
console.assert(value1 !== memoized());

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

const demo = new Demo();
const demo2 = new Demo();
console.log(demo.do(), demo2.do());

const value2 = demo.do();
console.assert(demo.do() === value2, "方法缓存");
const value3 = demo.do1();
console.assert(demo.do1() === value3, "方法缓存2");
cleanableCache.clear();
console.assert(demo.do1() != value3, "删除方法缓存");

const value4 = demo.do();
const value5 = memoized();
clearAll();
console.assert(demo.do() != value4);
console.assert(memoized() != value5);

memoized = mem(test, { maxAge: 1000 });
const value6 = memoized();
setTimeout(() => {
    console.assert(value6 !== memoized());
}, 2000);

