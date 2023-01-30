// MIT License
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import type { FetcherHeadersInit, Options } from '~/libs/fetcher/ts/options';
import { isObject, isArray } from '~/utils/assertion';

export const validateAndMerge = (
  ...sources: Array<Partial<Options> | undefined>
): Partial<Options> => {
  for (const source of sources) {
    if (
      (!isObject(source) || isArray(source)) &&
      typeof source !== 'undefined'
    ) {
      throw new TypeError('The `options` argument must be an object');
    }
  }

  return deepMerge({}, ...sources);
};

export const mergeHeaders = (
  source1: FetcherHeadersInit = {},
  source2: FetcherHeadersInit = {},
) => {
  const result = new globalThis.Headers(source1 as HeadersInit);
  const isHeadersInstance = source2 instanceof globalThis.Headers;
  const source = new globalThis.Headers(source2 as HeadersInit);

  for (const [key, value] of source.entries()) {
    if ((isHeadersInstance && value === 'undefined') || value === undefined) {
      result.delete(key);
    } else {
      result.set(key, value);
    }
  }

  return result;
};

// TODO: Make this strongly-typed (no `any`).
export const deepMerge = <T>(...sources: Array<Partial<T> | undefined>): T => {
  let returnValue: any = {};
  let headers = {};

  for (const source of sources) {
    if (isArray(source)) {
      if (!isArray(returnValue)) {
        returnValue = [];
      }

      returnValue = [...returnValue, ...source];
    } else if (isObject(source)) {
      // eslint-disable-next-line prefer-const
      for (let [key, value] of Object.entries(source)) {
        if (isObject(value) && key in returnValue) {
          value = deepMerge(returnValue[key], value);
        }

        returnValue = { ...returnValue, [key]: value };
      }

      if (isObject((source as any).headers)) {
        headers = mergeHeaders(headers, (source as any).headers);
        returnValue.headers = headers;
      }
    }
  }

  return returnValue;
};
