import { isUndef, isFunction, isObject } from './typeAssert';

type TransMap<T, K extends keyof T> = Record<
  K,
  {
    alterVal: ((val: T[K]) => T[K]) | T[K];
    when?: (val: T[K]) => boolean;
  }
>;

export function transAttr<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  maps: TransMap<T, K>
): T {
  if (!isObject(obj)) return obj;

  for (const [key, val] of Object.entries(maps)) {
    const { alterVal, when = _ => isUndef(_) } = val as any;
    if (when(obj[key])) {
      obj[key as keyof T] = isFunction(alterVal)
        ? alterVal(obj[key])
        : alterVal;
    }
  }

  return obj;
}
