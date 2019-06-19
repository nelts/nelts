import LRU from './lru';
import * as mimeTypes from 'mime-types';

const typeLRUCache = new LRU(100);

export default (type: string) => {
  let mimeType = typeLRUCache.get(type);
  if (!mimeType) {
    mimeType = mimeTypes.contentType(type);
    typeLRUCache.set(type, mimeType);
  }
  return mimeType;
}