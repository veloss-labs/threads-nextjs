import { createGzip } from 'zlib';
import { SitemapStream, streamToPromise } from 'sitemap';
import { getSitemapApi } from '~/api/services/app/mock';
import { clearCache, getCache, getCacheMap, setCache } from '~/libs/data/cache';

import type { GetServerSidePropsContext } from 'next';
import { getUrl } from '~/utils/utils';

const SitemapIndexXml = () => null;

export default SitemapIndexXml;

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const res = ctx.res;
  // ensure response is XML & gzip encoded
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Content-Encoding', 'gzip');
  console.log('sitemap cache miss', ctx.req.headers.host);

  const url = getUrl({ ctx });

  try {
    const posts = await getSitemapApi({ ctx });
    const sitemapCacheKey = getCacheMap().sitemap;

    const cacheData = getCache(sitemapCacheKey.key);
    if (cacheData && cacheData.data && cacheData.data.sitemap) {
      res.write(cacheData.data.sitemap);
      res.end();
      return {
        props: {},
      };
    }

    const sitemapStream = new SitemapStream({
      hostname: url.origin,
    });
    const pipeline = sitemapStream.pipe(createGzip());

    posts.forEach((post) => {
      sitemapStream.write({
        url: `posts/${post.id}`,
        changefreq: 'monthly',
        priority: 1,
      });
    });

    streamToPromise(pipeline).then((sm) => {
      setCache(sitemapCacheKey.key, sitemapCacheKey.time, {
        data: {
          sitemap: sm,
        },
        params: {},
        time: Date.now(),
      });
    });

    sitemapStream.end();

    const pipe = () => {
      return new Promise((resolve, reject) => {
        pipeline
          .pipe(res)
          .on('error', (e) => {
            reject(e);
          })
          .on('finish', () => {
            resolve(null);
          });
      });
    };

    await pipe();

    return {
      props: {},
    };
  } catch (error) {
    clearCache();
    res.end();
    return {
      props: {},
    };
  }
};
