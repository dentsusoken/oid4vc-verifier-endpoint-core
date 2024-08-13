import { describe, it, expect } from 'vitest';
import {
  StaticSigningPrivateJwk,
  ClientMetaData,
  EmbedOption,
  ClientIdScheme,
  SigningConfig,
  VerifierConfig,
  RequestId,
  BuildUrl,
  TransactionId,
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
  createGenerateTransactionIdJoseInvoker,
  createGenerateRequestIdHoseInvoker,
  createCreateQueryWalletResponseRedirectUriInvoker,
} from '../../adapters/out/cfg';
import {
  createGenerateEphemeralECDHPrivateJwkJoseInvoker,
  createSignRequestObjectJoseInvoker,
} from '../../adapters/out/jose';
import { generateKeyPair, exportJWK } from 'jose';
import { PresentationInMemoryStore } from '../../adapters/out/persistence';

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

  const presentationInMemoryStore = new PresentationInMemoryStore();

  const generateTransactionId = createGenerateTransactionIdJoseInvoker();
  const generateRequestId = createGenerateRequestIdHoseInvoker();
  const storePresentation = presentationInMemoryStore.storePresentation;
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
    createCreateQueryWalletResponseRedirectUriInvoker();

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
      jarMode: EmbedModeTO.ByReference,
      presentationDefinition: {} as PresentationDefinition,
      presentationDefinitionMode: EmbedModeTO.ByValue,
      redirectUriTemplate: 'https://example.com/redirect/{RESPONSE_CODE}',
    };

    const result = await initTransaction(initTransactionTO);

    expect(result.isSuccess).toBe(true);
    const requestTO = result.getOrThrow();
    console.log(requestTO);
    expect(requestTO).toBeInstanceOf(JwtSecuredAuthorizationRequestTO);
    expect(requestTO.transactionId).toBeDefined();
    expect(requestTO.clientId).toBe('client_id');
    expect(requestTO.request).toBeUndefined();
    expect(
      requestTO.requestUri?.startsWith('https://example.com/request.jwt/')
    ).toBe(true);
    const presentation = await presentationInMemoryStore.loadPresentationById(
      new TransactionId(requestTO.transactionId!)
    );
    expect(presentation!.__type === 'Requested');
  });
});
