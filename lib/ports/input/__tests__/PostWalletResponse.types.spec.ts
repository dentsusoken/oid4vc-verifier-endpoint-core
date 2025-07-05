import { describe, it, expect } from 'vitest';
import {
  walletResponseAcceptedSchema,
  WalletResponseAcceptedTO,
} from '../PostWalletResponse.types';
import { ZodError } from 'zod';

describe('WalletResponseAcceptedTO', () => {
  describe('instanceToPlain', () => {
    it('should transform instance to plain object with redirect_uri', () => {
      const instance = new WalletResponseAcceptedTO(
        'https://example.com/callback'
      );
      const plain = instance.toJSON();

      expect(plain).toEqual({
        redirect_uri: 'https://example.com/callback',
      });
    });

    it('should transform instance to empty object when redirectUri is undefined', () => {
      const instance = new WalletResponseAcceptedTO();
      const plain = instance.toJSON();

      expect(plain).toEqual({});
    });
  });

  describe('plainToInstance', () => {
    it('should transform plain object to instance with redirectUri', () => {
      const plain = { redirect_uri: 'https://example.com/callback' };
      const instance = WalletResponseAcceptedTO.fromJSON(plain);

      expect(instance).toBeInstanceOf(WalletResponseAcceptedTO);
      expect(instance.redirectUri).toBe('https://example.com/callback');
    });

    it('should transform plain object to instance with undefined redirectUri when not provided', () => {
      const plain = {};
      const instance = WalletResponseAcceptedTO.fromJSON(plain);

      expect(instance).toBeInstanceOf(WalletResponseAcceptedTO);
      expect(instance.redirectUri).toBeUndefined();
    });
  });

  describe('constructor', () => {
    it('should create instance with provided redirectUri', () => {
      const instance = new WalletResponseAcceptedTO(
        'https://example.com/callback'
      );
      expect(instance.redirectUri).toBe('https://example.com/callback');
    });

    it('should create instance with undefined redirectUri when not provided', () => {
      const instance = new WalletResponseAcceptedTO();
      expect(instance.redirectUri).toBeUndefined();
    });
  });

  describe('schema', () => {
    it('should create schema with provided redirectUri', () => {
      const schema = walletResponseAcceptedSchema.parse({
        redirect_uri: 'https://example.com/callback',
      });
      expect(schema.redirect_uri).toBe('https://example.com/callback');
    });

    it('should create schema with undefined redirectUri when not provided', () => {
      expect(() => walletResponseAcceptedSchema.parse(undefined)).toThrow(
        ZodError
      );
    });
  });
});
