import { describe, it, expect } from 'vitest';
import { PresentationDefinition } from 'oid4vc-prex';
import { PresentationType, PresentationTypeNS } from './PresentationType';
import { IdTokenType } from '.';

describe('PresentationTypeNS', () => {
  const mockPresentationDefinition = {} as PresentationDefinition;
  const mockIdTokenTypes: IdTokenType[] = [IdTokenType.SubjectSigned];

  describe('IdTokenRequest', () => {
    it('should create an instance with correct properties', () => {
      const idTokenRequest = new PresentationTypeNS.IdTokenRequest(
        mockIdTokenTypes
      );
      expect(idTokenRequest.idTokenType).toEqual(mockIdTokenTypes);
    });
  });

  describe('VpTokenRequest', () => {
    it('should create an instance with correct properties', () => {
      const vpTokenRequest = new PresentationTypeNS.VpTokenRequest(
        mockPresentationDefinition
      );
      expect(vpTokenRequest.presentationDefinition).toBe(
        mockPresentationDefinition
      );
    });
  });

  describe('IdAndVpTokenRequest', () => {
    it('should create an instance with correct properties', () => {
      const idAndVpTokenRequest = new PresentationTypeNS.IdAndVpTokenRequest(
        mockIdTokenTypes,
        mockPresentationDefinition
      );
      expect(idAndVpTokenRequest.idTokenType).toEqual(mockIdTokenTypes);
      expect(idAndVpTokenRequest.presentationDefinition).toBe(
        mockPresentationDefinition
      );
    });
  });

  describe('Type guards', () => {
    it('isIdTokenRequest should return true for IdTokenRequest instances', () => {
      const idTokenRequest = new PresentationTypeNS.IdTokenRequest(
        mockIdTokenTypes
      );
      expect(PresentationTypeNS.isIdTokenRequest(idTokenRequest)).toBe(true);
      expect(PresentationTypeNS.isIdTokenRequest({} as PresentationType)).toBe(
        false
      );
    });

    it('isVpTokenRequest should return true for VpTokenRequest instances', () => {
      const vpTokenRequest = new PresentationTypeNS.VpTokenRequest(
        mockPresentationDefinition
      );
      expect(PresentationTypeNS.isVpTokenRequest(vpTokenRequest)).toBe(true);
      expect(PresentationTypeNS.isVpTokenRequest({} as PresentationType)).toBe(
        false
      );
    });

    it('isIdAndVpTokenRequest should return true for IdAndVpTokenRequest instances', () => {
      const idAndVpTokenRequest = new PresentationTypeNS.IdAndVpTokenRequest(
        mockIdTokenTypes,
        mockPresentationDefinition
      );
      expect(
        PresentationTypeNS.isIdAndVpTokenRequest(idAndVpTokenRequest)
      ).toBe(true);
      expect(
        PresentationTypeNS.isIdAndVpTokenRequest({} as PresentationType)
      ).toBe(false);
    });
  });
});
