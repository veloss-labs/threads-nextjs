type Timer = ReturnType<typeof setTimeout>;
type CachedKey = string | number;

const _CACHE_KEY_MAP = {
  sitemap: {
    key: 'sst:sitemap', // 사이트맵
    time: 1000 * 60 * 60 * 24 * 7, // 30일
  },
};

interface CachedData<TData = any, TParams = any> {
  data: TData;
  params: TParams;
  time: number;
}
interface RecordData extends CachedData {
  timer: Timer | undefined;
}

const _cache = new Map<CachedKey, RecordData>();

export const getCaches = () => _cache;

export const getCacheMap = () => _CACHE_KEY_MAP;

export const setCache = (
  key: CachedKey,
  cacheTime: number,
  cachedData: CachedData,
) => {
  const currentCache = _cache.get(key);
  if (currentCache?.timer) {
    clearTimeout(currentCache.timer);
  }

  let timer: Timer | undefined = undefined;

  if (cacheTime > -1) {
    // if cache out, clear it
    timer = setTimeout(() => {
      _cache.delete(key);
    }, cacheTime);
  }

  _cache.set(key, {
    ...cachedData,
    timer,
  });
};

export const getCache = (key: CachedKey) => {
  return _cache.get(key);
};

export const clearCache = (key?: string | string[]) => {
  if (key) {
    const cacheKeys = Array.isArray(key) ? key : [key];
    cacheKeys.forEach((cacheKey) => _cache.delete(cacheKey));
  } else {
    _cache.clear();
  }
};

export const removeCache = (key: CachedKey) => {
  _cache.delete(key);
};

export const clearCacheByTime = (time: number) => {
  const now = Date.now();
  _cache.forEach((value, key) => {
    if (now - value.time > time) {
      _cache.delete(key);
    }
  });
};
