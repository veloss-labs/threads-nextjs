export type Nullable<T> = T | null;

export type Body = BodyInit | Record<string, any> | null | undefined;

export type Flag = {
  v1?: boolean;
};

export type ApiRoutes = URL | RequestInfo;

export type ApiCustomOptions = {
  flag?: Flag;
  withAuthorization?: boolean;
};

export type ApiOptions = {
  requestInit?: RequestInit;
  request?: Request;
  customOptions?: ApiCustomOptions;
};
