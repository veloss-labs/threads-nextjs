export type BaseThreadQuery = {
  limit?: number | string;
  pageNo?: number | string;
  cursor?: string;
};

export type ThreadQuery = BaseThreadQuery & {
  type?: 'page' | 'cursor';
};
