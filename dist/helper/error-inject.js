"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Stream = require("stream");
function ErrorInject(stream, error) {
    if (stream instanceof Stream
        && !~stream.listeners('error').indexOf(error)) {
        stream.on('error', error);
    }
    return stream;
}
exports.default = ErrorInject;
;
