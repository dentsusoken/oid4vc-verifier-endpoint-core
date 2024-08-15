import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { PortsOutImpl } from './PortsOutImpl';
import { PortsInputImpl } from './PortsInputImpl';

import { MockConfiguration } from './MockConfiguration';

describe('PortsInputImpl', () => {
  const configuration = new MockConfiguration();
  const portsOut = new PortsOutImpl(configuration);
  const portsInput = new PortsInputImpl(configuration, portsOut);

  describe('initTransaction', () => {
    it('should return InitTransaction', () => {
      const initTransaction = portsInput.initTransaction();
      expect(typeof initTransaction).toBe('function');
    });
  });
});
