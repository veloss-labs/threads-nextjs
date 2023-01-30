// MIT License
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
export interface FetcherResponse extends Response {
  json: <T = unknown>() => Promise<T>;
}

export interface ResponsePromise extends Promise<FetcherResponse> {
  arrayBuffer: () => Promise<ArrayBuffer>;

  blob: () => Promise<Blob>;

  formData: () => Promise<FormData>;

  // TODO: Use `json<T extends JSONValue>(): Promise<T>;` when it's fixed in TS.
  // See https://github.com/microsoft/TypeScript/issues/15300 and https://github.com/sindresorhus/ky/pull/80
  /**
	Get the response body as JSON.
	@example
	```
	import fetcher from '~/libs/fetcher';
	const json = await fetcher(…).json();
	```
	@example
	```
	import fetcher from '~/libs/fetcher';
	interface Result {
		value: number;
	}
	const result = await fetcher(…).json<Result>();
	```
	*/
  json: <T = unknown>() => Promise<T>;

  text: () => Promise<string>;
}
