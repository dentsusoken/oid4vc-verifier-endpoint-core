import { describe, it, expect } from 'vitest';
import { MockConfiguration } from './MockConfiguration';
import { ClientIdSchemeName } from './Configuration';
import {
  ClientMetaData,
  EmbedOption,
  RequestId,
  ResponseModeOption,
  VerifierConfig,
  UrlBuilder,
} from '../domain';
import { DurationLuxon } from '../adapters/out/cfg';

describe('MockConfiguration', () => {
  const configuration = new MockConfiguration();

  it('should return the correct transaction ID byte length', () => {
    expect(configuration.transactionIdByteLength()).toBe(64);
  });

  it('should return the correct request ID byte length', () => {
    expect(configuration.requestIdByteLength()).toBe(64);
  });

  it('should return a function that returns the current date', () => {
    const now = configuration.now();
    expect(typeof now).toBe('function');
    expect(now()).toBeInstanceOf(Date);
  });

  it('should return the correct signing config', () => {
    const signingConfig = configuration.jarSigning();
    expect(signingConfig.algorithm).toEqual('ES256');
    const jwk = JSON.parse(signingConfig.staticSigningPrivateJwk.value);
    expect(jwk.alg).toBe('ES256');
  });

  it('should throw an error if alg is not found in jarSigningPrivateJwk', () => {
    class InvalidConfiguration extends MockConfiguration {
      jarSigningPrivateJwk = (): string => {
        return JSON.stringify({
          kty: 'RSA',
          // ... other JWK properties, but missing alg
        });
      };
    }

    const invalidConfiguration = new InvalidConfiguration();
    expect(() => invalidConfiguration.jarSigning()).toThrowError(
      'alg not found in jarSigningPrivateJwk'
    );
  });

  it('should validate jarSigningPrivateJwk', async () => {
    class InvalidConfiguration extends MockConfiguration {
      jarSigningPrivateJwk = (): string => {
        return JSON.stringify({
          kty: 'RSA',
          // ... other JWK properties, but missing alg
        });
      };
    }
    const invalidConfiguration = new InvalidConfiguration();
    await expect(invalidConfiguration.validate()).rejects.toThrow();
  });

  describe('clientIdScheme', () => {
    it('should return PreRegistered ClientIdScheme when clientIdSchemeName is "pre-registered"', () => {
      class PreRegisteredConfiguration extends MockConfiguration {
        clientIdSchemeName = (): ClientIdSchemeName => 'pre-registered';
      }
      const preRegisteredConfiguration = new PreRegisteredConfiguration();

      const clientIdScheme = preRegisteredConfiguration.clientIdScheme();
      expect(clientIdScheme.__type === 'PreRegistered').toBe(true);
      expect(clientIdScheme.clientId).toBe('Verifier');
      expect(clientIdScheme.jarSigning).toBe(
        preRegisteredConfiguration.jarSigning()
      );
      expect(clientIdScheme).toBe(preRegisteredConfiguration.clientIdScheme());
    });

    it('should return X509SanDns ClientIdScheme when clientIdSchemeName is "x509_san_dns"', () => {
      class X509SanDnsConfiguration extends MockConfiguration {
        clientIdSchemeName = (): ClientIdSchemeName => 'x509_san_dns';
      }
      const x509SanDnsConfiguration = new X509SanDnsConfiguration();

      const clientIdScheme = x509SanDnsConfiguration.clientIdScheme();
      expect(clientIdScheme.__type === 'X509SanDns').toBe(true);
      expect(clientIdScheme.clientId).toBe('Verifier');
      expect(clientIdScheme.jarSigning).toBe(
        x509SanDnsConfiguration.jarSigning()
      );
      expect(clientIdScheme).toBe(x509SanDnsConfiguration.clientIdScheme());
    });

    it('should return X509SanUri ClientIdScheme when clientIdSchemeName is "x509_san_uri"', () => {
      class X509SanUriConfiguration extends MockConfiguration {
        clientIdSchemeName = (): ClientIdSchemeName => 'x509_san_uri';
      }
      const x509SanUriConfiguration = new X509SanUriConfiguration();

      const clientIdScheme = x509SanUriConfiguration.clientIdScheme();
      expect(clientIdScheme.__type === 'X509SanUri').toBe(true);
      expect(clientIdScheme.clientId).toBe('Verifier');
      expect(clientIdScheme.jarSigning).toBe(
        x509SanUriConfiguration.jarSigning()
      );
      expect(clientIdScheme).toBe(x509SanUriConfiguration.clientIdScheme());
    });
  });

  describe('jarByReference', () => {
    it('returns correct URL when calling buildUrl"', () => {
      const config = new MockConfiguration({
        requestJarOptionName: 'by_reference',
      });
      const requestId = new RequestId('request-id');
      const result = config.jarByReference();

      expect(
        UrlBuilder.buildUrlWithRequestId(result.urlBuilder, requestId).href
      ).toBe(
        `${configuration.publicUrl()}/wallet/request.jwt/${requestId.value}`
      );
    });
  });

  describe('jarOption', () => {
    it('returns EmbedOption.ByValue.INSTANCE when requestJarOptionName is "by_value"', () => {
      const config = new MockConfiguration({
        requestJarOptionName: 'by_value',
      });
      const result = config.jarOption();

      expect(result).toBe(EmbedOption.ByValue.INSTANCE);
    });

    it('returns EmbedOption.ByReference with correct URL when requestJarOptionName is "by_reference"', () => {
      const config = new MockConfiguration({
        requestJarOptionName: 'by_reference',
      });
      const result = config.jarOption();

      expect(result).toBeInstanceOf(EmbedOption.ByReference);

      const requestId = new RequestId('request-id');
      const url = (
        result.__type === 'ByReference'
          ? UrlBuilder.buildUrlWithRequestId(result.urlBuilder, requestId)
          : undefined
      )!;

      expect(url.href).toBe(
        `${configuration.publicUrl()}/wallet/request.jwt/${requestId.value}`
      );
    });
  });

  describe('responseModeOption', () => {
    it('returns ResponseModeOption.DirectPostJwt when responseModeOptionName is direct_post.jwt', () => {
      const result = configuration.responseModeOption();

      expect(result).toBe(ResponseModeOption.DirectPostJwt);
    });

    it('returns ResponseModeOption.DirectPostJwt when responseModeOptionName is direct_post.jwt', () => {
      const config = new MockConfiguration({
        responseModeOptionName: 'direct_post',
      });

      const result = config.responseModeOption();

      expect(result).toBe(ResponseModeOption.DirectPost);
    });
  });

  describe('presentationDefinitionByReference', () => {
    it('returns correct URL when calling buildUrl"', () => {
      const config = new MockConfiguration({
        requestJarOptionName: 'by_reference',
      });
      const requestId = new RequestId('request-id');
      const result = config.presentationDefinitionByReference();

      expect(
        UrlBuilder.buildUrlWithRequestId(result.urlBuilder, requestId).href
      ).toBe(`${configuration.publicUrl()}/wallet/pd/${requestId.value}`);
    });
  });

  describe('presentationDefinitionOption', () => {
    it('returns EmbedOption.ByValue.INSTANCE when presentationDefinitionOptionName is "by_value"', () => {
      const config = new MockConfiguration({
        presentationDefinitionOptionName: 'by_value',
      });
      const result = config.presentationDefinitionOption();

      expect(result).toBe(EmbedOption.ByValue.INSTANCE);
    });

    it('returns EmbedOption.ByReference with correct URL when presentationDefinitionOptionName is "by_reference"', () => {
      const config = new MockConfiguration({
        presentationDefinitionOptionName: 'by_reference',
      });
      const result = config.jarOption();

      expect(result).toBeInstanceOf(EmbedOption.ByReference);

      const requestId = new RequestId('request-id');
      const url = (
        result.__type === 'ByReference'
          ? UrlBuilder.buildUrlWithRequestId(result.urlBuilder, requestId)
          : undefined
      )!;

      expect(url.href).toBe(
        `${configuration.publicUrl()}/wallet/request.jwt/${requestId.value}`
      );
    });
  });

  describe('maxAge', () => {
    it('returns 5 minutes as default"', () => {
      const result = configuration.maxAge();

      expect(result).toEqual(DurationLuxon.Factory.ofMinutes(5));
    });
  });

  describe('jarmOption', () => {
    it('returns JarmOption.Encrypted as default"', () => {
      const result = configuration.jarmOption();

      expect(result.__type === 'Encrypted').toBe(true);
    });
  });

  describe('clientMetaData', () => {
    it('returns clientMetaData as default"', () => {
      const result = configuration.clientMetaData();

      expect(result).toBeInstanceOf(ClientMetaData);
    });
  });

  describe('responseUriBuilder', () => {
    it('returns response URI', () => {
      const result = configuration.responseUrlBuilder();

      expect(
        UrlBuilder.buildUrlWithRequestId(result, new RequestId('hoge')).href
      ).toBe(`${configuration.publicUrl()}/wallet/direct_post/`);
    });
  });

  describe('verifierConfig', () => {
    it('returns clientMetaData as default"', () => {
      const result = configuration.verifierConfig();

      expect(result).toBeInstanceOf(VerifierConfig);
    });

    it('returns the same clientMetaData when getting twice"', () => {
      const result = configuration.verifierConfig();

      expect(result).toBe(configuration.verifierConfig());
    });
  });

  describe('frontendCorsOrigin', () => {
    it('returns frontend cors origin as default"', () => {
      const result = configuration.frontendCorsOrigin();

      expect(result).toBe('http://localhost:3000');
    });
  });
});
