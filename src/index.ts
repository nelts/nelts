import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { Component, Processer } from '@nelts/process';
export * from './export';
const workScriptFilename = path.resolve(__dirname, './worker/index');

export default class Master extends Component {

  private _base: string;
  private _max: number;
  private _config: string;
  private _forker: () => Promise<any>;

  constructor(processer: Processer, args: { [name:string]: any }) {
    super(processer, args);
    const base = args.base ? path.resolve(args.base || '.') : args.cwd;
    const max = Number(args.max || os.cpus().length);
    if (!fs.existsSync(base)) throw new Error('base cwd is not exists.');
    this._base = base;
    this._config = args.config;
    this._max = max;
  }

  async componentWillCreate() {
    this._forker = this.createWorkerForker(workScriptFilename, { base: this._base, config: this._config });
  }

  async componentDidCreated() {
    for (let i = 0; i < this._max; i++) await this._forker();
  }
  // async componentWillDestroy() {
  //   console.log(3)
  // }
  // async componentDidDestroyed() {
  //   console.log(4)
  // }
  componentCatchError(err: Error) {
    console.error(err);
  }
  componentReceiveMessage(message:any, socket?:any) {}
}