import { describe, it, expect } from 'vitest';
import { RequestId } from '../../domain';
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
