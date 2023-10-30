// libs
import { isEmpty, isString } from '~/utils/assertion';
import { isBrowser } from '~/libs/browser/dom';

// errors
import { FetchError } from './fetch.error';

// constants
import { API_ENDPOINTS } from './fetch.constants';

// types
import type { ApiRoutes, Body, ApiOptions } from './fetch.type';

export class FetchService {
  static baseURL = isBrowser
    ? (function () {
        return 'http://localhost:3000';
      })()
    : (function () {
        return 'http://localhost:3000';
      })();

  static prefix = '/api';

  static defineApis = API_ENDPOINTS;

  static getSearchParams = (
    url: ApiRoutes | string,
    params?: URLSearchParams | string,
  ) => {
    if (!params) {
      return url;
    }
    const textSearchParams = isString(params)
      ? params.replace(/^\?/, '')
      : new URLSearchParams(params).toString();
    const searchParams = '?' + textSearchParams;
    const toStringUrl = isString(url) ? url : url.toString();
    return toStringUrl.replace(/(?:\?.*?)?(?=#|$)/, searchParams);
  };

  static makeURL = (request: ApiRoutes, options?: ApiOptions) => {
    let _prefix = this.prefix.endsWith('/')
      ? this.prefix.slice(0, -1)
      : this.prefix;

    const { v1 } = options?.customOptions?.flag ?? {};
    if (v1) {
      _prefix = `${_prefix}/v1/`;
    } else {
      _prefix = `${_prefix}/`;
    }

    const _baseURL = _prefix
      ? new URL(_prefix, this.baseURL)
      : this.baseURL
      ? new URL(this.baseURL)
      : undefined;

    if (!_baseURL) {
      throw new Error('baseURL is undefined');
    }

    if (request instanceof URL) {
      const url = new URL(request.toString(), _baseURL.toString());
      return {
        url: url,
        pathname: url.pathname,
      };
    }

    if (isString(request)) {
      const _fullURL = `${_baseURL.toString()}${request}`;
      const url = new URL(_fullURL);
      return {
        url: url,
        pathname: url.pathname,
      };
    }

    const _clone = new URL(request.url);
    const _fullURL = `${_baseURL.toString()}${_clone.pathname}`;
    const url = new URL(_fullURL);
    return {
      url: url,
      pathname: url.pathname,
    };
  };

  static makeBody = (body?: Body) => {
    if (body instanceof FormData) {
      return body;
    }

    if (!body) {
      return undefined;
    }

    if (isEmpty(body)) {
      return undefined;
    }

    if (!isString(body)) {
      return JSON.stringify(body);
    }

    return body as BodyInit;
  };

  static async get(request: ApiRoutes, options?: ApiOptions) {
    const { url } = this.makeURL(request, options);
    const requset = new Request(url, {
      ...options?.requestInit,
      method: 'GET',
    });
    const response = await fetch(requset);
    if (!response.ok) {
      throw new FetchError(response, requset, options);
    }
    return response;
  }

  static async post(request: ApiRoutes, input?: Body, options?: ApiOptions) {
    const { url } = this.makeURL(request, options);
    const body = this.makeBody(input);
    const requset = new Request(url, {
      ...options?.requestInit,
      method: 'POST',
      body,
    });
    const response = await fetch(requset);
    if (!response.ok) {
      throw new FetchError(response, requset, options);
    }
    return response;
  }

  static async delete(request: ApiRoutes, options?: ApiOptions) {
    const { url } = this.makeURL(request, options);
    const requset = new Request(url, {
      ...options?.requestInit,
      method: 'DELETE',
    });
    const response = await fetch(requset);
    if (!response.ok) {
      throw new FetchError(response, requset, options);
    }
    return response;
  }

  static async put(request: ApiRoutes, input?: Body, options?: ApiOptions) {
    const { url } = this.makeURL(request, options);
    const body = this.makeBody(input);
    const requset = new Request(url, {
      ...options?.requestInit,
      method: 'PUT',
      body,
    });
    const response = await fetch(requset);
    if (!response.ok) {
      throw new FetchError(response, requset, options);
    }
    return response;
  }

  static async toJson<FetchData = any>(response: Response) {
    return response.json() as Promise<FetchData>;
  }

  static async raw(input: RequestInfo | URL, init?: RequestInit | undefined) {
    const requset = new Request(input, init);
    const response = await fetch(requset);
    if (!response.ok) {
      throw new FetchError(response, requset, undefined);
    }
    return response;
  }
}
