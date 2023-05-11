import { z } from 'zod';
import { STATUS_CODE } from '~/constants/constants';
import { HTTPError } from '../client';

/**
 * Signin error wrapper
 * @version 1.0.0
 * @description 태그 팔로우시 사용되는 스키마의 에러를 처리합니다.
 * @param {unknown} error
 */
export const ValidationErrorWrapper = (error: unknown) => {
  if (error instanceof z.ZodError) {
    const errors: Record<string, string> = {};
    error.issues.reduce((acc, cur) => {
      const key = cur.path.at(0);
      if (!key) return acc;
      acc[key] = cur.message;
      return acc;
    }, errors);
    return {
      statusCode: STATUS_CODE.BAD_REQUEST,
      errors,
    };
  }
  return null;
};

/**
 * Signin error wrapper
 * @version 1.0.0
 * @description 태그 팔로우시 사용되는 HTTP 에러를 처리합니다.
 * @param {unknown} error
 */
export const HTTPErrorWrapper = async (error: unknown) => {
  if (error instanceof HTTPError) {
    const resp = error.response;
    const data = await resp.json();
    const checkStatusCode = [
      STATUS_CODE.BAD_REQUEST,
      STATUS_CODE.NOT_FOUND,
    ] as number[];

    if (checkStatusCode.includes(resp.status)) {
      return {
        statusCode: resp.status,
        errors: data.error,
      };
    } else {
      return {
        statusCode: resp.status,
        errors: '알 수 없는 에러가 발생했습니다.',
      };
    }
  }
  return null;
};
