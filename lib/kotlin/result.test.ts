import { describe, it, expect } from 'vitest';

import { Result, runCatching, runAsyncCatching } from './result';
//import { Result } from '../kotlin';

describe('Result', () => {
  it('when success', () => {
    const result = Result.success('aaa');

    expect(result.isSuccess).toBeTruthy;
    expect(result.isFailure).toBeFalsy;
    expect(result.getOrNull()).toEqual('aaa');
    expect(result.exceptionOrNull()).toBeNull();
  });

  it('when success is null', () => {
    const result = Result.success(null);

    expect(result.isSuccess).toBeTruthy;
    expect(result.isFailure).toBeFalsy;
    expect(result.getOrNull()).toBeNull();
    expect(result.exceptionOrNull()).toBeNull();
  });

  it('when failure', () => {
    const result = Result.failure(new Error('error'));

    expect(result.isSuccess).toBeFalsy;
    expect(result.isFailure).toBeTruthy;
    expect(result.getOrNull()).toBeNull();
    expect(result.exceptionOrNull()?.message).toEqual('error');
  });

  it('getOrThrow when success', () => {
    const result = Result.success('aaa');

    expect(result.getOrThrow()).toEqual('aaa');
  });

  it('getOrThrow when failure', () => {
    const result = Result.failure(new Error('error'));

    expect(() => result.getOrThrow()).toThrow('error');
  });

  it('getOrDefault when success', () => {
    const result = Result.success('aaa');

    expect(result.getOrDefault('bbb')).toEqual('aaa');
  });

  it('getOrDefault when failure', () => {
    const result = Result.failure(new Error('error'));

    expect(result.getOrDefault('bbb')).toEqual('bbb');
  });

  it('getOrElse when success', () => {
    const result = Result.success('aaa');

    expect(result.getOrElse(() => 'bbb')).toEqual('aaa');
  });

  it('getOrElse when failure', () => {
    const result = Result.failure(new Error('error'));

    expect(result.getOrElse((e) => e.message)).toEqual('error');
  });

  it('onSuccess when success', () => {
    const result = Result.success('aaa');
    let aaa = 'bbb';

    expect(result.onSuccess((v) => (aaa = v))).toBe(result);
    expect(aaa).toEqual('aaa');
  });

  it('onSuccess when failure', () => {
    const result = Result.failure(new Error('error'));
    let aaa = 'bbb';

    expect(result.onSuccess(() => (aaa = 'error'))).toBe(result);
    expect(aaa).toEqual('bbb');
  });

  it('onFailure when success', () => {
    const result = Result.success('aaa');
    let aaa = 'bbb';

    expect(result.onFailure(() => (aaa = 'error'))).toBe(result);
    expect(aaa).toEqual('bbb');
  });

  it('onFailure when failure', () => {
    const result = Result.failure(new Error('error'));
    let aaa = 'bbb';

    expect(result.onFailure((e) => (aaa = e.message))).toBe(result);
    expect(aaa).toEqual('error');
  });

  it('fold when success', () => {
    const result = Result.success('aaa');

    expect(
      result.fold(
        () => 'success',
        () => 'error'
      )
    ).toEqual('success');
  });

  it('fold when failure', () => {
    const result = Result.failure(new Error('error'));

    expect(
      result.fold(
        () => 'success',
        () => 'error'
      )
    ).toEqual('error');
  });

  it('map when success', () => {
    const result = Result.success('aaa');

    expect(result.map((v) => v.length).getOrNull()).toEqual(3);
  });

  it('map when failure', () => {
    const result = Result.failure(new Error('error'));

    expect(result.map(() => 3).exceptionOrNull()?.message).toEqual('error');
  });

  it('map.translate throw error when success', () => {
    const result = Result.success('aaa');

    expect(() =>
      result.map(() => {
        throw new Error('error');
      })
    ).toThrow('error');
  });

  it('mapCatching when success', () => {
    const result = Result.success('aaa');

    expect(result.mapCatching((v) => v.length).getOrNull()).toEqual(3);
  });

  it('mapCatching when failure', () => {
    const result = Result.failure(new Error('error'));

    expect(result.mapCatching(() => 3).exceptionOrNull()?.message).toEqual(
      'error'
    );
  });

  it('mapCatching.translate throw error when success', () => {
    const result = Result.success('aaa');

    expect(
      result
        .mapCatching(() => {
          throw new Error('error');
        })
        .exceptionOrNull()?.message
    ).toEqual('error');
  });

  it('recover when success', () => {
    const result = Result.success('aaa');

    expect(result.recover((e) => e.message).getOrNull()).toEqual('aaa');
  });

  it('recover when failure', () => {
    const result = Result.failure(new Error('error'));

    expect(result.recover((e) => e.message).getOrNull()).toEqual('error');
  });

  it('recover.translate throws error when failure', () => {
    const result = Result.failure(new Error('error'));

    expect(() =>
      result.recover(() => {
        throw new Error('error2');
      })
    ).toThrow('error2');
  });

  it('recoverCatching when success', () => {
    const result = Result.success('aaa');

    expect(result.recoverCatching((e) => e.message).getOrNull()).toEqual('aaa');
  });

  it('recoverCatching when failure', () => {
    const result = Result.failure(new Error('error'));

    expect(result.recoverCatching((e) => e.message).getOrNull()).toEqual(
      'error'
    );
  });

  it('recoverCatching.translate throws error when failure', () => {
    const result = Result.failure(new Error('error'));

    expect(
      result
        .recoverCatching(() => {
          throw new Error('error2');
        })
        .exceptionOrNull()?.message
    ).toEqual('error2');
  });

  it('runCatching when success', () => {
    const result = runCatching(() => 1);

    expect(result.getOrNull()).toEqual(1);
  });

  it('runCatching when failure', () => {
    const result = runCatching(() => {
      throw new Error('error');
    });

    expect(result.exceptionOrNull()?.message).toEqual('error');
  });

  it('runCatching when success with args', () => {
    const result = runCatching((a: number, b: number) => a + b, 1, 2);

    expect(result.getOrNull()).toEqual(3);
  });

  it('runAsyncCatching when success', async () => {
    const result = await runAsyncCatching(async () => 1);

    expect(result.getOrNull()).toEqual(1);
  });

  it('runAsyncCatching when failure', async () => {
    const result = await runAsyncCatching(async () => {
      throw new Error('error');
    });

    expect(result.exceptionOrNull()?.message).toEqual('error');
  });

  it('runAsyncCatching when success with args', async () => {
    const result = await runAsyncCatching(async (a, b) => a + b, 1, 2);

    expect(result.getOrNull()).toEqual(3);
  });
});
