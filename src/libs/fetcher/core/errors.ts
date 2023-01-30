// MIT License
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import type { NormalizedOptions } from '~/libs/fetcher/ts/options';

// eslint-lint-disable-next-line @typescript-eslint/naming-convention
export class HTTPError extends Error {
  public response: Response;
  public request: Request;
  public options: NormalizedOptions;

  constructor(
    response: Response,
    request: Request,
    options: NormalizedOptions,
  ) {
    const code =
      response.status || response.status === 0 ? response.status : '';
    const title = response.statusText || '';
    const status = `${code} ${title}`.trim();
    const reason = status ? `status code ${status}` : 'an unknown error';

    super(`Request failed with ${reason}`);

    this.name = 'HTTPError';
    this.response = response;
    this.request = request;
    this.options = options;
  }
}

export class TimeoutError extends Error {
  public request: Request;

  constructor(request: Request) {
    super('Request timed out');
    this.name = 'TimeoutError';
    this.request = request;
  }
}

// DOMException is supported on most modern browsers and Node.js 18+.
// @see https://developer.mozilla.org/en-US/docs/Web/API/DOMException#browser_compatibility
const isDomExceptionSupported = Boolean(globalThis.DOMException);

// TODO: When targeting Node.js 18, use `signal.throwIfAborted()` (https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal/throwIfAborted)
export function composeAbortError(signal?: AbortSignal) {
	/*
	NOTE: Use DomException with AbortError name as specified in MDN docs (https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort)
	> When abort() is called, the fetch() promise rejects with an Error of type DOMException, with name AbortError.
	*/
	if (isDomExceptionSupported) {
		return new DOMException(signal?.reason ?? 'The operation was aborted.', 'AbortError');
	}

	// DOMException not supported. Fall back to use of error and override name.
	const error = new Error(signal?.reason ?? 'The operation was aborted.');
	error.name = 'AbortError';

	return error;
}
