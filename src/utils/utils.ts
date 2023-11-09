import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  uniqueUsernameGenerator,
  nouns,
  adjectives,
  type Config,
} from 'unique-username-generator';
import { isEmpty, isNull, isUndefined } from '~/utils/assertion';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function optimizeAnimation(callback: () => void) {
  let ticking = false;

  return () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
    }
  };
}

export const generatorName = (seed: string) => {
  const marvelCharacters = [seed];

  const config: Config = {
    dictionaries: [adjectives, nouns, marvelCharacters],
    separator: '_',
    style: 'capital',
    randomDigits: 3,
  };

  const username: string = uniqueUsernameGenerator(config); // Hulk12
  return username;
};

export const createSearchParams = (params?: Record<string, any>) => {
  const searchParams = new URLSearchParams();
  if (!params || isEmpty(params)) return searchParams;

  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined || params[key] !== null) {
      if (Array.isArray(params[key])) {
        searchParams.append(key, params[key].join(','));
      } else {
        if (isUndefined(params[key]) || isNull(params[key])) return;
        const hasToString = Object.prototype.hasOwnProperty.call(
          params[key],
          'toString',
        );
        if (hasToString) {
          searchParams.append(key, params[key].toString());
        } else {
          searchParams.append(key, params[key]);
        }
      }
    }
  });

  return searchParams;
};

export const getDateFormatted = (date: Date | string) => {
  // ** 시간전 표시 (Intl) 방식으로
  // 현재 시간 기준으로 얼마나 지났는지 표시
  // 24시간 이내는 시간, 24시간 이후는 날짜 표시
  // 1분 이내는 방금 전 표시
  // 1시간 이내는 n분 전 표시
  // 24시간 이내는 n시간 전 표시
  // 24시간 이후는 날짜 표시
  const now = new Date();
  const diff =
    now.getTime() -
    (date instanceof Date ? date.getTime() : new Date(date).getTime());
  const diffSeconds = Math.floor(diff / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);

  if (diffSeconds < 60) {
    return '방금 전';
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  if (diffDays < 30) {
    return `${diffDays}일 전`;
  }

  if (diffMonths < 12) {
    return `${diffMonths}달 전`;
  }

  return `${diffYears}년 전`;
};
