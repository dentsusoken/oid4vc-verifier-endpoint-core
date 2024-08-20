import { describe, it, expect } from 'vitest';
import { ClientMetaData } from './ClientMetaData';
import { EmbedOption } from './EmbedOption';
import { JarmOption } from './JarmOption';

describe('ClientMetaData', () => {
  it('should create an instance of ClientMetaData with valid parameters', () => {
    const mockJwkOption = {} as EmbedOption;
    const mockJarmOption: JarmOption = {} as JarmOption;

    const clientMetaData = new ClientMetaData(
      mockJwkOption,
      'RS256',
      'RSA-OAEP',
      'A256GCM',
      ['urn:ietf:params:oauth:jwk-thumbprint'],
      mockJarmOption
    );

    expect(clientMetaData.constructor).toBe(ClientMetaData);
    expect(clientMetaData.jwkOption).toBe(mockJwkOption);
    expect(clientMetaData.idTokenSignedResponseAlg).toBe('RS256');
    expect(clientMetaData.idTokenEncryptedResponseAlg).toBe('RSA-OAEP');
    expect(clientMetaData.idTokenEncryptedResponseEnc).toBe('A256GCM');
    expect(clientMetaData.subjectSyntaxTypesSupported).toEqual([
      'urn:ietf:params:oauth:jwk-thumbprint',
    ]);
    expect(clientMetaData.jarmOption).toBe(mockJarmOption);
  });

  it('should allow empty array for subjectSyntaxTypesSupported', () => {
    const mockJwkOption = {} as EmbedOption;
    const mockJarmOption = {} as JarmOption;

    const clientMetaData = new ClientMetaData(
      mockJwkOption,
      'RS256',
      'RSA-OAEP',
      'A256GCM',
      [],
      mockJarmOption
    );

    expect(clientMetaData.subjectSyntaxTypesSupported).toEqual([]);
  });
});
