import { isEmpty, isUndefined } from '~/utils/assertion';
import type { NestedKeyOf } from '~/ts/common';

export const getNestedKeyOfValue = <T extends object>(
  path: NestedKeyOf<T>,
  object: T,
) => {
  const paths = path.split(/[,[\].]+?/).filter(Boolean);

  // array paths find message object get value
  const result = paths.reduce((acc, cur) => {
    if (isEmpty(cur)) {
      return acc;
    }
    if (isUndefined(acc)) {
      return acc;
    }
    // eslint-disable-next-line @typescript-eslint/ban-types
    return acc[cur as keyof {}];
  }, object);

  //   Gets the value of the key that matches the nested key.
  type NestedKeyMatchValue<T, U> = U extends object
    ? {
        [Key in keyof U & (string | number)]: U[Key] extends object
          ? NestedKeyMatchValue<T, U[Key]>
          : Key extends keyof T
          ? U[Key]
          : never;
      }[keyof U & (string | number)]
    : never;

  return result as NestedKeyMatchValue<T, T>;
};
