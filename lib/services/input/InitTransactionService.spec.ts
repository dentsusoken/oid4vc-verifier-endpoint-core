import { describe, it, expect } from 'vitest';
import {
  Presentation,
  StaticSigningPrivateJwk,
  EphemeralECDHPrivateJwk,
  ClientMetaData,
  EmbedOption,
  ClientIdScheme,
  SigningConfig,
  VerifierConfig,
  RequestId,
  BuildUrl,
} from '../../domain';
import { PresentationDefinition } from 'oid4vc-prex';
import {
  EmbedModeTO,
  IdTokenTypeTO,
  InitTransactionTO,
  JwtSecuredAuthorizationRequestTO,
  PresentationTypeTO,
  ResponseModeTO,
} from '../../ports/input/InitTransaction.types';
import { createInitTransactionServiceInvoker } from './InitTransactionService';
import {
  createGenerateTransactionIdInvoker,
  createGenerateRequestIdHoseInvoker,
  createCreateQueryWalletResponseRedirectUri,
} from '../../adapters/out/cfg';
import {
  createGenerateEphemeralECDHPrivateJwkJoseInvoker,
  createSignRequestObjectJoseInvoker,
} from '../../adapters/out/jose';
import { generateKeyPair, exportJWK } from 'jose';

describe('createInitTransactionServiceInvoker', async () => {
  const staticSigningPrivateKey = (await generateKeyPair('ES256')).privateKey;
  const staticSigningPrivateExportedJwk = await exportJWK(
    staticSigningPrivateKey
  );
  const staticSigningPrivateJwk: StaticSigningPrivateJwk = {
    value: JSON.stringify(staticSigningPrivateExportedJwk),
  };

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

  const responseUriBuilder: BuildUrl<RequestId> = (requestId: RequestId) =>
    new URL(`https://example.com/response/${requestId.value}`);
  const verifierConfig = {
    clientIdScheme,
    clientMetaData,
    responseUriBuilder,
  } as VerifierConfig;

  const now = () => new Date();

  const generateTransactionId = createGenerateTransactionIdInvoker();
  const generateRequestId = createGenerateRequestIdHoseInvoker();
  let storedPresentation: Presentation;
  const storePresentation = async (presentation: Presentation) => {
    storedPresentation = presentation;
  };
  const signRequestObject = createSignRequestObjectJoseInvoker();
  const generateEphemeralECDHPrivateJwk =
    createGenerateEphemeralECDHPrivateJwkJoseInvoker();
  const jarByReference = new EmbedOption.ByReference(
    (id: RequestId) => new URL(`https://example.com/request.jwt/${id.value}`)
  );
  const presentationDefinitionByReference = new EmbedOption.ByReference(
    (id: RequestId) => new URL(`https://example.com/pd/${id.value}`)
  );
  const createQueryWalletResponseRedirectUri =
    createCreateQueryWalletResponseRedirectUri();

  const createParams = {
    generateTransactionId,
    generateRequestId,
    storePresentation,
    signRequestObject,
    verifierConfig,
    now,
    generateEphemeralECDHPrivateJwk,
    jarByReference,
    presentationDefinitionByReference,
    createQueryWalletResponseRedirectUri,
  };

  const initTransaction = createInitTransactionServiceInvoker(createParams);

  it('should return JwtSecuredAuthorizationRequestTO on success', async () => {
    const initTransactionTO: InitTransactionTO = {
      type: PresentationTypeTO.VpTokenRequest,
      idTokenType: IdTokenTypeTO.SubjectSigned,
      nonce: 'nonce',
      responseMode: ResponseModeTO.DirectPost,
      jarMode: EmbedModeTO.ByValue,
      presentationDefinition: {} as PresentationDefinition,
      presentationDefinitionMode: EmbedModeTO.ByValue,
      redirectUriTemplate: 'https://example.com/redirect/{RESPONSE_CODE}',
    };

    const result = await initTransaction(initTransactionTO);

    expect(result.isSuccess).toBe(true);
    const requestTO = result.getOrThrow();
    expect(requestTO).toBeInstanceOf(JwtSecuredAuthorizationRequestTO);
    expect(requestTO.transactionId).toBeDefined();
    expect(requestTO.clientId).toBe('client_id');
    expect(requestTO.request?.startsWith('eyJ')).toBe(true);
    expect(requestTO.requestUri).toBeUndefined();
    expect(storedPresentation.__type === 'RequestObjectRetrieved');
  });
});
