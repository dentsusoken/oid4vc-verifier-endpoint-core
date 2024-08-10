import { describe, it, expect } from 'vitest';

import { assert } from './assert';
//import { assert } from '../kotlin';

describe('assert', () => {
  it('do nothing when condition is true', () => {
    assert(1 == 1, 'error');
  });

  it('throw error when condition is false', () => {
    expect(() => assert(1 != 1, 'error')).toThrow('error');
  });
});
