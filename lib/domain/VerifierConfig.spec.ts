import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { VerifierConfig } from './VerifierConfig';
import {
  ClientIdScheme,
  EmbedOption,
  ResponseModeOption,
  BuildUrl,
  ClientMetaData,
  RequestId,
  SigningConfig,
} from '.';
import { DurationLuxon } from '../adapters/out/cfg';

describe('VerifierConfig', () => {
  const mockClientIdScheme: ClientIdScheme = {
    __type: 'PreRegistered',
    clientId: 'mock-id',
    jarSigning: {} as SigningConfig,
  };
  const mockRequestJarOption = {} as EmbedOption<RequestId>;
  const mockPresentationDefinitionEmbedOption = {} as EmbedOption<RequestId>;
  const mockResponseModeOption = {} as ResponseModeOption;
  const mockResponseUriBuilder: BuildUrl<RequestId> = (id) =>
    new URL(`http://example.com/${id.value}`);
  const mockMaxAge = DurationLuxon.Factory.ofSeconds(3600);
  const mockClientMetaData = {} as ClientMetaData;

  it('should create an instance with all properties set correctly', () => {
    const config = new VerifierConfig(
      mockClientIdScheme,
      mockRequestJarOption,
      mockPresentationDefinitionEmbedOption,
      mockResponseModeOption,
      mockResponseUriBuilder,
      mockMaxAge,
      mockClientMetaData
    );

    expect(config.clientIdScheme).toBe(mockClientIdScheme);
    expect(config.jarOption).toBe(mockRequestJarOption);
    expect(config.presentationDefinitionOption).toBe(
      mockPresentationDefinitionEmbedOption
    );
    expect(config.responseModeOption).toBe(mockResponseModeOption);
    expect(config.responseUriBuilder).toBe(mockResponseUriBuilder);
    expect(config.maxAge).toBe(mockMaxAge);
    expect(config.clientMetaData).toBe(mockClientMetaData);
  });
});
