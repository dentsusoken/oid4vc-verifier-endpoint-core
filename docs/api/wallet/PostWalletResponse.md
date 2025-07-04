# Post Wallet Response

## 概要

Wallet から Verifier に対して認可レスポンスを返すためのエンドポイント。

## URL

https://oid4vc-verifier-endpoint-hono.g-trustedweb.workers.dev/wallet/direct_post/

## リクエスト

### メソッド

- POST

### パラメータ

| パラメータ | 型     | 必須 | 説明                                                                                                                                                                                                                                                                                                                            |
| ---------- | ------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| state      | string | No   | [Get Authorization Request](GetAuthorizationRequest.md)のレスポンスパラメータの`state`パラメータ。                                                                                                                                                                                                                              |
| response   | string | No   | Verifierの公開鍵（[Get Authorization Request](GetAuthorizationRequest.md)のレスポンスパラメータの`client_metadata.jwks`または`client_metadata.jwks_uri`から取得）を使用して暗号化されたJWE形式の文字列。暗号化前のペイロードには後述のパラメータを含む。詳細は[JARM](https://openid.net/specs/oauth-v2-jarm.html)の仕様を参照。 |

#### JWEの構造

##### ヘッダーパラメータ

| パラメータ | 説明                         | 許容される値          |
| ---------- | ---------------------------- | --------------------- |
| alg        | 鍵管理アルゴリズム           | ECDH-ES+A256KW        |
| enc        | コンテンツ暗号化アルゴリズム | A256GCM               |
| kid        | 公開鍵のID                   | Verifierの公開鍵のkid |
| epk        | 一時的な公開鍵情報           | EC公開鍵（P-256）     |

##### ペイロードパラメータ

| パラメータ              | 型     | 必須 | 説明                                                                                                                                                                                                                                             |
| ----------------------- | ------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| vp_token                | string | No   | vp_token を示す文字列、[Get Authorization Request](GetAuthorizationRequest.md)のレスポンスパラメータの`response_type`が`vp_token`の場合は必須。                                                                                                  |
| presentation_submission | JSON   | No   | [presentation_submission](https://github.com/dentsusoken/oid4vc-prex/blob/main/docs/PresentationSubmission.md) のJSON、 [Get Authorization Request](GetAuthorizationRequest.md)のレスポンスパラメータの`response_type`が`vp_token`の場合は必須。 |
| state                   | string | No   | [Get Authorization Request](GetAuthorizationRequest.md)のレスポンスパラメータの`state`パラメータ。                                                                                                                                               |

サンプルペイロード:

```json
{
  "vp_token": "o2d2ZXJzaW9uYzEuMGlkb2N1bWVudHOBo2dkb2NUeXBldW9yZy5pc28uMTgwMTMuNS4xLm1ETGxpc3N1ZXJTaWduZWSiam5hbWVTcGFjZXOhcW9yZy5pc28uMTgwMTMuNS4xgtgYWFKkaGRpZ2VzdElEAWZyYW5kb21QSAgsu9yxmrqDa9shKK4cRHFlbGVtZW50SWRlbnRpZmllcmpnaXZlbl9uYW1lbGVsZW1lbnRWYWx1ZWRJbmdh2BhYW6RoZGlnZXN0SUQCZnJhbmRvbVBhDm5iv14nW8ZrvzbGPs2fcWVsZW1lbnRJZGVudGlmaWVyb2RvY3VtZW50X251bWJlcmxlbGVtZW50VmFsdWVoMTIzNDU2NzhqaXNzdWVyQXV0aIRDoQEmoRghWQGyMIIBrjCCAVWgAwIBAgIUO4JGOFKhSzaYPysIXdnNmA3kjrswCgYIKoZIzj0EAwIwLTErMCkGA1UEAwwidHcyNC1vYXV0aC1zZXJ2ZXIuYW4uci5hcHBzcG90LmNvbTAeFw0yNDAzMjcwNzM2NDFaFw0zNDAzMjUwNzM2NDFaMC0xKzApBgNVBAMMInR3MjQtb2F1dGgtc2VydmVyLmFuLnIuYXBwc3BvdC5jb20wWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAATKHMBkz8Dyo_Ch5_KzRVJP1W0hqg9StzjL3mRLVfQmX-wUMMY91qsuF3iXu-9g9h2ePUHMuVIbhVgtM-932iywo1MwUTAdBgNVHQ4EFgQUUYVneVlglmWCf588GqePoPTyFA4wHwYDVR0jBBgwFoAUUYVneVlglmWCf588GqePoPTyFA4wDwYDVR0TAQH_BAUwAwEB_zAKBggqhkjOPQQDAgNHADBEAiAyGPiRDxjQASnL-p-Ew18nFQAxiy9CQhqiduJ1DA5yFwIgSN-9boIrs1Y8luK_Ev8eFmQx5wPByP97jOJ3tY64DQxZAdnYGFkB1KZndmVyc2lvbmMxLjBvZGlnZXN0QWxnb3JpdGhtZ1NIQS0yNTZsdmFsdWVEaWdlc3RzoXFvcmcuaXNvLjE4MDEzLjUuMaIBWCC6Iwll1JcdH0u8zVabyfSZOz8ALHsnANTm-YJ_zZq_UQJYIEgLyoWipw94FZOKaXrdJMLHXnO2CREZMkWPZQvDvt8DbWRldmljZUtleUluZm-iaWRldmljZUtleaYBAgJYJEQ0M0FFRDU4LUIwQjktNEQ3Mi1BODZGLUVCOTE3Njg5RUMyNwMmIAEhWCDt9Ys7frGcrv7gHzyvFU5rrcqdlErVPoPL5fcntBE97iJYIAzkKtfg2Bp3ZhNyOY9XrRRS_2je5S9OKQJrscjuZPUocWtleUF1dGhvcml6YXRpb25zoWpuYW1lU3BhY2VzgXFvcmcuaXNvLjE4MDEzLjUuMWdkb2NUeXBldW9yZy5pc28uMTgwMTMuNS4xLm1ETGx2YWxpZGl0eUluZm-jZnNpZ25lZMB0MjAyNC0xMi0wNlQwMTowMzo0NlppdmFsaWRGcm9twHQyMDI0LTEyLTA2VDAxOjAzOjQ2Wmp2YWxpZFVudGlswHQyMDI1LTEyLTA2VDAxOjAzOjQ2WlhApdEpNgUsOsamsXaF9DkODnSqHzb1Z549tjkm36ydX2Ne6hTD37ow7MzrxsiQriOBAz-7fP2esHL6P9z2PCQR62xkZXZpY2VTaWduZWSiam5hbWVTcGFjZXPYGEGgamRldmljZUF1dGihb2RldmljZVNpZ25hdHVyZYRDoQEmoPZYQGikrcu_Gb8ay6Jbh5pLd76JBeqibEziur2fJUemJtQKhSstFpxG1cY1GHHtv5Qc2NF0t0uk2LtN8VPkHeiogC9mc3RhdHVzAA",
  "presentation_submission": {
    "id": "8826D44D-E79C-4609-B3FC-D1A5A381088F",
    "definition_id": "7bfdafcc-4530-4ceb-b641-1bcaccaaad3f",
    "descriptor_map": [
      { "id": "org.iso.18013.5.1.mDL", "format": "mso_mdoc", "path": "$" }
    ]
  },
  "state": "9FvvJaVr5Aad60rEz7jGexUbYl4jeFRgVpdNrGImjgaW7LF7W5odSCHhCc_gzJxAmuVLGzO27k3aPMJC_O3PLw"
}
```

#### TypeScriptによるJWE作成サンプル

```typescript
import * as jose from 'jose';

async function createJWE(payload: string | object, publicKey: jose.JWK) {
  try {
    const ephemeralKeyPair = await jose.generateKeyPair('ES256');
    const rawEpk = await jose.exportJWK(ephemeralKeyPair.publicKey);

    const enc = new jose.CompactEncrypt(
      new TextEncoder().encode(
        typeof payload === 'string' ? payload : JSON.stringify(payload)
      )
    );

    enc.setProtectedHeader({
      alg: 'ECDH-ES+A256KW',
      enc: 'A256GCM',
      kid: publicKey.kid,
      epk: {
        kty: 'EC',
        crv: 'P-256',
        x: rawEpk.x,
        y: rawEpk.y,
      },
    });

    const jwe = await enc.encrypt(
      await jose.importJWK({
        ...publicKey,
        alg: 'ECDH-ES+A256KW',
      })
    );
    return jwe;
  } catch (error) {
    console.error('JWE creation error:', error);
    throw error;
  }
}

const payload = {
  vp_token: "...",
  presentation_submission: {
    id: "8826D44D-E79C-4609-B3FC-D1A5A381088F",
    definition_id: "7bfdafcc-4530-4ceb-b641-1bcaccaaad3f",
    descriptor_map: [
      { id: "org.iso.18013.5.1.mDL", format: "mso_mdoc", path: "$" }
    ]
  },
  state: "..."
};

const publicKey = {
  kty: 'EC',
  crv: 'P-256',
  x: 'pCwoicSWU-iYbFOE1e9zWpRsEF4SCvlLP9Y9hCECjdA',
  y: 'cYam1clmctfGPoopuZV4uByYT69fc-I4Iqosy3_1E4c',
  kid: '55a67782-2a82-491c-9852-2988d2901416',
  use: 'enc',
  alg: 'ECDH-ES'
};

createJWE(payload, publicKey)
  .then(jwe => console.log(jwe))
  .catch(error => console.error('Error:', error));
```

## レスポンス

### フォーマット

- JSON

### パラメータ

| パラメータ   | 型     | 必須 | 説明                                                                                                                                                                                                            |
| ------------ | ------ | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| redirect_uri | string | No   | Wallet から Verifier にリダイレクトする URI を指定するパラメータ、[Initiate Transaction](../frontend/InitiateTransaction.md)のリクエストパラメータに`wallet_response_redirect_uri_template`を指定した場合のみ。 |

## サンプルリクエスト

```sh
curl -v 'https://oid4vc-verifier-endpoint-hono.g-trustedweb.workers.dev/wallet/direct_post/' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'state=AxpAg7T9omQzmlTFg44-1H5FhRUuZ4y9X3W6CazsobXzPrmoTA5e4w_L7z5VNf5umApZ1Rh7vHe9QB0Z-PoRpA' \
--data-urlencode 'response=eyJhbGciOiJFQ0RILUVTK0EyNTZLVyIsImVuYyI6IkEyNTZHQ00iLCJraWQiOiJhNGE1MmNjNS0yYjZkLTRkODAtODQ5Mi1mMTVjNjliOGJiMzYiLCJlcGsiOnsieCI6IkdwX2VPZVNLZ2hyaEJ4Vnd2bE4zeHA2ZTVQa2Facng5bDJpX1VXM3N0emciLCJjcnYiOiJQLTI1NiIsImt0eSI6IkVDIiwieSI6IjNRQTlpS2ZkNGZSWXNJem42YzJwamMyR2NZRU9PaWVkUlF5NXRuSDE1alkifX0.TP6C3vFtl_MIt1sFoObTCjDs87n4HCRIUywUqXgB7lLCuOUIhrWaTg.UJ5Sq-VbnpuDNdeG.JlLiUDxUcrBeYv5doO8gXGyEcehgVthIwRaOJMOOk1xT4jjBnOHz-JHF5QE3EDAfFy1CeqfxAKbwVV5KEeh8WngmnwwLoU6tvkOB5IocZqkVccaww8RD0w2U957iXbnIOxh8Kbl_FWWvBpCv34sy8Ja6E6A5U7v9UkVHLNBzPgvAG-NHJEUbgC6kqWOc69nVXMulURTYVo_Y0L7Zh6xq9WnQ4_iNtQ_MKWlnpTZBKLLbU3iHbElLArMKEOYfbEdSiQo9MlW7bKpS5k27v-kJQnFai8g3bu-w4-bps-GzRnUabPBe1432SQRRs4piJCreZrTTTNdied75_EK2WBTf5wLN7guLgT3YYYkyZdWilV6-0jSGa-Mo-m7skkZVsZR9NUYXjYN_m19F9Bcz99NDiTXNdboemcHkdgGBGtQN1OQurRJEGKmeTTLoC0HYpA5AVKDiI89z3b1CXusBGxGLTGvGuV1nlEc9BEwjyPVpIrlP0yJS4EAaKc5rPhY4mqLeS2ps0WMEMDU2xiMBSU6KuKInc7zagT2CuO_cxQeiVZdHKv_RzcFbD2E5x_4rAY_-8Lsf5lk0uyZUBXUEDqBhLP8Wn90fbmlDLC02UT1MFlmSE6K7-hUnKzLq3QS-wsG8vvd2E-Q5dOSPYpFBY9lO2ncDj3mx6DDRXXTHqAWA7YwaY_63kqJq7kCnVsNGC2jXDaNFE3z9TmNQ5jP_uzG6fep0-21tIfddpkaI0BKBJHhEL7VW8ba-PFRl6aNwPHwqlJbCBmZY-ypP9_suxeRoWHNytBRjw2gsnJiXXcZ_LNVjNtVjIBxQFGAFXHtviHkEDA-eesc1yF8GPIRHayXi42K8mC1nGqNsJZX-hCcdi8vx8QCD5uVwEYnDH-UnGnBJa6mdTqv6Naz2-W3hgZoDGZR59W1C0WT0yxQTGZNdZqanlf-xCEFN4Esxutrf21gLhTIL-vQ8j6oAhyGtnhbnqJtbaAyH1mEMQvv4e57gDNChCjlNHC1FnHGtPCB02gmYtaZrmTsSqT0u4PVweBDiZJ3mpyu0qA2tbVZW_NlOQ_GNy8Z7hJbkMFbm3PlhIQm_kXjgWL2IRyKje5bcyptJ4aCNuGQQvMdOYDaA-6oxd_emwCmUIWV_jLOO-hyVXFqDnTJBef9gooXYm03dCHx9A5KPhglg5EiGRf8FZ_WGf1bRbC5G1zdSbx5L0uM4FZEz-gpyQbWGz5Mf83iVYsLC22UAgWdkJWliLbgD3qbmClpBxxepj3OML4jJtFc5jl3FwSLtMWZ2HKuNJjPtLh2fsxW2BE0-ZJtva6C7G5xLRps1B3fX6auCN0oc_Lc6GGBPqw3hRMLRjF5-MlLyzWmcG4sqyPA0-n-OLibalv0ZqLFxS_dBUyNJe66j3vbZal0lXmmp8pp-y1-JYew0c8XK7qZuVmBA0j-P340njM_j5iR55yGio7CQWT1s2rhxfVnIHlra8rF692cgTO3riSnK8GSCvBVwJZnKePumiF3VztjLT5sz7ozOAhcypmTTlCqLwZxPaCXWF2v0oXMNUbleeLC3NIMXb99qaElvbNKmKjgxHE_FJDViTbUSpV3sPlJw_8iCKlDEbCt1MV1jXNuUqPHetYBC0qCRrY25rNnM03TM0IS0RXqsDqGs3oyjwJBSktAXVwPWyozQxqyMFimx0sisPFa_RdzTeHhXbHsH_QvifR-oVP0VkEUnrx9SHV8oqD_Y7HOHSHtMPhWqQmBVfU24Yl62N_Fhjd3KOQg_IW06Qo9amIzCnIBWRMs-EnSfQ-RMlDx_wnDaD-V0JTAZCi5JUEcSqV533_yTo7PnsblhHg2FnXv5hu-IFbdB5cUrFj7JHMPtjIBJuj-g9Pvgsb6GtTotpn1HxdbwCoCeJvdbYkbwBUIWVw8QOf86_nzyIqjliht12ojy5ob1He4XZJV0ZBYiBNnHRFWkBEZCLG5t8YAVpBWKX_o_r6LNSihadvztIhbcYNk0ILUQPxh01KGNe2PVjMewkIjNu3PeshKTXpbl4I9z55fijiHW-WtuZQlQZ-v22q6bSs3nzbT2tnGzRjnVZhRWZfyS9Jxm8Az77yvsDhY99UhTythjWNfgVVHSQix04CLdMuTQ_bSRdKjvsFsO0G0GcGugFKNIcuYmYbVyCccJTZKohxApnNDTQW-5w40cHFdqjzMIVQKNuBysYTJZnATtthTOCHqdCMWzhOgt4v_F9-lj39Q20zoBxdztrzIoN35aySgdgFAN2OxAg5X3rdIaCX-vk_QLP9WTS8o91RexGbuhal2u6h0BkrlTlG0y2rB6DhDO-jmhDeb9qh-f_9lvAkhXaZwbt1U0o0nnwG6hGMFyiTP_y1gCqAKWuVxRSaaQ05IJA_tNEfnFSGgDlv4mSxQC_Ts7fHmC_ri_lTJ0TGtX0I7zJBhoGyx-81NuuevO9OosBO6iBeRhZXLnWfulN3I68Q4aJLNezEOJSDisZML6HlexbIaoZOb_umnH0hYnSDhoxV30JKom1kFDC5e_L7pX1ygwL_72BxkqMq1N4CNGeRaSB8jjuBEQ5dSc_6jCeaXT5WXP4KREFGYRLDXqQJ3Fpp7J7H3LprbKXYv5O3S2prpFfDR-rEUYczzLU7ZJWF9RH0ACSCtLMTfqRCsue7vBtCJKRcgqdM9cXyau5d0wVkea_xk1Uk7cXC56FW7o-ue8UjeX92PvdEcP_li8FqYhMsfFnYpcah0ilVT6m2KI5QWyz4ErZc_kYHUf3B0ztme9ah4Z36gEzwjCEqHnHcy_wlGDNcS29r7C5PAAjcNQGw-kQJ2jhBNgXj5NsLxZABKFTDH2rVwWZ-oMFwjWG8nlnRao4d5fVFOoHv0h3j7b-txL6WPSzg0NNvvZp0KqpHKe8JAZTxfmPY_vSqPafXLM-QXOqRbgcG8URuujk_5_ZXbwau2Gpko.yBN0creJ4k1sD9q6ZnPr7g'
```

## サンプルレスポンス

```sh
{
    "redirect_uri": "https://oid4vc-verifier-frontend-hono.g-trustedweb.workers.dev/result?response_code=6da76011-6ae1-4d98-a8cd-0f1cd7630892"
}
```
