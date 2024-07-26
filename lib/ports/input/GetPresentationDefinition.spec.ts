import { describe, it, expect, vi } from 'vitest';
import { GetPresentationDefinitionLive } from './GetPresentationDefinition';
import {
  EmbedOption,
  EphemeralEncryptionKeyPairJWK,
  GetWalletResponseMethod,
  Nonce,
  Presentation,
  PresentationType,
  RequestId,
  ResponseModeOption,
  TransactionId,
} from '../../domain';
import { QueryResponse } from './QueryResponse';
import { PresentationDefinition } from '../../../mock/prex/PresentationDefinition';

describe('GetPresentationDefinitionLive', () => {
  it('should return a QueryResponse.NotFound  when loadPresentationByRequestId returns undefiend', () => {
    const loadPresentationByRequestId = vi.fn().mockReturnValue(undefined);
    const getJarmJwksLive = new GetPresentationDefinitionLive(
      loadPresentationByRequestId
    );
    const result = getJarmJwksLive.invoke(new RequestId('test'));
    expect(result).toBe(QueryResponse.NotFound);
  });
  it('should return a QueryResponse.InvalidState when loadPresentationByRequestId returns invalid presentation', () => {
    const loadPresentationByRequestId = vi.fn().mockReturnValue({});
    const getJarmJwksLive = new GetPresentationDefinitionLive(
      loadPresentationByRequestId
    );
    const result = getJarmJwksLive.invoke(new RequestId('test'));
    expect(result).toBe(QueryResponse.InvalidState);
  });
  it('should return a QueryResponse.Found when loadPresentationByRequestId returns correct presentation', () => {
    const loadPresentationByRequestId = vi
      .fn()
      .mockReturnValue(
        new Presentation.Requested(
          new TransactionId('test'),
          new Date(),
          new PresentationType.VpTokenRequest(new PresentationDefinition()),
          new RequestId('test'),
          new Nonce('test'),
          new EphemeralEncryptionKeyPairJWK('test'),
          ResponseModeOption.DirectPostJwt,
          EmbedOption.ByValue,
          GetWalletResponseMethod.Redirect
        )
          .retrieveRequestObject(new Date())
          .getOrThrow()
      );
    const getJarmJwksLive = new GetPresentationDefinitionLive(
      loadPresentationByRequestId
    );
    const result = getJarmJwksLive.invoke(new RequestId('test'));
    expect(result).toBeInstanceOf(QueryResponse.Found);
  });
  it('should return a QueryResponse.Found when PresentationDefinition is invalid', () => {
    const loadPresentationByRequestId = vi
      .fn()
      .mockReturnValue(
        new Presentation.Requested(
          new TransactionId('test'),
          new Date(),
          new PresentationType.VpTokenRequest(undefined!),
          new RequestId('test'),
          new Nonce('test'),
          undefined,
          ResponseModeOption.DirectPostJwt,
          EmbedOption.ByValue,
          GetWalletResponseMethod.Redirect
        )
          .retrieveRequestObject(new Date())
          .getOrThrow()
      );
    const getJarmJwksLive = new GetPresentationDefinitionLive(
      loadPresentationByRequestId
    );
    const result = getJarmJwksLive.invoke(new RequestId('test'));
    expect(result).toBe(QueryResponse.InvalidState);
  });
});
