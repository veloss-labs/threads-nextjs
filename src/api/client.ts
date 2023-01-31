import ky from 'ky-universal';
import { getApiEnv, type ApiRoutes } from '~/api/env';
import type { Options } from 'ky';
import type { BaseResponse } from '~/api/ts/schema';

const apiEnv = getApiEnv();

export const apiClient = ky.create({
  prefixUrl: apiEnv.url.toString(),
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set('X-Requested-With', 'ky');
      },
    ],
  },
});

class ApiService {
  async get(pathname: ApiRoutes, options?: Options | undefined) {
    const response = await apiClient.get(pathname, options);
    return response;
  }

  async post(pathname: ApiRoutes, options?: Options | undefined) {
    const response = await apiClient.post(pathname, options);
    return response;
  }

  async delete(pathname: ApiRoutes, options?: Options | undefined) {
    const response = await apiClient.delete(pathname, options);
    return response;
  }

  async put(pathname: ApiRoutes, options?: Options | undefined) {
    const response = await apiClient.put(pathname, options);
    return response;
  }

  async patch(pathname: ApiRoutes, options?: Options | undefined) {
    const response = await apiClient.patch(pathname, options);
    return response;
  }

  async getJson<R = Record<string, any>>(
    pathname: ApiRoutes,
    options?: Options | undefined,
  ) {
    const response = await this.get(pathname, options);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    const data = await response.json<BaseResponse<R>>();
    return data;
  }

  async postJson<R = Record<string, any>, Body = Record<string, any>>(
    pathname: ApiRoutes,
    body: Body,
    options?: Options | undefined,
  ) {
    const baseOptions = {
      ...(options || {}),
      json: body,
    } as Options;

    const response = await this.post(pathname, baseOptions);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    const data = await response.json<BaseResponse<R>>();
    return data;
  }

  async postFormData<R = Record<string, any>>(
    pathname: ApiRoutes,
    formData: FormData | HTMLFormElement,
    options?: Options | undefined,
  ) {
    const body =
      formData instanceof FormData ? formData : new FormData(formData);

    const baseOptions = {
      ...(options || {}),
      headers: {
        ...(options?.headers || {}),
        'Content-Type': 'multipart/form-data',
      },
      body,
    } as Options;

    const response = await this.post(pathname, baseOptions);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    const data = await response.json<BaseResponse<R>>();
    return data;
  }

  async postFormUrlEncoded<R = Record<string, any>>(
    pathname: ApiRoutes,
    body: Record<string, any>,
    options?: Options | undefined,
  ) {
    const baseOptions = {
      ...(options || {}),
      headers: {
        ...(options?.headers || {}),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(body),
    } as Options;

    const response = await this.post(pathname, baseOptions);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    const data = await response.json<BaseResponse<R>>();
    return data;
  }

  async deleteJson<R = Record<string, any>>(
    pathname: ApiRoutes,
    options?: Options | undefined,
  ) {
    const response = await this.delete(pathname, options);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    const data = await response.json<BaseResponse<R>>();
    return data;
  }

  async deleteBody<R = Record<string, any>, Body = Record<string, any>>(
    pathname: ApiRoutes,
    body: Body,
    options?: Options | undefined,
  ) {
    const baseOptions = {
      ...(options || {}),
      json: body,
    } as Options;

    const response = await this.delete(pathname, baseOptions);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    const data = await response.json<BaseResponse<R>>();
    return data;
  }

  async putJson<R = Record<string, any>, Body = Record<string, any>>(
    pathname: ApiRoutes,
    body: Body,
    options?: Options | undefined,
  ) {
    const baseOptions = {
      ...(options || {}),
      json: body,
    } as Options;

    const response = await this.put(pathname, baseOptions);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    const data = await response.json<BaseResponse<R>>();
    return data;
  }

  async putFormData<R = Record<string, any>>(
    pathname: ApiRoutes,
    formData: FormData | HTMLFormElement,
    options?: Options | undefined,
  ) {
    const body =
      formData instanceof FormData ? formData : new FormData(formData);

    const baseOptions = {
      ...(options || {}),
      headers: {
        ...(options?.headers || {}),
        'Content-Type': 'multipart/form-data',
      },
      body,
    } as Options;

    const response = await this.put(pathname, baseOptions);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    const data = await response.json<BaseResponse<R>>();
    return data;
  }

  async putFormUrlEncoded<R = Record<string, any>>(
    pathname: ApiRoutes,
    body: Record<string, any>,
    options?: Options | undefined,
  ) {
    const baseOptions = {
      ...(options || {}),
      headers: {
        ...(options?.headers || {}),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(body),
    } as Options;

    const response = await this.put(pathname, baseOptions);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    const data = await response.json<BaseResponse<R>>();
    return data;
  }

  async patchJson<R = Record<string, any>, Body = Record<string, any>>(
    pathname: ApiRoutes,
    body: Body,
    options?: Options | undefined,
  ) {
    const baseOptions = {
      ...(options || {}),
      json: body,
    } as Options;

    const response = await this.patch(pathname, baseOptions);
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
    const data = await response.json<BaseResponse<R>>();
    return data;
  }
}

export const apiService = new ApiService();
