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
  AuthorizationResponseData,
  JarmOption,
  ResponseCode,
  AuthorizationResponse,
  ResponseModeOption,
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
import { createGetRequestObjectServiceInvoker } from './GetRequestObjectService';
import {
  createGenerateTransactionIdInvoker,
  createGenerateRequestIdHoseInvoker,
  createCreateQueryWalletResponseRedirectUriInvoker,
  createGenerateResponseCodeInvoker,
} from '../../adapters/out/cfg';
import {
  createGenerateEphemeralECDHPrivateJwkJoseInvoker,
  createSignRequestObjectJoseInvoker,
  createVerifyJarmJwtJoseInvoker,
} from '../../adapters/out/jose';
import { generateKeyPair, exportJWK, CompactEncrypt, importJWK } from 'jose';
import {
  LoadPresentationByRequestId,
  StorePresentation,
} from '../../ports/out/persistence';
import {
  createLoadPresentationByRequestIdInMemoryInvoker,
  createStorePresentationInMemoryInvoker,
  PresentationInMemoryStore,
} from '../../adapters/out/persistence';
import { createInitTransactionServiceInvoker } from './InitTransactionService';
import { createPostWalletResponseServiceInvoker } from './PostWalletResponseService';
import { VerifyJarmJwt } from '../../ports/out/jose';
import { Result } from '../../kotlin';
import {
  CreateQueryWalletResponseRedirectUri,
  GenerateResponseCode,
} from '../../ports/out/cfg';

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
    jarmOption: new JarmOption.Encrypted('ECDH-ES+A256KW', 'A256GCM'),
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

  const generateTransactionId = createGenerateTransactionIdInvoker();
  const generateRequestId = createGenerateRequestIdHoseInvoker();
  const loadPresentationByRequestId =
    presentationInMemoryStore.loadPresentationByRequestId;
  const storePresentation = presentationInMemoryStore.storePresentation;
  const signRequestObject = createSignRequestObjectJoseInvoker();
  const generateEphemeralECDHPrivateJwk =
    createGenerateEphemeralECDHPrivateJwkJoseInvoker();
  const createQueryWalletResponseRedirectUri =
    createCreateQueryWalletResponseRedirectUriInvoker();
  const verifyJarmJwt = createVerifyJarmJwtJoseInvoker();
  const generateResponseCode = createGenerateResponseCodeInvoker();

  const jarByReference = new EmbedOption.ByReference(
    (id: RequestId) => new URL(`https://example.com/request.jwt/${id.value}`)
  );
  const presentationDefinitionByReference = new EmbedOption.ByReference(
    (id: RequestId) => new URL(`https://example.com/pd/${id.value}`)
  );

  // const recipientKeyPair = await generateKeyPair('ES256');
  // const privateJwk = await exportJWK(recipientKeyPair.privateKey);

  const presentationSubmission = {
    id: 'submission-id-1',
    definition_id: 'definition-id-1',
    descriptor_map: [
      {
        id: 'input-descriptor-id-1',
        format: 'jwt_vc',
        path: '$.verifiableCredential[0]',
      },
    ],
  };
  const presentationSubmissionJsonStr = JSON.stringify(presentationSubmission);

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

  const postWalletResponseCreateParams = {
    loadPresentationByRequestId,
    storePresentation,
    verifyJarmJwt,
    now,
    verifierConfig,
    generateResponseCode,
    createQueryWalletResponseRedirectUri,
  };

  it('should return WalletResponseAcceptedTO when GetWalletResponseMethod.Redirect', async () => {
    const initTransaction = createInitTransactionServiceInvoker(
      initTransactionCreateParams
    );
    const getRequestObject = createGetRequestObjectServiceInvoker(
      getRequestObjectCreateParams
    );
    const postWalletResponse = createPostWalletResponseServiceInvoker(
      postWalletResponseCreateParams
    );

    const initTransactionTO: InitTransactionTO = {
      type: PresentationTypeTO.VpTokenRequest,
      idTokenType: IdTokenTypeTO.SubjectSigned,
      nonce: 'nonce',
      responseMode: ResponseModeTO.DirectPostJwt,
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

    const presentation = await loadPresentationByRequestId(requestId);
    if (presentation?.__type !== 'RequestObjectRetrieved') {
      throw new Error('Invalid presentation state');
    }

    const payload = {
      state: presentation.requestId.value,
      vpToken: 'vpToken',
      presentationSubmission: presentationSubmissionJsonStr,
    };

    const enc = new CompactEncrypt(
      new TextEncoder().encode(JSON.stringify(payload))
    ).setProtectedHeader({ alg: 'ECDH-ES+A256KW', enc: 'A256GCM' });

    const verifierPrivateJwk = JSON.parse(
      presentation.ephemeralEcPrivateKey!.value
    );
    delete verifierPrivateJwk.d;
    const publicKey = await importJWK(verifierPrivateJwk);

    const jarm = await enc.encrypt(publicKey);
    const authorizationResponse = new AuthorizationResponse.DirectPostJwt(
      payload.state,
      jarm
    );

    const postWalletResponseResult = await postWalletResponse(
      authorizationResponse
    );
    //console.log(postWalletResponseResult);
    expect(postWalletResponseResult.isSuccess).toBe(true);
    const walletResponseAcceptedTO = postWalletResponseResult.getOrThrow();

    const submitted = await loadPresentationByRequestId(requestId);
    expect(submitted?.__type === 'Submitted').toBe(true);

    if (submitted?.__type !== 'Submitted') {
      throw new Error('Invalid presentation status');
    }

    expect(walletResponseAcceptedTO?.redirectUri).toBe(
      `https://example.com/redirect/${submitted.responseCode?.value}`
    );
    expect(submitted.walletResponse).toBeDefined();
    console.log(submitted.walletResponse);
  });

  it('should throw error when presentation is not found', async () => {
    const createParams = {
      loadPresentationByRequestId: (async () =>
        undefined) as LoadPresentationByRequestId,
      storePresentation: (async () => undefined) as StorePresentation,
      verifyJarmJwt: (async () =>
        Result.success({} as AuthorizationResponseData)) as VerifyJarmJwt,
      now: () => new Date(),
      verifierConfig: {} as VerifierConfig,
      generateResponseCode: (async () =>
        new ResponseCode('hoge')) as GenerateResponseCode,
      createQueryWalletResponseRedirectUri: (() =>
        Result.success(
          new URL('https://example.com')
        )) as CreateQueryWalletResponseRedirectUri,
    };
    const postWalletResponse =
      createPostWalletResponseServiceInvoker(createParams);
    const authorizationResponse = new AuthorizationResponse.DirectPostJwt(
      'state',
      'jarm'
    );

    const result = await postWalletResponse(authorizationResponse);
    expect(result.isFailure);
    expect(result.exceptionOrUndefined()?.message).toBe(
      'Not found presentation'
    );
  });

  it('should throw error when presentation type is not RequestObjectRetrieved', async () => {
    const createParams = {
      loadPresentationByRequestId: (async () =>
        ({
          __type: 'Requested',
        } as Presentation)) as LoadPresentationByRequestId,
      storePresentation: (async () => undefined) as StorePresentation,
      verifyJarmJwt: (async () =>
        Result.success({} as AuthorizationResponseData)) as VerifyJarmJwt,
      now: () => new Date(),
      verifierConfig: {} as VerifierConfig,
      generateResponseCode: (async () =>
        new ResponseCode('hoge')) as GenerateResponseCode,
      createQueryWalletResponseRedirectUri: (() =>
        Result.success(
          new URL('https://example.com')
        )) as CreateQueryWalletResponseRedirectUri,
    };
    const postWalletResponse =
      createPostWalletResponseServiceInvoker(createParams);
    const authorizationResponse = new AuthorizationResponse.DirectPostJwt(
      'state',
      'jarm'
    );

    const result = await postWalletResponse(authorizationResponse);
    expect(result.isFailure);
    expect(result.exceptionOrUndefined()?.message).toBe(
      'Invalid presentation status'
    );
  });

  it('should throw error when the response mode of the presentation does not match the response mode of the authorization response', async () => {
    const createParams = {
      loadPresentationByRequestId: (async () =>
        ({
          __type: 'RequestObjectRetrieved',
          responseMode: ResponseModeOption.DirectPost,
        } as Presentation)) as LoadPresentationByRequestId,
      storePresentation: (async () => undefined) as StorePresentation,
      verifyJarmJwt: (async () =>
        Result.success({} as AuthorizationResponseData)) as VerifyJarmJwt,
      now: () => new Date(),
      verifierConfig: {} as VerifierConfig,
      generateResponseCode: (async () =>
        new ResponseCode('hoge')) as GenerateResponseCode,
      createQueryWalletResponseRedirectUri: (() =>
        Result.success(
          new URL('https://example.com')
        )) as CreateQueryWalletResponseRedirectUri,
    };
    const postWalletResponse =
      createPostWalletResponseServiceInvoker(createParams);
    const authorizationResponse = new AuthorizationResponse.DirectPostJwt(
      'state',
      'jarm'
    );

    const result = await postWalletResponse(authorizationResponse);
    expect(result.isFailure);
    expect(result.exceptionOrUndefined()?.message).toBe(
      'Unexpected response mode'
    );
  });
});
