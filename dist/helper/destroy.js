"use strict";
/*!
 * destroy
 * Copyright(c) 2014 Jonathan Ong
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Stream = require("stream");
function destroy(stream) {
    if (stream instanceof fs_1.ReadStream) {
        return destroyReadStream(stream);
    }
    if (!(stream instanceof Stream)) {
        return stream;
    }
    if (typeof stream.destroy === 'function') {
        stream.destroy();
    }
    return stream;
}
exports.default = destroy;
function destroyReadStream(stream) {
    stream.destroy();
    if (typeof stream.close === 'function') {
        stream.on('open', onOpenClose);
    }
    return stream;
}
function onOpenClose() {
    if (typeof this.fd === 'number') {
        this.close();
    }
}
