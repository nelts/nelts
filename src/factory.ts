import * as path from 'path';
import { Component, Processer } from '@nelts/process';
import { NELTS_CONFIGS, Require } from './export';
import Compiler from './compiler';

export default class Factory<T> extends Component {
  private _base: string;
  private _env: string;
  private _configs: NELTS_CONFIGS = {};
  private _plugins: { [name: string]: T } = {};
  public readonly compiler: Compiler<T> = new Compiler();

  constructor(processer: Processer, args: { [name:string]: any }) {
    super(processer, args);
    this._base = args.base ? path.resolve(args.base || '.') : args.cwd;
    this._env = args.env;

    if (args.config) {
      this._configs = Require(args.config, this._base);
    }
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