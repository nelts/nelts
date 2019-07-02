import * as path from 'path';
export default function Require<T = any>(pather: string, cwd?: string) {
  const moduleExports = path.isAbsolute(pather) 
    ? require(pather) 
    : require(path.resolve(cwd || process.cwd(), pather));
  return moduleExports.__esModule && moduleExports.default ? <T>moduleExports.default : <T>moduleExports;
}