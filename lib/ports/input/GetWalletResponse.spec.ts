import { describe, expect, it, vi } from 'vitest';
import { GetWalletResponseLive, toTo } from './GetWalletResponse';
import {
  EmbedOptionNS,
  EphemeralECDHPrivateJwk,
  GetWalletResponseMethodNS,
  Nonce,
  PresentationNS,
  PresentationTypeNS,
  RequestId,
  ResponseCode,
  ResponseModeOption,
  TransactionId,
  WalletResponseNS,
} from '../../domain';
import {
  PresentationDefinition,
  PresentationSubmission,
} from '../../../mock/prex';
import { QueryResponse } from './QueryResponse';

describe('GetWalletResponseTO', () => {
  it('should have idToken parameter', () => {
    const walletResponse = new WalletResponseNS.IdToken('test');
    const result = toTo(walletResponse);
    expect(result.idToken).toBe('test');
    expect(result.vpToken).toBeUndefined();
    expect(result.presentationSubmission).toBeUndefined();
    expect(result.error).toBeUndefined();
    expect(result.errorDescription).toBeUndefined();
  });
  it('should have vpToken parameter', () => {
    const walletResponse = new WalletResponseNS.VpToken(
      'test',
      new PresentationSubmission()
    );
    const result = toTo(walletResponse);
    expect(result.idToken).toBeUndefined();
    expect(result.vpToken).toBe('test');
    // TODO fix this expectation - after PresentationSubmission is implemented
    expect(result.presentationSubmission).toBeDefined();
    expect(result.error).toBeUndefined();
    expect(result.errorDescription).toBeUndefined();
  });
  it('should have IdAndVpToken parameter', () => {
    const walletResponse = new WalletResponseNS.IdAndVpToken(
      'id_test',
      'vp_test',
      new PresentationSubmission()
    );
    const result = toTo(walletResponse);
    expect(result.idToken).toBe('id_test');
    expect(result.vpToken).toBe('vp_test');
    // TODO fix this expectation - after PresentationSubmission is implemented
    expect(result.presentationSubmission).toBeDefined();
    expect(result.error).toBeUndefined();
    expect(result.errorDescription).toBeUndefined();
  });
  it('should have Error parameter', () => {
    const walletResponse = new WalletResponseNS.Error('error', 'description');
    const result = toTo(walletResponse);
    expect(result.idToken).toBeUndefined();
    expect(result.vpToken).toBeUndefined();
    expect(result.presentationSubmission).toBeUndefined();
    expect(result.error).toBe('error');
    expect(result.errorDescription).toBe('description');
  });
});

describe('GetWalletResponseLive', () => {
  const requestd = new PresentationNS.Requested(
    new TransactionId('test'),
    new Date(),
    new PresentationTypeNS.VpTokenRequest(new PresentationDefinition()),
    new RequestId('test'),
    new Nonce('test'),
    new EphemeralEncryptionPrivateJwk('test'),
    ResponseModeOption.DirectPostJwt,
    EmbedOptionNS.ByValue,
    GetWalletResponseMethodNS.Redirect
  );
  const retrieve = requestd.retrieveRequestObject(new Date()).getOrThrow();
  it('should return QueryResponse.Found when presentaion.responseCode === responseCode in args', async () => {
    const submitted = retrieve
      .submit(
        new Date(),
        new WalletResponseNS.IdToken('test'),
        new ResponseCode('test')
      )
      .getOrThrow();

    const loadPresentationById = vi.fn().mockReturnValue(submitted);

    const instance = new GetWalletResponseLive(loadPresentationById);
    const result = await instance.invoke(
      new TransactionId('test'),
      new ResponseCode('test')
    );
    expect(result).toBeInstanceOf(QueryResponse.Found);
  });
  it('should return QueryResponse.Found when both presentaion.responseCode and responseCode in args are undefined', async () => {
    const submitted = retrieve
      .submit(new Date(), new WalletResponseNS.IdToken('test'), undefined)
      .getOrThrow();

    const loadPresentationById = vi.fn().mockReturnValue(submitted);

    const instance = new GetWalletResponseLive(loadPresentationById);
    const result = await instance.invoke(new TransactionId('test'));
    expect(result).toBeInstanceOf(QueryResponse.Found);
  });
  describe('should return QueryResponse.InvalidState when presentaion.responseCode or responseCode in args are undefined', () => {
    it('presentaion.responseCode is undefined', async () => {
      const submitted = retrieve
        .submit(new Date(), new WalletResponseNS.IdToken('test'), undefined)
        .getOrThrow();

      const loadPresentationById = vi.fn().mockReturnValue(submitted);

      const instance = new GetWalletResponseLive(loadPresentationById);
      const result = await instance.invoke(
        new TransactionId('test'),
        new ResponseCode('test')
      );
      expect(result).toBe(QueryResponse.InvalidState);
    });
    it('responseCode in args is undefined', async () => {
      const submitted = retrieve
        .submit(
          new Date(),
          new WalletResponseNS.IdToken('test'),
          new ResponseCode('test')
        )
        .getOrThrow();

      const loadPresentationById = vi.fn().mockReturnValue(submitted);

      const instance = new GetWalletResponseLive(loadPresentationById);
      const result = await instance.invoke(new TransactionId('test'));
      expect(result).toBe(QueryResponse.InvalidState);
    });
  });
  it('should return a QueryResponse.NotFound  when loadPresentationByRequestId returns undefiend', async () => {
    const loadPresentationByRequestId = vi.fn().mockReturnValue(undefined);
    const getJarmJwksLive = new GetWalletResponseLive(
      loadPresentationByRequestId
    );
    const result = await getJarmJwksLive.invoke(new RequestId('test'));
    expect(result).toBe(QueryResponse.NotFound);
  });
  it('should return a QueryResponse.InvalidState when loadPresentationByRequestId returns invalid presentation', async () => {
    const loadPresentationByRequestId = vi.fn().mockReturnValue({});
    const getJarmJwksLive = new GetWalletResponseLive(
      loadPresentationByRequestId
    );
    const result = await getJarmJwksLive.invoke(new RequestId('test'));
    expect(result).toBe(QueryResponse.InvalidState);
  });
});
