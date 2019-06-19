"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lru_1 = require("./lru");
const mimeTypes = require("mime-types");
const typeLRUCache = new lru_1.default(100);
exports.default = (type) => {
    let mimeType = typeLRUCache.get(type);
    if (!mimeType) {
        mimeType = mimeTypes.contentType(type);
        typeLRUCache.set(type, mimeType);
    }
    return mimeType;
};
