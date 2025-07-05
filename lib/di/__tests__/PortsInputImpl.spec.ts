import { describe, it, expect } from 'vitest';
import { PortsOutImpl } from '../PortsOutImpl';
import { PortsInputImpl } from '../PortsInputImpl';

import { MockConfiguration } from '../MockConfiguration';

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

  describe('getRequestObject', () => {
    it('should return GetRequestObject', () => {
      const getRequestObject = portsInput.getRequestObject();
      expect(typeof getRequestObject).toBe('function');
    });
  });

  describe('postWalletResponse', () => {
    it('should return PostWalletResponse', () => {
      const postWalletResponse = portsInput.postWalletResponse();
      expect(typeof postWalletResponse).toBe('function');
    });
  });

  describe('getWalletResponse', () => {
    it('should return GetWalletResponse', () => {
      const getWalletResponse = portsInput.getWalletResponse();
      expect(typeof getWalletResponse).toBe('function');
    });
  });
});
