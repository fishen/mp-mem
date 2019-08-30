export function isFn(fn: any) {
    return typeof fn === "function";
}

export function isObj(obj: any) {
    return typeof obj === "object";
}

export function isPrimitive(obj: any) {
    return !isObj(obj) && obj !== null;
}

export function isPromise(p: any) {
    if (p instanceof Promise) { return true; }
    if (p === null) { return false; }
    if (!isObj(p) && !isFn(p)) { return false; }
    return isFn(p.then) && isFn(p.catch);
}

const defaultKey = Symbol();

export function defaultCacheKey(...args: any[]) {
    if (args.length === 0) {
        return defaultKey;
    }
    const [first] = args;
    return args.length === 1 && isPrimitive(first) ? first : JSON.stringify(args);
}
