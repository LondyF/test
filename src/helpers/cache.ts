import SecureStorage from './secureStorage';

export type CachedItem = {
  data: string;
  key: string;
  apuId?: number;
  lastUpdated: string;
};

export class ItemNotInCache extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'ItemNotInCache';
  }
}

export default class Cache {
  static async storeCacheItem(key: string, data: string, apuId?: number) {
    const cacheKey = `@cache/${apuId === undefined ? key : `${key}/${apuId}`}`;
    const cachedItem: CachedItem = {
      key: cacheKey,
      data,
      apuId,
      lastUpdated: new Date().toLocaleString(),
    };

    await SecureStorage.setItem(cacheKey, JSON.stringify(cachedItem));

    return cachedItem;
  }

  static async getStoredCacheItem(key: string, apuId?: number) {
    const cacheKey = `@cache/${apuId === undefined ? key : `${key}/${apuId}`}`;
    const item = await SecureStorage.getItem(cacheKey);

    if (!item) {
      throw new ItemNotInCache();
    }

    return JSON.parse(item);
  }
}
