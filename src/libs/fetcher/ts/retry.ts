// MIT License
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
export interface RetryOptions {
  /**
	The number of times to retry failed requests.
	@default 2
	*/
  limit?: number;

  /**
	The HTTP methods allowed to retry.
	@default ['get', 'put', 'head', 'delete', 'options', 'trace']
	*/
  methods?: string[];

  /**
	The HTTP status codes allowed to retry.
	@default [408, 413, 429, 500, 502, 503, 504]
	*/
  statusCodes?: number[];

  /**
	The HTTP status codes allowed to retry with a `Retry-After` header.
	@default [413, 429, 503]
	*/
  afterStatusCodes?: number[];

  /**
	If the `Retry-After` header is greater than `maxRetryAfter`, the request will be canceled.
	@default Infinity
	*/
  maxRetryAfter?: number;

  /**
	The upper limit of the delay per retry in milliseconds.
	To clamp the delay, set `backoffLimit` to 1000, for example.
	By default, the delay is calculated in the following way:
	```
	0.3 * (2 ** (attemptCount - 1)) * 1000
	```
	The delay increases exponentially.
	@default Infinity
	*/
  backoffLimit?: number;
}
