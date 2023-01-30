// MIT License
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import type { Expect, Equal } from '@type-challenges/utils';
import type { HttpMethod } from '~/libs/fetcher/ts/options';

export const supportsAbortController =
  typeof globalThis.AbortController === 'function';
export const supportsFormData = typeof globalThis.FormData === 'function';

export const requestMethods = [
  'get',
  'post',
  'put',
  'patch',
  'head',
  'delete',
] as const;

const validate = <T extends Array<true>>() => undefined as unknown as T;
validate<[Expect<Equal<(typeof requestMethods)[number], HttpMethod>>]>();

export const responseTypes = {
  json: 'application/json',
  text: 'text/*',
  formData: 'multipart/form-data',
  arrayBuffer: '*/*',
  blob: '*/*',
} as const;

// The maximum value of a 32bit int (see issue #117)
export const maxSafeTimeout = 2_147_483_647;

export const stop = Symbol('stop');
