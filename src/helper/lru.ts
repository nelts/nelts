export interface OPTIONS {
  maxAge?: number
}

export default class LRU {
  private max: number;
  private size: number;
  private cache: Map<any, any>;
  private _cache: Map<any, any>;
  constructor(max: number) {
    this.max = max;
    this.size = 0;
    this.cache = new Map();
    this._cache = new Map();
  }

  get(key: any, options?: OPTIONS) {
    let item = this.cache.get(key);
    const maxAge = options && options.maxAge;
    // only call Date.now() when necessary
    let now: number;
    function getNow() {
      now = now || Date.now();
      return now;
    }
    if (item) {
      // check expired
      if (item.expired && getNow() > item.expired) {
        item.expired = 0;
        item.value = undefined;
      } else {
        // update expired in get
        if (maxAge !== undefined) {
          const expired = maxAge ? getNow() + maxAge : 0;
          item.expired = expired;
        }
      }
      return item.value;
    }

    // try to read from _cache
    item = this._cache.get(key);
    if (item) {
      // check expired
      if (item.expired && getNow() > item.expired) {
        item.expired = 0;
        item.value = undefined;
      } else {
        // not expired, save to cache
        this._update(key, item);
        // update expired in get
        if (maxAge !== undefined) {
          const expired = maxAge ? getNow() + maxAge : 0;
          item.expired = expired;
        }
      }
      return item.value;
    }
  }

  set(key: any, value: any, options?: OPTIONS) {
    const maxAge = options && options.maxAge;
    const expired = maxAge ? Date.now() + maxAge : 0;
    let item = this.cache.get(key);
    if (item) {
      item.expired = expired;
      item.value = value;
    } else {
      item = {
        value,
        expired,
      };
      this._update(key, item);
    }
  }

  keys() {
    const cacheKeys = new Set();
    const now = Date.now();

    for (const entry of this.cache.entries()) {
      checkEntry(entry);
    }

    for (const entry of this._cache.entries()) {
      checkEntry(entry);
    }

    function checkEntry(entry: any) {
      const key = entry[0];
      const item = entry[1];
      if (entry[1].value && (!entry[1].expired) || item.expired >= now) {
        cacheKeys.add(key);
      }
    }

    return Array.from(cacheKeys.keys());
  }

  _update(key: any, item: any) {
    this.cache.set(key, item);
    this.size++;
    if (this.size >= this.max) {
      this.size = 0;
      this._cache = this.cache;
      this.cache = new Map();
    }
  }
}