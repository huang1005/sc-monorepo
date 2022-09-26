import { getParam } from '../../';

interface param {
  a: string;
  b: string;
  c: string;
  d: string;
}

describe('table getParam', () => {
  it('static param and forceFlag is ok', async () => {
    const { valid, param } = await getParam([
      {
        a: 'hello',
      },
    ]);
    expect(valid).toBeTruthy();
    expect(param).toEqual({
      a: 'hello',
    });

    // remove $$force param because I think this is a unuse flag
    // if you want to pass 'fetch async calls' you can pass object contains that by fetch

    // const { valid: validForce, param: paramForce } = await getParam([
    //   {
    //     a: 'hello',
    //     fetch: 'helo',
    //     async: true,
    //     $$force: true,
    //   },
    // ]);
    // expect(validForce).toBeTruthy();
    // expect(paramForce).toEqual({
    //   a: 'hello',
    //   fetch: 'helo',
    //   async: true,
    // });

    // // forceFlag
    // const { valid: validForceParam, param: paramForceParam } = await getParam(
    //   [
    //     {
    //       a: 'hello',
    //       fetch: 'helo',
    //       async: true,
    //       $$force: true,
    //     },
    //   ],
    //   undefined // before
    // );
    // expect(validForceParam).toBeTruthy();
    // expect(paramForceParam).toEqual({
    //   a: 'hello',
    //   fetch: 'helo',
    //   async: true,
    // });
  });

  it('async param is ok', async () => {
    const { valid, param } = await getParam([
      {
        async: true,
        fetch: () =>
          new Promise(res => {
            setTimeout(() => {
              res({
                a: 'hello',
              });
            }, 1000);
          }),
      },
    ]);
    expect(valid).toBeTruthy();
    expect(param).toEqual({
      a: 'hello',
    });
  });

  it('fetch is normal function is ok', async () => {
    const { valid, param } = await getParam([
      {
        fetch: () => ({
          a: 'hello',
        }),
      },
    ]);
    expect(valid).toBeTruthy();
    expect(param).toEqual({
      a: 'hello',
    });
  });

  it('fetch is object is ok', async () => {
    const { valid, param } = await getParam([
      {
        fetch: {
          a: 'hello',
        },
      },
    ]);
    expect(valid).toBeTruthy();
    expect(param).toEqual({
      a: 'hello',
    });
  });

  it('calls is ok', async () => {
    const calls = vi.fn((data, dataAll) => {
      expect(data.a === 'hello').toBeTruthy();
      expect(data.b).toBeUndefined();
      expect(dataAll.b === 'work').toBeTruthy();
      return false;
    });
    const { valid, param } = await getParam<param>([
      {
        b: 'work',
      },
      {
        fetch: {
          a: 'hello',
        },
        calls,
      },
    ]);
    expect(calls.mock.calls.length).toBe(1);
    expect(valid).toBeFalsy();
    expect(param).toEqual({
      a: 'hello',
      b: 'work',
    });

    // 异步校验
    const callsPromise = vi.fn(() => {
      return new Promise<boolean>(res => {
        setTimeout(() => {
          res(true);
        }, 400);
      });
    });

    const { valid: validP, param: paramP } = await getParam<param>([
      {
        fetch: {
          a: 'hello',
        },
        calls: callsPromise,
      },
    ]);

    expect(callsPromise.mock.calls.length).toBe(1);
    expect(validP).toBeTruthy();
    expect(paramP).toEqual({
      a: 'hello',
    });
  });

  it('before param is ok', async () => {
    const beforeFn = vi.fn(data => {
      return data;
    });
    const { valid, param } = await getParam<param>(
      [
        {
          a: 'hello',
        },
        {
          fetch: () => ({ b: 'hello b' }),
        },
        {
          async: true,
          fetch: () => {
            return new Promise(res => {
              setTimeout(() => {
                res({
                  c: 'hello c',
                });
              }, 1000);
            });
          },
        },
        () => ({ d: 'hello d' }),
      ],
      beforeFn
    );
    expect(valid).toBeTruthy();
    // calls add before Handle
    expect(beforeFn.mock.calls.length).toBe(5);
    expect(param).toEqual([
      {
        a: 'hello',
      },
      { b: 'hello b' },
      { c: 'hello c' },
      { d: 'hello d' },
    ]);
  });

  it('pass undefined is ok', async () => {
    const { valid, param } = await getParam([undefined]);
    expect(valid).toBe(false);
    expect(param).toEqual({});
  });

  it('pass null is ok', async () => {
    const { valid, param } = await getParam([null]);
    expect(valid).toBe(false);
    expect(param).toEqual({});
  });
});
