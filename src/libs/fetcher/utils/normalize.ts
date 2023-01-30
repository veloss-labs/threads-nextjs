// MIT License
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import { requestMethods } from '~/libs/fetcher/core/constants';
import { isArray, isNumber } from '~/utils/assertion';
import type { HttpMethod } from '~/libs/fetcher/ts/options';
import type { RetryOptions } from '~/libs/fetcher/ts/retry';

export const normalizeRequestMethod = (input: string): string =>
  requestMethods.includes(input as HttpMethod) ? input.toUpperCase() : input;

const retryMethods = ['get', 'put', 'head', 'delete', 'options', 'trace'];

const retryStatusCodes = [408, 413, 429, 500, 502, 503, 504];

const retryAfterStatusCodes = [413, 429, 503];

const defaultRetryOptions: Required<RetryOptions> = {
  limit: 2,
  methods: retryMethods,
  statusCodes: retryStatusCodes,
  afterStatusCodes: retryAfterStatusCodes,
  maxRetryAfter: Number.POSITIVE_INFINITY,
  backoffLimit: Number.POSITIVE_INFINITY,
};

export const normalizeRetryOptions = (
  retry: number | RetryOptions = {},
): Required<RetryOptions> => {
  if (isNumber(retry)) {
    return {
      ...defaultRetryOptions,
      limit: retry,
    };
  }

  if (retry.methods && !isArray(retry.methods)) {
    throw new Error('retry.methods must be an array');
  }

  if (retry.statusCodes && !isArray(retry.statusCodes)) {
    throw new Error('retry.statusCodes must be an array');
  }

  return {
    ...defaultRetryOptions,
    ...retry,
    afterStatusCodes: retryAfterStatusCodes,
  };
};
