import * as path from 'path';
import { Component, Processer } from '@nelts/process';
import { NELTS_CONFIGS } from './export';
import Require from './helper/require';
import Compiler from './compiler';

export type InCommingMessage = {
  base: string,
  env: string,
  config?: string,
  cwd: string,
  script: string,
  kind: number,
  [name: string]: any,
}

export default class Factory<T> extends Component {
  private _base: string;
  private _env: string;
  private _inCommingMessage: InCommingMessage;
  private _configs: NELTS_CONFIGS = {};
  private _plugins: { [name: string]: T } = {};
  public readonly compiler: Compiler<T> = new Compiler();

  constructor(processer: Processer, args: InCommingMessage) {
    super(processer, args);
    this._base = args.base ? path.resolve(args.base || '.') : args.cwd;
    this._env = args.env;
    this._inCommingMessage = args;

    if (args.config) {
      this._configs = Require(args.config, this._base);
    }
  }

  get inCommingMessage() {
    return this._inCommingMessage;
  }

  get logger() {
    return this.processer.logger;
  }

  get base() {
    return this._base;
  }

  get env() {
    return this._env;
  }

  get plugins() {
    return this._plugins;
  }

  get configs() {
    return this._configs;
  }
}