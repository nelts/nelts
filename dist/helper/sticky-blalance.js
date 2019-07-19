"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function stickyWorker(ip) {
    let s = '';
    for (let i = 0; i < ip.length; i++) {
        if (!isNaN(ip[i]))
            s += ip[i];
    }
    return Number(s);
}
exports.default = stickyWorker;
;
