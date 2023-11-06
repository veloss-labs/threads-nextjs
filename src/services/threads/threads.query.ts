export type BaseThreadQuery = {
  limit?: number | string;
  pageNo?: number | string;
  cursor?: string;
};

export type ThreadQuery = BaseThreadQuery & {
  deleted?: boolean;
  userId?: string;
  type?: 'repost' | 'comment' | 'thread' | 'like';
};

export type SearchThreadQuery = BaseThreadQuery & {
  q?: string;
};
