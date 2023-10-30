'use client';
import React from 'react';

export interface CreateContextOptions {
  /**
   * `true` => context 가 `null` or `undefined` 인경우 throw error
   * `false` => 중첩 컨텍스트를 지원하는 경우 사용
   */
  strict?: boolean;
  /**
   * 컨텍스트가 '정의되지 않음'인 경우 발생하는 오류 메시지
   */
  errorMessage?: string;
  /**
   * 컨텍스트의 표시 이름
   */
  name?: string;
  /**
   * 컨텍스트의 기본값
   */
  defaultValue?: any;
}

type CreateContextReturn<T> = [React.Provider<T>, () => T, React.Context<T>];

export function createContext<ContextType>(options: CreateContextOptions = {}) {
  const {
    strict = true,
    errorMessage = 'useContext: `context` is undefined. Seems you forgot to wrap component within the Provider',
    name,
    defaultValue = undefined,
  } = options;

  const Context = React.createContext<ContextType | undefined>(defaultValue);

  Context.displayName = name;

  function useContext() {
    const context = React.useContext(Context);

    if (!context && strict) {
      const error = new Error(errorMessage);
      error.name = 'ContextError';
      // @ts-ignore
      Error.captureStackTrace?.(error, useContext);
      throw error;
    }

    return context;
  }

  return [
    Context.Provider,
    useContext,
    Context,
  ] as CreateContextReturn<ContextType>;
}
