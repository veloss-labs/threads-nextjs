export type BaseThreadQuery = {
  limit?: number | string;
  pageNo?: number | string;
  cursor?: string;
};

export type ThreadQuery = BaseThreadQuery & {
  deleted?: boolean;
  userId?: string;
  hasParent?: boolean;
  hasRepost?: boolean;
};
