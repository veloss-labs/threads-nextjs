export type ApiRoutes = URL | Request | string;

export type Nullable<T> = T | null;

export type NestedObject<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends Record<string, any> ? NestedObject<T[K]> : T[K];
};

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? // @ts-ignore
      `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type NestedObjectValueOf<
  T extends Record<string, any>,
  K extends NestedKeyOf<T>,
> = {
  [P in K]: P extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
      ? T[Key] extends Record<string, any>
        ? // @ts-ignore
          NestedObjectValueOf<T[Key], Rest>
        : never
      : never
    : P extends keyof T
    ? T[P]
    : never;
}[K];
