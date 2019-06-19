export interface OPTIONS {
    maxAge?: number;
}
export default class LRU {
    private max;
    private size;
    private cache;
    private _cache;
    constructor(max: number);
    get(key: any, options?: OPTIONS): any;
    set(key: any, value: any, options?: OPTIONS): void;
    keys(): unknown[];
    _update(key: any, item: any): void;
}
