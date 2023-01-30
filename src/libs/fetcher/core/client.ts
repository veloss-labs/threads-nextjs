// MIT License
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
import type {
  Input,
  InternalOptions,
  NormalizedOptions,
  Options,
  SearchParamsInit,
} from '~/libs/fetcher/ts/options';
import type { Hooks } from '~/libs/fetcher/ts/hooks';
import { deepMerge, mergeHeaders } from '~/libs/fetcher/utils/merge';
import { normalizeRequestMethod } from '../utils/normalize';
import { isString } from '~/utils/assertion';
import {
  maxSafeTimeout,
  supportsAbortController,
  supportsFormData,
} from '~/libs/fetcher/core/constants';
import timeout, { TimeoutOptions } from '~/libs/fetcher/utils/timeout';
import delay from '~/libs/fetcher/utils/delay';
import { HTTPError, TimeoutError } from './errors';

export class Fetcher {
  public request: Request;
  protected abortController?: AbortController;
  protected _retryCount = 0;
  protected _input: Input;
  protected _options: InternalOptions;

  static create(input: Input, options: Options) {
    const fetcher = new Fetcher(input, options);

    const fn = async (): Promise<Response> => {
      if (fetcher._options.timeout > maxSafeTimeout) {
        throw new RangeError(
          `The \`timeout\` option cannot be greater than ${maxSafeTimeout}`,
        );
      }

      // Delay the fetch so that body method shortcuts can set the Accept header
      await Promise.resolve();
      let response = await fetcher._fetch();

      for (const hook of fetcher._options.hooks.afterResponse) {
        // eslint-disable-next-line no-await-in-loop
        const modifiedResponse = await hook(
          fetcher.request,
          fetcher._options as NormalizedOptions,
          fetcher._decorateResponse(response.clone()),
        );

        if (modifiedResponse instanceof globalThis.Response) {
          response = modifiedResponse;
        }
      }

      fetcher._decorateResponse(response);

      if (!response.ok && fetcher._options.throwHttpErrors) {
        let error = new HTTPError(
          response,
          fetcher.request,
          fetcher._options as unknown as NormalizedOptions,
        );

        for (const hook of fetcher._options.hooks.beforeError) {
          // eslint-disable-next-line no-await-in-loop
          error = await hook(error);
        }

        throw error;
      }

      return response;
    };
  }

