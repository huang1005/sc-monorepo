import { set } from '../../';

describe('set', () => {
  it('set array is ok', () => {
    const obj = {};
    set(obj, 'a.0', { b: 'array' });
    expect(obj).toEqual({
      a: [{ b: 'array' }],
    });
  });

  it('set obj is ok', () => {
    const re = set({}, 'a.b.c.d', { e: 'array' });
    expect(re).toEqual({
      a: {
        b: {
          c: {
            d: {
              e: 'array',
            },
          },
        },
      },
    });
  });

  it('set obj has value is ok', () => {
    const obj = { a: [1], b: { c: { d: 'hello' } } };
    set(obj, 'a.1', 'hello');
    set(obj, 'b.c.d', '111');

    expect(obj).toEqual({
      a: [1, 'hello'],
      b: { c: { d: '111' } },
    });
  });

  it('undefined null is not allowed', () => {
    expect(set(undefined, '11', 11).message).toBe(
      'undefined null is not allowed'
    );
  });

  it('useType is ok', () => {
    const obj: any = {};
    set(obj, 'a.b.c', 11, 'array');
    obj.a.push('11');
    obj.a.b.push('22');
    expect(obj.a).toContain('11');
    expect(obj.a.b).toContain('22');
    set(obj, 'e.f.g', 22, 'object');
    expect(obj.e).toEqual({ f: { g: 22 } });
  });

  it('path length => 0 is ok', () => {
    const obj = {};
    expect(set(obj, '', 11)).toEqual(obj);
    expect(set(obj, [], 11)).toEqual(obj);
  });
});
