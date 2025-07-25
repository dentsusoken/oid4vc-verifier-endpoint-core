import { describe, it, expect } from 'vitest';

import { Result } from '@vecrea/oid4vc-core/utils';
import {
  EphemeralECDHPrivateJwk,
  IdTokenType,
  JarmOption,
  Presentation,
  TransactionId,
  RequestId,
  VerifierConfig,
  PresentationType,
  ResponseModeOption,
  EmbedOption,
  Nonce,
  GetWalletResponseMethod,
  StaticSigningPrivateJwk,
  ClientMetaData,
  ClientIdScheme,
  SigningConfig,
  UrlBuilder,
} from '../../../domain';
import { GenerateEphemeralECDHPrivateJwk } from '../../../ports/out/jose';
import {
  createEphemeralECDHPrivateJwk,
  createJwtSecuredAuthorizationRequestTO,
} from '../InitTransactionService.create';
import { createSignRequestObjectJoseInvoker } from '../../../adapters/out/jose';
import { generateKeyPair, exportJWK } from 'jose';
import { JwtSecuredAuthorizationRequestTO } from '../../../ports/input/InitTransaction.types';

describe('InitTransactionService.create', () => {
  describe('createEphemeralECDHPrivateJwk', () => {
    const ephemeralECDHPrivateJwk = new EphemeralECDHPrivateJwk('hoge');
    const generatePrivateJwk: GenerateEphemeralECDHPrivateJwk = async () => {
      return Result.success(ephemeralECDHPrivateJwk);
    };

    it('should return undefined when responseModeOption is not DirectPostJwt', async () => {
      const responseModeOption = ResponseModeOption.DirectPost;
      const jarmOption: JarmOption = new JarmOption.Signed('RS256');
      const result = await createEphemeralECDHPrivateJwk(
        responseModeOption,
        jarmOption,
        generatePrivateJwk
      );
      expect(result).toBeUndefined();
    });

    it('should throw an error when jarmOption is Signed', async () => {
      const responseModeOption = ResponseModeOption.DirectPostJwt;
      const jarmOption: JarmOption = new JarmOption.Signed('RS256');
      await expect(
        createEphemeralECDHPrivateJwk(
          responseModeOption,
          jarmOption,
          generatePrivateJwk
        )
      ).rejects.toThrowError('Misconfiguration');
    });

    it('should return the generated EphemeralECDHPrivateJwk when conditions are met', async () => {
      const responseModeOption = ResponseModeOption.DirectPostJwt;
      const jarmOption = new JarmOption.Encrypted('RSA-OAEP', 'A256GCM');
      const result = await createEphemeralECDHPrivateJwk(
        responseModeOption,
        jarmOption,
        generatePrivateJwk
      );
      expect(result).toEqual(ephemeralECDHPrivateJwk);
    });

    it('should throw an error when generatePrivateJwk fails', async () => {
      const responseModeOption = ResponseModeOption.DirectPostJwt;
      const jarmOption: JarmOption = new JarmOption.Encrypted(
        'RSA-OAEP',
        'A256GCM'
      );
      const failingGeneratePrivateJwk: GenerateEphemeralECDHPrivateJwk =
        async () => {
          return Result.failure(new Error('Failed to generate private JWK'));
        };
      await expect(
        createEphemeralECDHPrivateJwk(
          responseModeOption,
          jarmOption,
          failingGeneratePrivateJwk
        )
      ).rejects.toThrowError('Failed to generate private JWK');
    });
  });

  describe('createJwtSecuredAuthorizationRequestTO', async () => {
    const signRequestObject = createSignRequestObjectJoseInvoker();

    const staticSigningPrivateKey = (await generateKeyPair('ES256')).privateKey;
    const staticSigningPrivateExportedJwk = await exportJWK(
      staticSigningPrivateKey
    );
    const staticSigningPrivateJwk: StaticSigningPrivateJwk = {
      value: JSON.stringify(staticSigningPrivateExportedJwk),
    };

    const ephemeralECDHPrivateKey = (await generateKeyPair('ES256')).privateKey;
    const ephemeralECDHPrivateExportedJwk = await exportJWK(
      ephemeralECDHPrivateKey
    );
    const ephemeralECDHPrivateJwk = new EphemeralECDHPrivateJwk(
      JSON.stringify(ephemeralECDHPrivateExportedJwk)
    );

    const clientMetaData = {
      idTokenSignedResponseAlg: 'ES256',
      idTokenEncryptedResponseAlg: 'ECDH-ES+A256KW',
      idTokenEncryptedResponseEnc: 'A256GCM',
      subjectSyntaxTypesSupported: ['urn:ietf:params:oauth:jwk-thumbprint'],
      jwkOption: EmbedOption.ByValue.INSTANCE,
      jarmOption: {
        jwsAlg: () => 'ES256',
        jweAlg: () => 'ECDH-ES+A256KW',
        jweEnc: () => 'A256GCM',
      },
    } as ClientMetaData;
    const clientIdScheme = new ClientIdScheme.PreRegistered('client_id', {
      staticSigningPrivateJwk,
      algorithm: 'ES256',
    } as SigningConfig);

    const responseUrlBuilder = new UrlBuilder.WithRequestId(
      `https://example.com/response/`
    );
    const verifierConfig = {
      clientIdScheme,
      clientMetaData,
      responseUrlBuilder: responseUrlBuilder,
    } as VerifierConfig;

    const id = new TransactionId('transaction-id');
    const initiatedAt = new Date('2023-06-08T10:00:00Z');
    const type = new PresentationType.IdTokenRequest([
      IdTokenType.SubjectSigned,
    ]);
    const requestId = new RequestId('request-id');
    const nonce = new Nonce('nonce');
    const responseMode = ResponseModeOption.DirectPostJwt;
    const presentationDefinitionMode: EmbedOption =
      EmbedOption.ByValue.INSTANCE;
    const getWalletResponseMethod = new GetWalletResponseMethod.Redirect(
      'http://example.com/{requestId}'
    );
    const now = () => new Date();

    const requested = new Presentation.Requested(
      id,
      initiatedAt,
      type,
      requestId,
      nonce,
      ephemeralECDHPrivateJwk,
      responseMode,
      presentationDefinitionMode,
      getWalletResponseMethod
    );

    it('should create JwtSecuredAuthorizationRequestTO with jwt when jarOption is ByValue', async () => {
      const jarOption = EmbedOption.ByValue.INSTANCE;

      const result = await createJwtSecuredAuthorizationRequestTO(
        requested,
        jarOption,
        signRequestObject,
        verifierConfig,
        now
      );
      //console.log(result.requestTO);

      expect(result.requestTO).toBeInstanceOf(JwtSecuredAuthorizationRequestTO);
      expect(result.requestTO.transactionId).toBe(id.value);
      expect(result.requestTO.clientId).toBe(
        verifierConfig.clientIdScheme.clientId
      );
      expect(result.requestTO.request?.startsWith('eyJ')).toBe(true);
      expect(result.requestTO.requestUri).toBeUndefined();
      expect(result.presentation).toBeInstanceOf(
        Presentation.RequestObjectRetrieved
      );
    });

    it('should create JwtSecuredAuthorizationRequestTO with requestUri when jarOption is ByReference', async () => {
      const jarOption = new EmbedOption.ByReference(
        new UrlBuilder.WithRequestId(`https://example.com/request.jwt/`)
      );

      const result = await createJwtSecuredAuthorizationRequestTO(
        requested,
        jarOption,
        signRequestObject,
        verifierConfig,
        now
      );

      expect(result.requestTO).toBeInstanceOf(JwtSecuredAuthorizationRequestTO);
      expect(result.requestTO.transactionId).toBe(requested.id.value);
      expect(result.requestTO.clientId).toBe(
        verifierConfig.clientIdScheme.clientId
      );
      expect(result.requestTO.request).toBeUndefined();
      expect(result.requestTO.requestUri).toBe(
        `https://example.com/request.jwt/${requested.requestId.value}`
      );
      expect(result.presentation).toBe(requested);
    });
  });
});
