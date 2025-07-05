import { describe, it, expect } from 'vitest';
import { TransactionId } from '../../../domain';
import { Id, PresentationDefinition } from '@vecrea/oid4vc-prex';
import {
  EmbedModeTO,
  IdTokenTypeTO,
  InitTransactionTO,
  JwtSecuredAuthorizationRequestTO,
  PresentationTypeTO,
  ResponseModeTO,
} from '../../../ports/input/InitTransaction.types';
import { createInitTransactionServiceInvoker } from '../InitTransactionService';
import { MockConfiguration } from '../../../di/MockConfiguration';
import { PortsOutImpl, PortsInputImpl } from '../../../di';
import { PresentationInMemoryStore } from '../../../adapters/out/persistence';

describe('createInitTransactionServiceInvoker', async () => {
  const configuration = new MockConfiguration();
  const portsOut = new PortsOutImpl(configuration);
  const portsInput = new PortsInputImpl(configuration, portsOut);

  it('should return JwtSecuredAuthorizationRequestTO on success', async () => {
    const presentationStore = new PresentationInMemoryStore();

    const createParams = {
      generateTransactionId: portsOut.generateTransactionId(),
      generateRequestId: portsOut.generateRequestId(),
      storePresentation: presentationStore.storePresentation,
      signRequestObject: portsOut.signRequestObject(),
      verifierConfig: configuration.verifierConfig(),
      now: configuration.now(),
      generateEphemeralECDHPrivateJwk:
        portsOut.generateEphemeralECDHPrivateJwk(),
      jarByReference: configuration.jarByReference(),
      presentationDefinitionByReference:
        configuration.presentationDefinitionByReference(),
      createQueryWalletResponseRedirectUri:
        portsOut.createQueryWalletResponseRedirectUri(),
    };

    const initTransaction = createInitTransactionServiceInvoker(createParams);

    const initTransactionTO: InitTransactionTO = {
      type: PresentationTypeTO.VpTokenRequest,
      idTokenType: IdTokenTypeTO.SubjectSigned,
      nonce: 'nonce',
      responseMode: ResponseModeTO.DirectPost,
      jarMode: EmbedModeTO.ByReference,
      presentationDefinition: new PresentationDefinition(new Id('id')),
      presentationDefinitionMode: EmbedModeTO.ByValue,
      redirectUriTemplate: 'https://example.com/redirect/{RESPONSE_CODE}',
    } as InitTransactionTO;

    const result = await initTransaction(initTransactionTO);

    expect(result.isSuccess()).toBe(true);
    const requestTO = result.getOrThrow();
    //console.log(requestTO);
    expect(requestTO).toBeInstanceOf(JwtSecuredAuthorizationRequestTO);
    expect(requestTO.transactionId).toBeDefined();
    expect(requestTO.clientId).toBe('Verifier');
    expect(requestTO.request).toBeUndefined();
    //console.log(requestTO.requestUri);
    expect(
      requestTO.requestUri?.startsWith(
        'http://localhost:8080/wallet/request.jwt/'
      )
    ).toBe(true);
    const presentation = await presentationStore.loadPresentationById(
      new TransactionId(requestTO.transactionId!)
    );
    expect(presentation!.__type === 'Requested');
  });

  it('should return JwtSecuredAuthorizationRequestTO on success via PortsInput', async () => {
    const loadPresentationById = portsOut.loadPresentationById();
    const initTransaction = portsInput.initTransaction();

    const initTransactionTO: InitTransactionTO = {
      type: PresentationTypeTO.VpTokenRequest,
      idTokenType: IdTokenTypeTO.SubjectSigned,
      nonce: 'nonce',
      responseMode: ResponseModeTO.DirectPost,
      jarMode: EmbedModeTO.ByReference,
      presentationDefinition: new PresentationDefinition(new Id('id')),
      presentationDefinitionMode: EmbedModeTO.ByValue,
      redirectUriTemplate: 'https://example.com/redirect/{RESPONSE_CODE}',
    } as InitTransactionTO;

    const result = await initTransaction(initTransactionTO);

    expect(result.isSuccess()).toBe(true);
    const requestTO = result.getOrThrow();
    //console.log(requestTO);
    expect(requestTO).toBeInstanceOf(JwtSecuredAuthorizationRequestTO);
    expect(requestTO.transactionId).toBeDefined();
    expect(requestTO.clientId).toBe('Verifier');
    expect(requestTO.request).toBeUndefined();
    //console.log(requestTO.requestUri);
    expect(
      requestTO.requestUri?.startsWith(
        'http://localhost:8080/wallet/request.jwt/'
      )
    ).toBe(true);
    const presentation = await loadPresentationById(
      new TransactionId(requestTO.transactionId!)
    );
    expect(presentation!.__type === 'Requested');
  });
});
