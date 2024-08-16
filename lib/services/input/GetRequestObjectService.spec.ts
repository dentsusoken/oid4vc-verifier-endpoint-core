import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { RequestId } from '../../domain';
import { Result } from '../../kotlin';
import { PresentationDefinition } from 'oid4vc-prex';
import {
  EmbedModeTO,
  IdTokenTypeTO,
  InitTransactionTO,
  PresentationTypeTO,
  ResponseModeTO,
} from '../../ports/input/InitTransaction.types';
import { MockConfiguration } from '../../di/MockConfiguration';
import { PortsInputImpl, PortsOutImpl } from '../../di';
import {
  LoadPresentationByRequestId,
  StorePresentation,
} from '../../ports/out/persistence';
import { SignRequestObject } from '../../ports/out/jose';
import {
  createGetRequestObjectServiceInvoker,
  GetRequestObjectServiceCreateParams,
} from './GetRequestObjectService';

describe('createGetRequestObjectServiceInvoker', async () => {
  it('should return Jwt on success', async () => {
    const configuration = new MockConfiguration();
    const portsOut = new PortsOutImpl(configuration);
    const portsInput = new PortsInputImpl(configuration, portsOut);
    const initTransaction = portsInput.initTransaction();
    const getRequestObject = portsInput.getRequestObject();
    const loadPresentationByRequestId = portsOut.loadPresentationByRequestId();

    const initTransactionTO: InitTransactionTO = {
      type: PresentationTypeTO.VpTokenRequest,
      idTokenType: IdTokenTypeTO.SubjectSigned,
      nonce: 'nonce',
      responseMode: ResponseModeTO.DirectPost,
      jarMode: EmbedModeTO.ByReference,
      presentationDefinition: new PresentationDefinition(),
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
    console.log(getRequestObjectResponse);
    expect(getRequestObjectResponse.__type === 'Found').toBe(true);
    expect(
      getRequestObjectResponse.__type === 'Found' &&
        getRequestObjectResponse.value.startsWith('eyJ')
    ).toBe(true);

    const presentation = await loadPresentationByRequestId(requestId);
    expect(presentation?.__type === 'RequestObjectRetrieved').toBe(true);
  });

  it('should throw error when presentation is not found', async () => {
    const configuration = new MockConfiguration();

    const createParams: GetRequestObjectServiceCreateParams = {
      loadPresentationByRequestId: (async () =>
        undefined) as LoadPresentationByRequestId,
      storePresentation: (async () => undefined) as StorePresentation,
      signRequestObject: (async () => Result.success('')) as SignRequestObject,
      now: () => new Date(),
      verifierConfig: configuration.verifierConfig(),
    };
    const getRequestObject = createGetRequestObjectServiceInvoker(createParams);

    const requestId = new RequestId('request-id');
    const response = await getRequestObject(requestId);
    console.log(response);

    expect(response.__type === 'NotFound').toBe(true);
    expect(response.__type === 'NotFound' ? response.message : undefined).toBe(
      `Presentation not found for requestId: ${requestId.value}`
    );
  });

  // it('should throw error when presentation type is not RequestObjectRetrieved', async () => {
  //   const createParams = {
  //     loadPresentationByRequestId: (async () =>
  //       ({
  //         __type: 'Requested',
  //       } as Presentation)) as LoadPresentationByRequestId,
  //     storePresentation: (async () => undefined) as StorePresentation,
  //     verifyJarmJwt: (async () =>
  //       Result.success({} as AuthorizationResponseData)) as VerifyJarmJwt,
  //     now: () => new Date(),
  //     verifierConfig: {} as VerifierConfig,
  //     generateResponseCode: (async () =>
  //       new ResponseCode('hoge')) as GenerateResponseCode,
  //     createQueryWalletResponseRedirectUri: (() =>
  //       Result.success(
  //         new URL('https://example.com')
  //       )) as CreateQueryWalletResponseRedirectUri,
  //   };
  //   const postWalletResponse =
  //     createPostWalletResponseServiceInvoker(createParams);
  //   const authorizationResponse = new AuthorizationResponse.DirectPostJwt(
  //     'state',
  //     'jarm'
  //   );

  //   const result = await postWalletResponse(authorizationResponse);
  //   expect(result.isFailure);
  //   expect(result.exceptionOrUndefined()?.message).toBe(
  //     'Invalid presentation status'
  //   );
  // });
});
