import { describe, it, expect } from 'vitest';

import { randomBase64URL, randomUint8Array } from '../randomUtils';

describe('randomUtils', () => {
  it('randomUint8Array', async () => {
    const value = randomUint8Array();
    expect(value).toBeInstanceOf(Uint8Array);
    expect(value.length).toEqual(32);
  });

  it('randomBase64URL', async () => {
    const value = randomBase64URL();
    expect(value).toMatch(/^[A-Za-z0-9_-]{43}$/);
  });
});
