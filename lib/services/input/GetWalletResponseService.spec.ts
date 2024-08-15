import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import {
  Presentation,
  VerifierConfig,
  RequestId,
  AuthorizationResponseData,
  ResponseCode,
  AuthorizationResponse,
  ResponseModeOption,
} from '../../domain';
import { PresentationDefinition, PresentationSubmission } from 'oid4vc-prex';
import {
  EmbedModeTO,
  IdTokenTypeTO,
  InitTransactionTO,
  PresentationTypeTO,
  ResponseModeTO,
} from '../../ports/input/InitTransaction.types';
import { CompactEncrypt, importJWK } from 'jose';
import {
  LoadPresentationByRequestId,
  StorePresentation,
} from '../../ports/out/persistence';
import { createPostWalletResponseServiceInvoker } from './PostWalletResponseService';
import { VerifyJarmJwt } from '../../ports/out/jose';
import { Result } from '../../kotlin';
import {
  CreateQueryWalletResponseRedirectUri,
  GenerateResponseCode,
} from '../../ports/out/cfg';
import { MockConfiguration } from '../../di/MockConfiguration';
import { PortsInputImpl, PortsOutImpl } from '../../di';
import { WalletResponseTO } from '../../ports/input';

describe('createGetRequestObjectServiceInvoker', async () => {
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
    const presentationSubmissionJsonStr = JSON.stringify(
      presentationSubmission
    );
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
    console.log(getWalletResponseResponse);
  });
});
