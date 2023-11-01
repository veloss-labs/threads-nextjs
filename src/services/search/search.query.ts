export type BaseSearchQuery = {
  limit?: number | string;
  pageNo?: number | string;
  cursor?: string;
  q?: string;
};

export type SearchQuery = BaseSearchQuery;
