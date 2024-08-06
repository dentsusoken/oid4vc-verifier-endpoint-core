import { describe, it, expect, vi } from 'vitest';
import { GetPresentationDefinitionLive } from './GetPresentationDefinition';
import {
  EmbedOptionNS,
  EphemeralECDHPrivateJwk,
  GetWalletResponseMethodNS,
  Nonce,
  PresentationNS,
  PresentationTypeNS,
  RequestId,
  ResponseModeOption,
  TransactionId,
} from '../../domain';
import { QueryResponse } from './QueryResponse';
import { PresentationDefinition } from '../../../mock/prex/PresentationDefinition';

describe('GetPresentationDefinitionLive', () => {
  it('should return a QueryResponse.NotFound  when loadPresentationByRequestId returns undefiend', async () => {
    const loadPresentationByRequestId = vi.fn().mockReturnValue(undefined);
    const getJarmJwksLive = new GetPresentationDefinitionLive(
      loadPresentationByRequestId
    );
    const result = await getJarmJwksLive.invoke(new RequestId('test'));
    expect(result).toBe(QueryResponse.NotFound);
  });
  it('should return a QueryResponse.InvalidState when loadPresentationByRequestId returns invalid presentation', async () => {
    const loadPresentationByRequestId = vi.fn().mockReturnValue({});
    const getJarmJwksLive = new GetPresentationDefinitionLive(
      loadPresentationByRequestId
    );
    const result = await getJarmJwksLive.invoke(new RequestId('test'));
    expect(result).toBe(QueryResponse.InvalidState);
  });
  it('should return a QueryResponse.Found when loadPresentationByRequestId returns correct presentation', async () => {
    const loadPresentationByRequestId = vi
      .fn()
      .mockReturnValue(
        new PresentationNS.Requested(
          new TransactionId('test'),
          new Date(),
          new PresentationTypeNS.VpTokenRequest(new PresentationDefinition()),
          new RequestId('test'),
          new Nonce('test'),
          new EphemeralEncryptionPrivateJwk('test'),
          ResponseModeOption.DirectPostJwt,
          EmbedOptionNS.ByValue,
          GetWalletResponseMethodNS.Redirect
        )
          .retrieveRequestObject(new Date())
          .getOrThrow()
      );
    const getJarmJwksLive = new GetPresentationDefinitionLive(
      loadPresentationByRequestId
    );
    const result = await getJarmJwksLive.invoke(new RequestId('test'));
    expect(result).toBeInstanceOf(QueryResponse.Found);
  });
  it('should return a QueryResponse.Found when PresentationDefinition is invalid', async () => {
    const loadPresentationByRequestId = vi
      .fn()
      .mockReturnValue(
        new PresentationNS.Requested(
          new TransactionId('test'),
          new Date(),
          new PresentationTypeNS.VpTokenRequest(undefined!),
          new RequestId('test'),
          new Nonce('test'),
          undefined,
          ResponseModeOption.DirectPostJwt,
          EmbedOptionNS.ByValue,
          GetWalletResponseMethodNS.Redirect
        )
          .retrieveRequestObject(new Date())
          .getOrThrow()
      );
    const getJarmJwksLive = new GetPresentationDefinitionLive(
      loadPresentationByRequestId
    );
    const result = await getJarmJwksLive.invoke(new RequestId('test'));
    expect(result).toBe(QueryResponse.InvalidState);
  });
});
