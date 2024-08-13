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
} from '../../domain';
import { PresentationDefinition } from 'oid4vc-prex';
import {
  EmbedModeTO,
  IdTokenTypeTO,
  InitTransactionTO,
  PresentationTypeTO,
  ResponseModeTO,
} from '../../ports/input/InitTransaction.types';
import { createGetRequestObjectServiceInvoker } from './GetRequestObjectService';
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
import { createInitTransactionServiceInvoker } from './InitTransactionService';

describe('createGetRequestObjectServiceInvoker', async () => {
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
  const loadPresentationByRequestId =
    presentationInMemoryStore.loadPresentationByRequestId;
  const storePresentation = presentationInMemoryStore.storePresentation;
  const signRequestObject = createSignRequestObjectJoseInvoker();
  const generateEphemeralECDHPrivateJwk =
    createGenerateEphemeralECDHPrivateJwkJoseInvoker();
  const createQueryWalletResponseRedirectUri =
    createCreateQueryWalletResponseRedirectUriInvoker();

  const jarByReference = new EmbedOption.ByReference(
    (id: RequestId) => new URL(`https://example.com/request.jwt/${id.value}`)
  );
  const presentationDefinitionByReference = new EmbedOption.ByReference(
    (id: RequestId) => new URL(`https://example.com/pd/${id.value}`)
  );

  const initTransactionCreateParams = {
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

  const getRequestObjectCreateParams = {
    loadPresentationByRequestId,
    storePresentation,
    signRequestObject,
    verifierConfig,
    now,
  };

  const initTransaction = createInitTransactionServiceInvoker(
    initTransactionCreateParams
  );
  const getRequestObject = createGetRequestObjectServiceInvoker(
    getRequestObjectCreateParams
  );

  it('should return Jwt on success', async () => {
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

    const initTransactionResult = await initTransaction(initTransactionTO);

    expect(initTransactionResult.isSuccess).toBe(true);
    const requestUri = initTransactionResult.getOrThrow().requestUri!;
    //console.log(requestUri);
    const index = requestUri.lastIndexOf('/');
    const requestId = new RequestId(requestUri.substring(index + 1));
    //console.log(requestId);

    const getRequestObjectResponse = await getRequestObject(requestId);
    expect(getRequestObjectResponse.__type === 'Found').toBe(true);
    expect(
      getRequestObjectResponse.__type === 'Found' &&
        getRequestObjectResponse.value.startsWith('eyJ')
    ).toBe(true);

    const presentation = await loadPresentationByRequestId(requestId);
    expect(presentation?.__type === 'RequestObjectRetrieved').toBe(true);
  });
});