  constructor(input: Input, options: Options = {}) {
    this._input = input;
    // @ts-ignore
    this._options = {
      // TODO: credentials can be removed when the spec change is implemented in all browsers. Context: https://www.chromestatus.com/feature/4539473312350208
      credentials: (this._input as Request).credentials || 'same-origin',
      ...options,
      headers: mergeHeaders((this._input as Request).headers, options.headers),
      hooks: deepMerge<Required<Hooks>>(
        {
          beforeRequest: [],
          beforeRetry: [],
          beforeError: [],
          afterResponse: [],
        },
        options.hooks,
      ),
      method: normalizeRequestMethod(
        options.method ?? (this._input as Request).method,
      ),
      prefixUrl: String(options.prefixUrl || ''),
      throwHttpErrors: options.throwHttpErrors !== false,
      timeout:
        typeof options.timeout === 'undefined' ? 10_000 : options.timeout,
      fetch: options.fetch ?? globalThis.fetch.bind(globalThis),
    };

    if (
      !isString(this._input) &&
      !(this._input instanceof URL || this._input instanceof globalThis.Request)
    ) {
      throw new TypeError('`input` must be a string, URL, or Request');
    }

    if (this._options.prefixUrl && isString(this._input)) {
      if (this._input.startsWith('/')) {
        throw new Error(
          '`input` must not begin with a slash when using `prefixUrl`',
        );
      }

      if (!this._options.prefixUrl.endsWith('/')) {
        this._options.prefixUrl += '/';
      }

      this._input = this._options.prefixUrl + this._input;
    }

    if (supportsAbortController) {
      this.abortController = new globalThis.AbortController();
      if (this._options.signal) {
        const originalSignal = this._options.signal;

        this._options.signal.addEventListener('abort', () => {
          this.abortController?.abort(originalSignal.reason);
        });
      }

      this._options.signal = this.abortController.signal;
    }

    this.request = new globalThis.Request(
      this._input as RequestInfo,
      this._options as RequestInit,
    );

    if (this._options.searchParams) {
      const textSearchParams = isString(this._options.searchParams)
        ? this._options.searchParams.replace(/^\?/, '')
        : new URLSearchParams(
            this._options.searchParams as unknown as SearchParamsInit,
          ).toString();
      const searchParams = '?' + textSearchParams;
      const url = this.request.url.replace(/(?:\?.*?)?(?=#|$)/, searchParams);

      // To provide correct form boundary, Content-Type header should be deleted each time when new Request instantiated from another one
      if (
        ((supportsFormData &&
          this._options.body instanceof globalThis.FormData) ||
          this._options.body instanceof URLSearchParams) &&
        !(
          this._options.headers &&
          (this._options.headers as Record<string, string>)['content-type']
        )
      ) {
        this.request.headers.delete('content-type');
      }

      // The spread of `this.request` is required as otherwise it misses the `duplex` option for some reason and throws.
      this.request = new globalThis.Request(
        new globalThis.Request(url, { ...this.request }),
        this._options as RequestInit,
      );
    }

    if (this._options.json !== undefined) {
      this._options.body = JSON.stringify(this._options.json);
      this.request.headers.set(
        'content-type',
        this._options.headers.get('content-type') ?? 'application/json',
      );
      this.request = new globalThis.Request(this.request, {
        body: this._options.body,
      });
    }
  }

  protected _decorateResponse(response: Response): Response {
    if (this._options.parseJson) {
      response.json = async () =>
        this._options.parseJson?.(await response.text());
    }

    return response;
  }

  protected _calculateRetryDelay(error: unknown) {
    this._retryCount++;

    if (
      this._retryCount < this._options.retry.limit &&
      !(error instanceof TimeoutError)
    ) {
      if (error instanceof HTTPError) {
        if (!this._options.retry.statusCodes.includes(error.response.status)) {
          return 0;
        }

        const retryAfter = error.response.headers.get('Retry-After');
        if (
          retryAfter &&
          this._options.retry.afterStatusCodes.includes(error.response.status)
        ) {
          let after = Number(retryAfter);
          if (Number.isNaN(after)) {
            after = Date.parse(retryAfter) - Date.now();
          } else {
            after *= 1000;
          }

          if (
            typeof this._options.retry.maxRetryAfter !== 'undefined' &&
            after > this._options.retry.maxRetryAfter
          ) {
            return 0;
          }

          return after;
        }

        if (error.response.status === 413) {
          return 0;
        }
      }

      const BACKOFF_FACTOR = 0.3;
      return Math.min(
        this._options.retry.backoffLimit,
        BACKOFF_FACTOR * 2 ** (this._retryCount - 1) * 1000,
      );
    }

    return 0;
  }

  protected async _retry<T extends (...args: any) => Promise<any>>(
    fn: T,
  ): Promise<ReturnType<T> | void> {
    try {
      return await fn();
    } catch (error) {
      const ms = Math.min(this._calculateRetryDelay(error), maxSafeTimeout);
      if (ms !== 0 && this._retryCount > 0) {
        await delay(ms, { signal: this._options.signal });

        for (const hook of this._options.hooks.beforeRetry) {
          // eslint-disable-next-line no-await-in-loop
          const hookResult = await hook({
            request: this.request,
            options: this._options as unknown as NormalizedOptions,
            error: error as Error,
            retryCount: this._retryCount,
          });

          // If `stop` is returned from the hook, the retry process is stopped
          // @ts-ignore TS doesn't know that `stop` is a symbol
          if (hookResult === stop) {
            return;
          }
        }

        return this._retry(fn);
      }

      throw error;
    }
  }

  protected async _fetch(): Promise<Response> {
    for (const hook of this._options.hooks.beforeRequest) {
      const result = await hook(
        this.request,
        this._options as unknown as NormalizedOptions,
      );

      if (result instanceof Request) {
        this.request = result;
        break;
      }

      if (result instanceof Response) {
        return result;
      }
    }

    if (this._options.timeout === false) {
      return this._options.fetch(this.request.clone());
    }

    return timeout(
      this.request.clone(),
      this.abortController,
      this._options as TimeoutOptions,
    );
  }
}
