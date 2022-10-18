import { SetupAxios } from '../..';

describe('get', () => {
  const inter = SetupAxios.interParam;
  const urlIn = 'findCallData/{prodId}/hello/{interfaceId}';

  it('interParam is ok', () => {
    const { url, data } = inter(urlIn, {
      prodId: 'abc',
      interfaceId: 22,
      param_1: 1,
      param_2: 2,
    });
    expect(url).toBe('findCallData/abc/hello/22');
    expect(data).toEqual({
      param_1: 1,
      param_2: 2,
    });
  });

  it('interParam reverse param is ok', () => {
    const { url, data } = inter(
      urlIn,
      {
        prodId: 'abc',
        interfaceId: 22,
        param_1: 1,
        param_2: 2,
      },
      true
    );
    expect(url).toBe('findCallData/abc/hello/22');
    expect(data).toEqual({
      interfaceId: 22,
      prodId: 'abc',
      param_1: 1,
      param_2: 2,
    });
  });
});
