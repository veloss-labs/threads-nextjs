import { isNullOrUndefined } from '~/utils/assertion';

const resourceMap = new Map();

class Resource {
  private _error: Error | null;
  private _loader: (...args: unknown[]) => Promise<unknown>;
  private _promise: Promise<unknown> | null;
  private _result: unknown;

  constructor(loader: (...args: unknown[]) => Promise<unknown>) {
    this._error = null;
    this._loader = loader;
    this._promise = null;
    this._result = null;
  }

  load() {
    let promise = this._promise;
    if (isNullOrUndefined(promise)) {
      promise = this._loader()
        .then((result) => {
          // @ts-expect-error dynamic import modules
          if (result.default) {
            // @ts-expect-error dynamic import modules
            result = result.default;
          }
          this._result = result;
          return result;
        })
        .catch((error) => {
          this._error = error;
          throw error;
        });
      this._promise = promise;
    }
    return promise;
  }

  get() {
    if (!isNullOrUndefined(this._result)) {
      return this._result;
    }
  }

  read() {
    if (!isNullOrUndefined(this._result)) {
      return this._result;
    } else if (!isNullOrUndefined(this._error)) {
      throw this._error;
    } else {
      throw this._promise;
    }
  }
}

export function ResourceLoaderWithoutCache(
  loader: (...args: unknown[]) => Promise<unknown>,
) {
  return new Resource(loader);
}

export function ResourceLoaderWithCache(
  moduleId: string,
  loader: (...args: unknown[]) => Promise<unknown>,
) {
  let resource: Resource = resourceMap.get(moduleId);
  if (isNullOrUndefined(resource)) {
    resource = new Resource(loader);
    resourceMap.set(moduleId, resource);
  }
  return resource;
}
