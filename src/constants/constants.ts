export const QUERIES_KEY = {
  threads: {
    root: ['threads'],
    owners: (id: string) => ['threads', 'owner', id],
    comments: (id: string) => ['threads', 'comment', id],
    reposts: (id: string) => ['threads', 'reposts', id],
    likes: {
      root: ['threads-likes'],
    },
  },
  users: {
    root: ['users'],
    search: (keyword?: string) => {
      const keys = ['users', 'search'];
      if (keyword) {
        keys.push(keyword);
      }
      return keys;
    },
  },
};

export const MUTATIONS_KEY = {};

export const API_ENDPOINTS = {
  avatar: (searchParams: URLSearchParams, styles = 'notionists') => {
    const url = new URL(`/7.x/${styles}/jpg`, 'https://api.dicebear.com');
    for (const [key, value] of searchParams.entries()) {
      url.searchParams.append(key, value);
    }
    return url.href;
  },
};

export const ASSET_URL = {};

export const PAGE_ENDPOINTS = {
  ROOT: '/',
  FOLLOWING: '/following',
  AUTH: {
    SIGNIN: '/signin',
    SIGNUP: '/signup',
  },
  MY_PAGE: {
    ID: (id: string) => `/profile/${id}`,
  },
  THREADS: {
    ROOT: '/threads',
    LIKES: '/threads/likes',
  },
} as const;

export const SITE_CONFIG = {
  title: 'Threads',
  keywords: [],
  description:
    'Instagram의 새로운 텍스트 앱, Threads에서 더 많은 대화를 나누어보세요',
  ogImage: '/og/seo.png',
  favicon: '/favicon.ico',
  apple57x57: '/icons/icon_57x57.png',
  apple180x180: '/icons/icon_180x180.png',
  apple256x256: '/icons/icon_256x256.png',
  manifest: '/manifest.json',
};

export const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOED: 405,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,

  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
} as const;

export const RESULT_CODE = {
  // 성공
  OK: 1,
  // 실패
  FAIL: 0,
  // 잘못된 패스워드
  INCORRECT_PASSWORD: 4004,
  // 존재하지 않음
  NOT_EXIST: 2001,
  // 삭제됨
  DELETED: 2002,
  // 이미 존재함
  ALREADY_EXIST: 2003,
  // 유효하지 않음
  INVALID: 2004,
  // 만료된 토큰
  TOKEN_EXPIRED: 4001,
  // 로그인 할 수 없음
  CANNOT_BE_LOGIN: 5000,
  // 로그인이 필요함
  LOGIN_REQUIRED: 5001,
} as const;

export const URL_STATE_KEY = {
  modal: 'modalType',
  sheet: 'sheetType',
};

export const MODAL_TYPE = {
  thread: 'thread',
};

export const SHEET_TYPE = {
  menu: 'menu',
};
