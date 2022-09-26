import { isObject, isEmptyObject } from '../../';

describe('type asserts', () => {
  it('isObject is ok', () => {
    expect(isObject({})).toBeTruthy();
    expect(isObject([])).toBeFalsy();
    expect(isObject(new Object())).toBeTruthy();
  });

  it('isEmptyObject is ok', () => {
    expect(isEmptyObject({})).toBeTruthy();
    expect(isEmptyObject({ a: 1 })).toBeFalsy();
    expect(isEmptyObject([111])).toBeFalsy();
  });
});
