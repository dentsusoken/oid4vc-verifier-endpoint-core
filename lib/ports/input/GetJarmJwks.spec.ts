import { describe, expect, it, vi } from 'vitest';
import { GetJarmJwksLive, ephemeralEcPubKey } from './GetJarmJwks';
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
import { PresentationDefinition } from '../../../mock/prex/PresentationDefinition';
import { QueryResponse } from './QueryResponse';
import { LoadPresentationByRequestId } from '../out/persistence';

const jwk = {
  p: '8ORn4_vDk_4QTOKLe3RNOYxGV2codzLw85aPm7Ip_5tHme6yWBp0iBxkVJ32wFJCyYFLdLwUrrn-2As8epMXwKmLAM5uDMPawz5hIn9tUw07ETALqv_eo52OaENwXH5QcWJLser0p-7V2IQXfd4pxWTCxdPlGHC9u4qhv2rH750',
  kty: 'RSA',
  q: 'xMLDTsLMAB8bVBunieLqFFZSrfSHEyLRZn_8WykblZtjcDrJd3QNzWwjBM7uhDbPL1lH2TqDetp34RtAeYJut7H0uFGrDPh8l2soae1wnTNQ8l6ZboFAHk-jfrVOhxA9-SQHYWdW7QUzZNxYkhhme3o2y20aeQh5qn2OoFwXfhE',
  d: 'GSkPxaoQlEKNG6euv0x_ILu4ZBM7Ivrz8nfnpkuha5dSiWMRym4333u2shYvvUHFoz-qWcTZWbeFY4Ro0_AjVbCGwVnOwnU-XQSKgnBSPevUYRvY4juNrs9LlaSduxQyMYcy0jeQ7LZgbd8b1ANUTg3eDVW0LaUAhHMPg2U9-S3_44gU3N9Qwtoo_pcHC7A01xC5JZtKWuNLA75cm2IRbugv_KHxaVsx4KfHdR_9NaeBGL94QxRxAKku1gg9uvAKojGWOiC88I0FnbOwngOUxey5HBNVx_gTpnjDrU8C3EqJctX2oiP0_NFSOEFrulcgzcd-IObtu29jk0F1Af1hgQ',
  e: 'AQAB',
  qi: 'SZHBwq1gTtdwtOW9_6RVAfRYs_bqxSjLAw2OdxTiTJe1SNqGiB4AiUtXyADWLyWZYF8g73LJmS-3AHKZ3JN-vYi70iqtyIJJVcl0nfjBEWoYj1waHzkKCd2N4q6XsKWhWD5uRo5u-Lu9UVJc3g_dd1LzYsixaWwT-3DXnQZ-qBs',
  dp: '2sLSBhyRFEjZjLj_anHH38cf6ifoe7drUgsdB4vY0CO39nbqx0_fG-yMwLtjZmxN8qjUWYKkVbjbUl-B4N7L508QyP6uujDy7fQsSiPmqFGPnqA_OF99VKC0vsLfu1-Kti1KCJ0S6Z7f3Oy4WLn0vSowJ2-y0WsxIqtXEHpsb5E',
  dq: 'ThuCrKFnmiS_FIRl3bbWdXxPFf8cH9ySg74Kz6Vh7eHhd4verizDzeg_fokm5hVb6c_nVbSEvSA8tn-6-IFusj1SiFjjLiL2UqWXRXWcXssgNxaWked9LIswu_v9UGCCOYSz6Va8ixqlbESMZHKLPDknx1loSOO0aJmvJLlqGgE',
  n: 'uSYkaV-N5JwuK3wS08TbEdiYOdLKbQ9RnkONqNNSlv0DpGh98dueM7qAI1LlBYFDASE3oieHAE__230MmaOmts_k60M1TN0DOhcY3RIDg4mjWqrM86cBC5VeXfF-o-ZldfNcxV88MwfLO1-J5EQTlg1XMDn-JECQr1SQ1ChIKUiCeVlQ5W3DqZX60Bfu01BigL0D7i5cWUGD-FjPEQsyeZMmWvrdC-kpFvo3XDUwAGGPFKfqLXWdG5Gr2QYATkK8QlMuVoK9NwW5XjTRhNh_513Se_lCiCE398juVRfjImbMaTfPbfbut2TK5z1p7VUSgNDcv6194U3n6z53clEvbQ',
};
const jwkString = JSON.stringify(jwk);

// TODO Test GetJarmJwksLive class after LoadPresentationByRequestId is implemented

describe('GetJarmJwksLive', () => {
  it('should return a QueryResponse.NotFound  when loadPresentationByRequestId returns undefiend', async () => {
    const loadPresentationByRequestId = vi.fn().mockReturnValue(undefined);
    const getJarmJwksLive = new GetJarmJwksLive(loadPresentationByRequestId);
    const result = await getJarmJwksLive.invoke(new RequestId('test'));
    expect(result).toBe(QueryResponse.NotFound);
  });
  it('should return a QueryResponse.InvalidState when loadPresentationByRequestId returns invalid presentation', async () => {
    const loadPresentationByRequestId = vi.fn().mockReturnValue({});
    const getJarmJwksLive = new GetJarmJwksLive(loadPresentationByRequestId);
    const result = await getJarmJwksLive.invoke(new RequestId('test'));
    expect(result).toBe(QueryResponse.InvalidState);
  });
  it('should return a QueryResponse.Found when loadPresentationByRequestId returns correct presentation', async () => {
    const loadPresentationByRequestId: LoadPresentationByRequestId = async (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      requestId: RequestId
    ) =>
      new Presentation.Requested(
        new TransactionId('test'),
        new Date(),
        new PresentationType.VpTokenRequest(new PresentationDefinition()),
        new RequestId('test'),
        new Nonce('test'),
        new EphemeralEncryptionKeyPairJWK(jwkString),
        ResponseModeOption.DirectPostJwt,
        EmbedOption.ByValue,
        GetWalletResponseMethod.Redirect
      )
        .retrieveRequestObject(new Date())
        .getOrThrow();
    const getJarmJwksLive = new GetJarmJwksLive(loadPresentationByRequestId);
    const result = await getJarmJwksLive.invoke(new RequestId('test'));
    expect(result).toBeInstanceOf(QueryResponse.Found);
  });
  it('should return a QueryResponse.Found when EphemeralEncryptionKeyPairJWK is invalid', async () => {
    const loadPresentationByRequestId = vi
      .fn()
      .mockReturnValue(
        new Presentation.Requested(
          new TransactionId('test'),
          new Date(),
          new PresentationType.VpTokenRequest(new PresentationDefinition()),
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
    const getJarmJwksLive = new GetJarmJwksLive(loadPresentationByRequestId);
    const result = await getJarmJwksLive.invoke(new RequestId('test'));
    expect(result).toBe(QueryResponse.InvalidState);
  });
});

describe('ephemeralEcPubKey', () => {
  it('should return a public key', async () => {
    // ephemeralEcPubKey;
    const presentation = new Presentation.Requested(
      new TransactionId('test'),
      new Date(),
      new PresentationType.VpTokenRequest(new PresentationDefinition()),
      new RequestId('test'),
      new Nonce('test'),
      new EphemeralEncryptionKeyPairJWK(jwkString),
      ResponseModeOption.DirectPostJwt,
      EmbedOption.ByValue,
      GetWalletResponseMethod.Redirect
    )
      .retrieveRequestObject(new Date())
      .getOrThrow();

    const result = await ephemeralEcPubKey(presentation);
    expect(result).toBeDefined();
  });
});
