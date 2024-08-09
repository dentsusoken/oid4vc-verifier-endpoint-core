import { describe, it, expect } from 'vitest';
import {
  getScope,
  getIdTokenType,
  getResponseType,
  getAud,
  getClientIdSchemeName,
  getPresentationDefinition,
  getPresentationDefinitionUri,
  getResponseMode,
} from './RequestObject.convert';
import {
  PresentationTypeNS,
  IdTokenType,
  EmbedOptionNS,
  ResponseModeOption,
  RequestId,
  ClientIdScheme,
  SigningConfig,
} from '../../../domain';
import { PresentationDefinition } from 'oid4vc-prex';

describe('Presentation Type Utilities', () => {
  const mockPresentationDefinition = {} as PresentationDefinition;

  describe('getScope', () => {
    it('should return ["openid"] for IdTokenRequest', () => {
      const type = new PresentationTypeNS.IdTokenRequest([
        IdTokenType.SubjectSigned,
      ]);
      expect(getScope(type)).toEqual(['openid']);
    });

    it('should return ["openid"] for IdAndVpTokenRequest', () => {
      const type = new PresentationTypeNS.IdAndVpTokenRequest(
        [IdTokenType.SubjectSigned],
        mockPresentationDefinition
      );
      expect(getScope(type)).toEqual(['openid']);
    });

    it('should return an empty array for VpTokenRequest', () => {
      const type = new PresentationTypeNS.VpTokenRequest(
        mockPresentationDefinition
      );
      expect(getScope(type)).toEqual([]);
    });
  });

  describe('getIdTokenType', () => {
    it('should return correct array for IdTokenRequest', () => {
      const type = new PresentationTypeNS.IdTokenRequest([
        IdTokenType.AttesterSigned,
        IdTokenType.SubjectSigned,
      ]);
      expect(getIdTokenType(type)).toEqual([
        'attester_signed_id_token',
        'subject_signed_id_token',
      ]);
    });

    it('should return correct array for IdAndVpTokenRequest', () => {
      const type = new PresentationTypeNS.IdAndVpTokenRequest(
        [IdTokenType.AttesterSigned],
        mockPresentationDefinition
      );
      expect(getIdTokenType(type)).toEqual(['attester_signed_id_token']);
    });

    it('should return an empty array for VpTokenRequest', () => {
      const type = new PresentationTypeNS.VpTokenRequest(
        mockPresentationDefinition
      );
      expect(getIdTokenType(type)).toEqual([]);
    });
  });

  describe('getResponseType', () => {
    it('should return ["id_token"] for IdTokenRequest', () => {
      const type = new PresentationTypeNS.IdTokenRequest([
        IdTokenType.SubjectSigned,
      ]);
      expect(getResponseType(type)).toEqual(['id_token']);
    });

    it('should return ["vp_token"] for VpTokenRequest', () => {
      const type = new PresentationTypeNS.VpTokenRequest(
        mockPresentationDefinition
      );
      expect(getResponseType(type)).toEqual(['vp_token']);
    });

    it('should return ["vp_token", "id_token"] for IdAndVpTokenRequest', () => {
      const type = new PresentationTypeNS.IdAndVpTokenRequest(
        [IdTokenType.SubjectSigned],
        mockPresentationDefinition
      );
      expect(getResponseType(type)).toEqual(['vp_token', 'id_token']);
    });
  });

  describe('getAud', () => {
    it('should return an empty array for IdTokenRequest', () => {
      const type = new PresentationTypeNS.IdTokenRequest([
        IdTokenType.SubjectSigned,
      ]);
      expect(getAud(type)).toEqual([]);
    });

    it('should return ["https://self-issued.me/v2"] for VpTokenRequest', () => {
      const type = new PresentationTypeNS.VpTokenRequest(
        mockPresentationDefinition
      );
      expect(getAud(type)).toEqual(['https://self-issued.me/v2']);
    });

    it('should return ["https://self-issued.me/v2"] for IdAndVpTokenRequest', () => {
      const type = new PresentationTypeNS.IdAndVpTokenRequest(
        [IdTokenType.SubjectSigned],
        mockPresentationDefinition
      );
      expect(getAud(type)).toEqual(['https://self-issued.me/v2']);
    });
  });

  describe('getClientIdScheme', () => {
    it('should return "pre-registered" for PreRegistered scheme', () => {
      const preRegisteredScheme = new ClientIdScheme.PreRegistered(
        'client_id',
        {} as SigningConfig
      );
      expect(getClientIdSchemeName(preRegisteredScheme)).toBe('pre-registered');
    });

    it('should return "x509_san_dns" for X509SanDns scheme', () => {
      const x509SanDnsScheme = new ClientIdScheme.X509SanDns(
        'client_id',
        {} as SigningConfig
      );
      expect(getClientIdSchemeName(x509SanDnsScheme)).toBe('x509_san_dns');
    });

    it('should return "x509_san_uri" for X509SanUri scheme', () => {
      const x509SanUriScheme = new ClientIdScheme.X509SanUri(
        'client_id',
        {} as SigningConfig
      );
      expect(getClientIdSchemeName(x509SanUriScheme)).toBe('x509_san_uri');
    });
  });

  describe('getPresentationDefinition', () => {
    const mockPresentationDefinition = {} as PresentationDefinition;

    it('should return undefined when presentationDefinitionMode is undefined', () => {
      const type = new PresentationTypeNS.VpTokenRequest(
        mockPresentationDefinition
      );
      expect(getPresentationDefinition(undefined, type)).toBeUndefined();
    });

    it('should return presentationDefinition for VpTokenRequest when mode is ByValue', () => {
      const type = new PresentationTypeNS.VpTokenRequest(
        mockPresentationDefinition
      );
      const mode = new EmbedOptionNS.ByValue();
      expect(getPresentationDefinition(mode, type)).toBe(
        mockPresentationDefinition
      );
    });

    it('should return presentationDefinition for IdAndVpTokenRequest when mode is ByValue', () => {
      const type = new PresentationTypeNS.IdAndVpTokenRequest(
        [],
        mockPresentationDefinition
      );
      const mode = new EmbedOptionNS.ByValue();
      expect(getPresentationDefinition(mode, type)).toBe(
        mockPresentationDefinition
      );
    });

    it('should return undefined for IdTokenRequest when mode is ByValue', () => {
      const type = new PresentationTypeNS.IdTokenRequest([]);
      const mode = undefined;
      expect(getPresentationDefinition(mode, type)).toBeUndefined();
    });

    it('should return undefined when mode is ByReference', () => {
      const type = new PresentationTypeNS.VpTokenRequest(
        mockPresentationDefinition
      );
      const mode = new EmbedOptionNS.ByReference(
        () => new URL('https://example.com')
      );
      expect(getPresentationDefinition(mode, type)).toBeUndefined();
    });
  });

  describe('getPresentationDefinitionUri', () => {
    const mockRequestId = new RequestId('test-request-id');

    it('should return undefined when presentationDefinitionMode is undefined', () => {
      expect(
        getPresentationDefinitionUri(undefined, mockRequestId)
      ).toBeUndefined();
    });

    it('should return URL when mode is ByReference', () => {
      const mockUrl = new URL('https://example.com');
      const mode = new EmbedOptionNS.ByReference(() => mockUrl);
      expect(getPresentationDefinitionUri(mode, mockRequestId)).toBe(mockUrl);
    });

    it('should return undefined when mode is ByValue', () => {
      const mode = new EmbedOptionNS.ByValue();
      expect(getPresentationDefinitionUri(mode, mockRequestId)).toBeUndefined();
    });
  });

  describe('getResponseMode', () => {
    it('should return "direct_post" for DirectPost mode', () => {
      expect(getResponseMode(ResponseModeOption.DirectPost)).toBe(
        'direct_post'
      );
    });

    it('should return "direct_post.jwt" for DirectPostJwt mode', () => {
      expect(getResponseMode(ResponseModeOption.DirectPostJwt)).toBe(
        'direct_post.jwt'
      );
    });
  });
});
