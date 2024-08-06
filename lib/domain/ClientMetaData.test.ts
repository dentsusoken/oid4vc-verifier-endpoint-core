import { describe, it, expect } from 'vitest';
import { ClientMetaData } from './ClientMetaData';
import { EmbedOption } from './EmbedOption';
import { JarmOption } from './JarmOption';
import { RequestId } from './RequestId';

describe('ClientMetaData', () => {
  it('should create an instance of ClientMetaData with valid parameters', () => {
    const mockJwkOption: EmbedOption<RequestId> = {} as EmbedOption<RequestId>;
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
    const mockJwkOption: EmbedOption<RequestId> = {} as EmbedOption<RequestId>;
    const mockJarmOption: JarmOption = {} as JarmOption;

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
