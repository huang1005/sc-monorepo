import { get, isFunction } from '../..';

describe('get', () => {
  const obj = {
    a: {
      b: {
        c: 'hello',
      },
    },
    c: null,
  };

  const arr = [obj];

  it('isFunction is ok', () => {
    expect(isFunction(() => ({}))).toBe(true);
  });

  it('source null or undefined get alterValue', () => {
    const re = get(null, [], 'wrong');
    const re2 = get(undefined, [], 'wrong');
    expect(re).toBe('wrong');
    expect(re2).toBe('wrong');
  });

  it('pass Array normal is ok', () => {
    const re = get(obj, ['a', 'b', 'c'], 'wrong');
    expect(re).toBe('hello');
  });

  it('in arr index is ok', () => {
    const re = get(arr, '0.a.b.c', false);
    expect(re).toBe('hello');
  });

  it('in arr flat is ok', () => {
    const re = get(arr, [0, 'a.b.c'], false);
    expect(re).toBe('hello');
  });

  it('in arr alter ok', () => {
    const re = get(arr, [0, 'a.c.e.fg', 'hello'], 'guagua');
    expect(re).toBe('guagua');
  });

  it('get nest is ok', () => {
    const re = get(obj, 'a.b.c', 'wrong');
    expect(re).toBe('hello');
  });

  it('get null is ok', () => {
    const re = get(obj, 'c', 'wrong');
    expect(re).toBe('wrong');
  });

  it('get undefined is ok', () => {
    const re = get(obj, 'c.d.e.f', 'alter');
    expect(re).toBe('alter');
  });

  it('pass judgeFn is ok', () => {
    const re = get(obj, 'a.b.c', 'alter_judge', inRe => {
      return inRe.c === 'hello';
    });
    expect(re).toBe('alter_judge');
  });

  it('get arr is ok', () => {
    const arr = [11, 22];
    const re = get(arr, [1]);
    expect(re).toBe(22);
  });

  it('get empty path is ok', () => {
    const arr = [11, 22];
    const re = get(arr, '');
    expect(re).toEqual([11, 22]);
  });

  it('get undefined path is ok', () => {
    const obj = {};
    let emptyPath;
    const re = get(obj, `a.${emptyPath}.c`, 'hello');
    expect(re).toBe('hello');
  });

  it('source and alterValue are undefined is ok', () => {
    let obj;
    get(obj, `a.c`);
  });
});
