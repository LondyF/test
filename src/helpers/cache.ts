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

    try {
      return JSON.parse(item);
    } catch (error) {
      if (__DEV__) {
        console.log('[Cache] failed parsing stored JSON', {
          key: cacheKey,
          preview: item.slice(0, 120),
          error: String(error),
        });
      }

      throw error;
    }
  }
}
