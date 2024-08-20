import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { createSignRequestObjectJoseInvoker } from './SignRequestObjectJose';
import {
  Presentation,
  RequestId,
  VerifierConfig,
  ClientMetaData,
  StaticSigningPrivateJwk,
  EphemeralECDHPrivateJwk,
  EmbedOption,
  PresentationType,
  TransactionId,
  Nonce,
  ResponseModeOption,
  GetWalletResponseMethod,
  ClientIdScheme,
  SigningConfig,
  UrlBuilder,
} from '../../../domain';
import { exportJWK, generateKeyPair } from 'jose';
import { PresentationDefinition } from 'oid4vc-prex';

describe('SignRequestObjectJose', async () => {
  const signRequestObject = createSignRequestObjectJoseInvoker();

  const staticSigningPrivateKey = (await generateKeyPair('ES256')).privateKey;
  const staticSigningPrivateExportedJwk = await exportJWK(
    staticSigningPrivateKey
  );
  staticSigningPrivateExportedJwk.kid = 'kid';
  staticSigningPrivateExportedJwk.x5c = ['x5c'];
  const staticSigningPrivateJwk: StaticSigningPrivateJwk = {
    value: JSON.stringify(staticSigningPrivateExportedJwk),
  };
  const ephemeralECDHPrivateKey = (await generateKeyPair('ES256')).privateKey;
  const ephemeralECDHPrivateJwk = new EphemeralECDHPrivateJwk(
    JSON.stringify(await exportJWK(ephemeralECDHPrivateKey))
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
  const responseUrlBuilder = new UrlBuilder.WithRequestId(
    `https://example.com/response/`
  );

  const mockAt = new Date('2023-06-08T10:00:00Z');
  const now = () => mockAt;
  const pd = {} as PresentationDefinition;
  const presentationType = new PresentationType.VpTokenRequest(pd);
  const getWalletResponseMethod = new GetWalletResponseMethod.Redirect(
    'http://example.com/{requestId}'
  );
  const mockPresentation = new Presentation.Requested(
    new TransactionId('test-transaction-id'),
    new Date('2023-06-08T09:00:00Z'),
    presentationType,
    new RequestId('test-request-id'),
    new Nonce('test-nonce'),
    ephemeralECDHPrivateJwk,
    ResponseModeOption.DirectPost,
    EmbedOption.ByValue.INSTANCE,
    getWalletResponseMethod
  );

  describe('createSignRequestObjectJoseInvoker', () => {
    it('should return a function', () => {
      expect(typeof signRequestObject).toBe('function');
    });
  });

  describe('sign', () => {
    it('should create a signed JWT', async () => {
      const clientIdScheme = new ClientIdScheme.PreRegistered('client_id', {
        staticSigningPrivateJwk,
        algorithm: 'ES256',
      } as SigningConfig);
      const mockVerifierConfig = {
        clientIdScheme,
        clientMetaData,
        responseUrlBuilder: responseUrlBuilder,
      } as VerifierConfig;

      const signRequestObject = createSignRequestObjectJoseInvoker();
      const result = await signRequestObject(
        mockVerifierConfig,
        now,
        mockPresentation
      );

      expect(result.isSuccess).toBe(true);
      const jwt = result.getOrThrow();
      const pieces = jwt.split('.');
      expect(pieces.length).toBe(3);
    });
  });
});
