import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import {
  TransactionId,
  AuthorizationResponse,
  RequestId,
  Presentation,
  ResponseCode,
} from '../../domain';
import {
  Id,
  PresentationDefinition,
  PresentationSubmission,
} from 'oid4vc-prex';
import {
  EmbedModeTO,
  IdTokenTypeTO,
  InitTransactionTO,
  PresentationTypeTO,
  ResponseModeTO,
} from '../../ports/input/InitTransaction.types';
import { CompactEncrypt, importJWK } from 'jose';
import { MockConfiguration } from '../../di/MockConfiguration';
import { PortsInputImpl, PortsOutImpl } from '../../di';
import { WalletResponseTO } from '../../ports/input';
import {
  GetWalletResponseCreateParams,
  createGetWalletResponseServiceInvoker,
} from './GetWalletResponseService';
import { LoadPresentationById } from '../../ports/out/persistence';

describe('createGetWalletResponseServiceInvoker', async () => {
  it('should return WalletResponseAcceptedTO when GetWalletResponseMethod.Redirect', async () => {
    const configuration = new MockConfiguration();
    const portsOut = new PortsOutImpl(configuration);
    const portsInput = new PortsInputImpl(configuration, portsOut);
    const initTransaction = portsInput.initTransaction();
    const getRequestObject = portsInput.getRequestObject();
    const postWalletResponse = portsInput.postWalletResponse();
    const getWalletResponse = portsInput.getWalletResponse();
    const loadPresentationByRequestId = portsOut.loadPresentationByRequestId();

    const initTransactionTO: InitTransactionTO = {
      type: PresentationTypeTO.VpTokenRequest,
      idTokenType: IdTokenTypeTO.SubjectSigned,
      nonce: 'nonce',
      responseMode: ResponseModeTO.DirectPostJwt,
      jarMode: EmbedModeTO.ByReference,
      presentationDefinition: new PresentationDefinition(new Id('id')),
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
    const payload = {
      state: presentation.requestId.value,
      vp_token: 'vpToken',
      presentation_submission: presentationSubmission,
    };

    const enc = new CompactEncrypt(
      new TextEncoder().encode(JSON.stringify(payload))
    ).setProtectedHeader({ alg: 'ECDH-ES+A256KW', enc: 'A256GCM' });

    const verifierPrivateJwk = JSON.parse(
      presentation.ephemeralECDHPrivateJwk!.value
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

    const getWalletResponseResponse = await getWalletResponse(
      submitted.id,
      submitted.responseCode
    );
    expect(getWalletResponseResponse.__type === 'Found').toBe(true);
    const walletResponseTO = (
      getWalletResponseResponse.__type === 'Found'
        ? getWalletResponseResponse.value
        : undefined
    )!;
    expect(walletResponseTO).toBeInstanceOf(WalletResponseTO);
    expect(walletResponseTO.vpToken).toBe('vpToken');
    expect(walletResponseTO.presentationSubmission).toBeInstanceOf(
      PresentationSubmission
    );
    //console.log(getWalletResponseResponse);
  });

  it('should return NotFound when presentation is not found', async () => {
    const configuration = new MockConfiguration();

    const createParams: GetWalletResponseCreateParams = {
      loadPresentationById: (async () => undefined) as LoadPresentationById,
      now: configuration.now(),
      maxAge: configuration.maxAge(),
    };
    const getWalletResponse =
      createGetWalletResponseServiceInvoker(createParams);

    const transactionId = new TransactionId('transaction-id');
    const response = await getWalletResponse(transactionId, undefined);

    expect(response.__type === 'NotFound').toBe(true);
    expect(response.__type === 'NotFound' ? response.message : undefined).toBe(
      `Presentation not found for transactionId: transaction-id`
    );
  });

  it('should return InvalidState when presentation type is not Submitted', async () => {
    const configuration = new MockConfiguration();

    const createParams: GetWalletResponseCreateParams = {
      loadPresentationById: (async () =>
        ({
          __type: 'Requested',
        } as Presentation.Requested)) as LoadPresentationById,
      now: configuration.now(),
      maxAge: configuration.maxAge(),
    };
    const getWalletResponse =
      createGetWalletResponseServiceInvoker(createParams);

    const transactionId = new TransactionId('transaction-id');
    const response = await getWalletResponse(transactionId, undefined);

    expect(response.__type === 'InvalidState').toBe(true);
    expect(
      response.__type === 'InvalidState' ? response.message : undefined
    ).toBe(
      `Invalid presentation state. Expected 'Submitted', but found 'Requested'.`
    );
  });

  it('should return InvalidState when response code of presentation is diffrent from response code of argument', async () => {
    const configuration = new MockConfiguration();

    const createParams: GetWalletResponseCreateParams = {
      loadPresentationById: (async () =>
        ({
          __type: 'Submitted',
        } as Presentation.Submitted)) as LoadPresentationById,
      now: configuration.now(),
      maxAge: configuration.maxAge(),
    };
    const getWalletResponse =
      createGetWalletResponseServiceInvoker(createParams);

    const transactionId = new TransactionId('transaction-id');
    const response = await getWalletResponse(
      transactionId,
      new ResponseCode('response-code')
    );

    expect(response.__type === 'InvalidState').toBe(true);
    expect(
      response.__type === 'InvalidState' ? response.message : undefined
    ).toBe(
      `Invalid response code. Expected 'undefined', but found 'response-code'.`
    );
  });

  it('should return InvalidState when presentation is expired', async () => {
    const configuration = new MockConfiguration();

    const createParams: GetWalletResponseCreateParams = {
      loadPresentationById: (async () =>
        ({
          __type: 'Submitted',
          initiatedAt: new Date(
            configuration.now()().getTime() -
              configuration.maxAge().toMillis() -
              10000
          ),
        } as Presentation.Submitted)) as LoadPresentationById,
      now: configuration.now(),
      maxAge: configuration.maxAge(),
    };
    const getWalletResponse =
      createGetWalletResponseServiceInvoker(createParams);

    const transactionId = new TransactionId('transaction-id');
    const response = await getWalletResponse(transactionId, undefined);

    expect(response.__type === 'InvalidState').toBe(true);
    expect(
      (response.__type === 'InvalidState'
        ? response.message
        : undefined)!.startsWith('Presentation has expired. Current time:')
    ).toBe(true);
  });
});
