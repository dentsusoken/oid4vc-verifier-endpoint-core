import { describe, it, expect } from 'vitest';
import { VerifierConfig } from './VerifierConfig';
import {
  ClientIdScheme,
  EmbedOption,
  ResponseModeOption,
  ClientMetaData,
  SigningConfig,
  UrlBuilder,
} from '.';
import { DurationLuxon } from '../adapters/out/cfg';

describe('VerifierConfig', () => {
  const mockClientIdScheme: ClientIdScheme = {
    __type: 'PreRegistered',
    clientId: 'mock-id',
    jarSigning: {} as SigningConfig,
  };
  const mockRequestJarOption = {} as EmbedOption;
  const mockPresentationDefinitionEmbedOption = {} as EmbedOption;
  const mockResponseModeOption = {} as ResponseModeOption;
  const mockResponseUrlBuilder = new UrlBuilder.WithRequestId(
    `http://example.com/`
  );
  const mockMaxAge = DurationLuxon.Factory.ofSeconds(3600);
  const mockClientMetaData = {} as ClientMetaData;

  it('should create an instance with all properties set correctly', () => {
    const config = new VerifierConfig(
      mockClientIdScheme,
      mockRequestJarOption,
      mockPresentationDefinitionEmbedOption,
      mockResponseModeOption,
      mockResponseUrlBuilder,
      mockMaxAge,
      mockClientMetaData
    );

    expect(config.clientIdScheme).toBe(mockClientIdScheme);
    expect(config.jarOption).toBe(mockRequestJarOption);
    expect(config.presentationDefinitionOption).toBe(
      mockPresentationDefinitionEmbedOption
    );
    expect(config.responseModeOption).toBe(mockResponseModeOption);
    expect(config.responseUrlBuilder).toBe(mockResponseUrlBuilder);
    expect(config.maxAge).toBe(mockMaxAge);
    expect(config.clientMetaData).toBe(mockClientMetaData);
  });
});
