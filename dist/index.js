"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const fs = require("fs");
const path = require("path");
const process_1 = require("@nelts/process");
__export(require("./export"));
const workScriptFilename = path.resolve(__dirname, './worker/index');
class Master extends process_1.Component {
    constructor(processer, args) {
        super(processer, args);
        const base = args.base ? path.resolve(args.base || '.') : args.cwd;
        const max = Number(args.max || os.cpus().length);
        if (!fs.existsSync(base))
            throw new Error('base cwd is not exists.');
        this._base = base;
        this._config = args.config;
        this._max = max;
    }
    async componentWillCreate() {
        this._forker = this.createWorkerForker(workScriptFilename, { base: this._base, config: this._config });
    }
    async componentDidCreated() {
        for (let i = 0; i < this._max; i++)
            await this._forker();
    }
    componentCatchError(err) {
        console.log(err);
    }
    componentReceiveMessage(message, socket) { }
}
exports.default = Master;
