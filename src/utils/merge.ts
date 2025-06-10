import {removeNilValues} from './remove-nil';

export function mergeObjects<T, U>(first: T, second: U): Partial<T&U> {
  //@ts-ignore
  return  removeNilValues({ ...second, ...first });
}

// 简写形式
const merge = <T, U>(a: T, b: U): T & U => ({ ...b, ...a });