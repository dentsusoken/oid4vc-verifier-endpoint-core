# Get Wallet Response

## 概要

Verifier Frontend が Verifier Backend に対して、Wallet から提示された VP を要求するためのエンドポイント。

## URL

`https://oid4vc-verifier-endpoint-hono.g-trustedweb.workers.dev/ui/presentations/:transactionId`

## リクエスト

### メソッド

- GET

### パラメータ

| パラメータ     | 型     | 必須 | 説明                                                                                                                  |
| -------------- | ------ | ---- | --------------------------------------------------------------------------------------------------------------------- |
| :transactionId | string | Yes  | URL の末尾のパスパラメーター。InitTransaction エンドポイントのレスポンスとして受け取った`presentation_id`を指定する。 |
| response_code  | string | No   | Same device の場合は必須。                                                                                            |

## レスポンス

### フォーマット

- JSON 形式

### パラメータ

| パラメータ                                                     | 型     | 必須 | 説明                                                                                                                                                                  |
| -------------------------------------------------------------- | ------ | ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id_token                                                       | string | No   | Wallet から送信された`id_token`。InitTransaction で`response_type`に`id_token`を指定した場合のみ。                                                                    |
| vp_token                                                       | string | No   | Wallet から提示された`vp_token`。CBOR 形式の文字列。InitTransaction で`response_type`に`vp_token`を指定した場合のみ。                                                 |
| presentation_submission                                        | JSON   | No   | Presentation Definition で定義された要求に基づいて、どのように VP が Verifier に提示されるかを示す。InitTransaction で`response_type`に`vp_token`を指定した場合のみ。 |
| presentation_submission.id                                     | string | Yes  | UUID のような一意の値を指定する。                                                                                                                                     |
| presentation_submission.definition_id                          | string | Yes  | Presentation Definition の ID。                                                                                                                                       |
| presentation_submission.descriptor_map                         | JSON[] | Yes  | Input Descriptor Mapping Objects の配列。                                                                                                                             |
| presentation_submission.descriptor_map.id                      | string | Yes  | Presentation Definition に含まれる Input Descriptor Objects の ID。                                                                                                   |
| presentation_submission.descriptor_map.format                  | string | Yes  | 登録済みの [Claim Format Designations](https://identity.foundation/claim-format-registry/#registry) に一致する文字列。                                                |
| presentation_submission.descriptor_map.path                    | string | Yes  | JSON Path 文字列。                                                                                                                                                    |
| presentation_submission.descriptor_map.path_nested             | JSON   | No   | multi-Claim envelope format の存在を示すためのオブジェクト。                                                                                                          |
| presentation_submission.descriptor_map.path_nested.id          | string | Yes  | presentation_submission.descriptor_map.id と同様。                                                                                                                    |
| presentation_submission.descriptor_map.path_nested.format      | string | Yes  | presentation_submission.descriptor_map.format と同様。                                                                                                                |
| presentation_submission.descriptor_map.path_nested.path        | string | Yes  | presentation_submission.descriptor_map.path と同様。                                                                                                                  |
| presentation_submission.descriptor_map.path_nested.path_nested | JSON   | No   | presentation_submission.descriptor_map.path_nested と同様。                                                                                                           |
| error                                                          | string | No   | Wallet の VP 提示処理でエラーが発生した場合のエラーコード。                                                                                                           |
| error_description                                              | string | No   | Wallet の VP 提示処理でエラーが発生した場合のエラーの説明。                                                                                                           |

## サンプルリクエスト

```sh
curl 'https://oid4vc-verifier-endpoint-hono.g-trustedweb.workers.dev/ui/presentations/mvvvOhohzUA6ub4pKYq8KFj_MMf3oS7OIx_bHNrFOwloEqWCVud7QeMqoCzpdSdFMxYmT6c01p66GoPKESMJ3A?response_code=72cebde7-1ede-4363-a845-dee8ace9d68d'
```

## サンプルレスポンス

```sh
{
  "vp_token": "o2d2ZXJzaW9uYzEuMGlkb2N1bWVudHOBo2dkb2NUeXBldW9yZy5pc28uMTgwMTMuNS4xLm1ETGxpc3N1ZXJTaWduZWSiam5hbWVTcGFjZXOhcW9yZy5pc28uMTgwMTMuNS4xgtgYWIOkZnJhbmRvbVhAvzy0xTmV9BWSqTH1L5LO5KFazP-kCsBiHu3agh_dFhynMj0SLBaWYfNPrXPSK7wUIwuPquplYgA4Lb1zGEFzt2hkaWdlc3RJRBgmbGVsZW1lbnRWYWx1ZWNKQU5xZWxlbWVudElkZW50aWZpZXJqZ2l2ZW5fbmFtZdgYWI6kZnJhbmRvbVhAHgYJzrLF5peSTHD-Pl0fz4TsoOWbDA9byCgApArFdWLRNiUqAIudQIMiL4rO4apGaK-037TOvuKEUA4e4lw842hkaWdlc3RJRBhmbGVsZW1lbnRWYWx1ZWkxMTExMTExMTRxZWxlbWVudElkZW50aWZpZXJvZG9jdW1lbnRfbnVtYmVyamlzc3VlckF1dGiEQ6EBJqEYIVkChTCCAoEwggImoAMCAQICCRZK5ZkC3AUQZDAKBggqhkjOPQQDAjBYMQswCQYDVQQGEwJCRTEcMBoGA1UEChMTRXVyb3BlYW4gQ29tbWlzc2lvbjErMCkGA1UEAxMiRVUgRGlnaXRhbCBJZGVudGl0eSBXYWxsZXQgVGVzdCBDQTAeFw0yMzA1MzAxMjMwMDBaFw0yNDA1MjkxMjMwMDBaMGUxCzAJBgNVBAYTAkJFMRwwGgYDVQQKExNFdXJvcGVhbiBDb21taXNzaW9uMTgwNgYDVQQDEy9FVSBEaWdpdGFsIElkZW50aXR5IFdhbGxldCBUZXN0IERvY3VtZW50IFNpZ25lcjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABHyTE_TBpKpOsLPraBGkmU5Z3meZZDHC864IjrehBhy2WL2MORJsGVl6yQ35nQeNPvORO6NL2yy8aYfQJ-mvnfyjgcswgcgwHQYDVR0OBBYEFNGksSQ5MvtFcnKZSPJSfZVYp00tMB8GA1UdIwQYMBaAFDKR6w4cAR0UDnZPbE_qTJY42vsEMA4GA1UdDwEB_wQEAwIHgDASBgNVHSUECzAJBgcogYxdBQECMB8GA1UdEgQYMBaGFGh0dHA6Ly93d3cuZXVkaXcuZGV2MEEGA1UdHwQ6MDgwNqA0oDKGMGh0dHBzOi8vc3RhdGljLmV1ZGl3LmRldi9wa2kvY3JsL2lzbzE4MDEzLWRzLmNybDAKBggqhkjOPQQDAgNJADBGAiEA3l-Y5x72V1ISa_LEuE_e34HSQ8pXsVvTGKq58evrP30CIQD-Ivcya0tXWP8W_obTOo2NKYghadoEm1peLIBqsUcISFkGZNgYWQZfpmd2ZXJzaW9uYzEuMG9kaWdlc3RBbGdvcml0aG1nU0hBLTI1Nmdkb2NUeXBldW9yZy5pc28uMTgwMTMuNS4xLm1ETGx2YWx1ZURpZ2VzdHOhcW9yZy5pc28uMTgwMTMuNS4xuCUOWCCSQ6P7qECNZ83yj2OFKdxgUlDR8MHFEFK12da__ydkHRgmWCAcPd3X6tWiH8i3umZuftlmNJvU61odcRP686k8qBe91xhCWCD88f76Ha0w7J4Awgr8DLICqAx5KampLKH58qn5HO9HlQ9YIC1hu3zH4VXefy-6DdA1oPNNb01lhHoQpjFqmuI1CT56ClggPl574ewzPkcPg1FlgRiapiFqmrDdMgsnHi0iOibpK84FWCD_vZj4zoIkHLtt41iETpulOUSREhtDUDinbkTf8yspBRhZWCAfLDg3Sr7Zlj7sdYZvhU2oJIm5Dt0JY3k_VU25KOI-_hhmWCDHVJYBd7DE5o-7TbYpzHtPvBONzjLu-Yu2C0pg5S6gfBgZWCDyGhLW4XnA85yQYxn67AnmL91-sHj3Djl-4_pYWsadqAhYIKledSSDQcVSwbaigHLX1EzbAxdmUL1-wMKAW7jQqINoGEBYIBKoMlQBl6J7m8OVpP5ZV_ppDn9MLbbkaTR0Vc9zVTLsDVgglO_9-ooeZnWNWsH8mHitkuaBFDiUyLn0moDq7jmBoUsYMlggA1qJqF5s41TBZReiLN5pzwCud9pWOpordI5KSS0q02oYIVggon746Xd3lGa8v4L2XJOX5IsLIMtcWiGtfS5k-fgX9kMYP1gg7KZwoH624t-Xvla-QWBDdXb2eiUvXCtH5W249RSIlmkYLlgghgKr0SCrNcX_XF-kGiatcS_9RPUMkhmeluQ5gAVmNZoYSVggzyKd4p3IjnFAfvTiSCI2xPAE8eqJfgWX3mHxoKbTKwcJWCCWGTV83F87KnpYPspD1LGVhW8hm_vUp1dR7ajes6mZYRgnWCDM16gfLD0z8PuwB2qb_haTbqB9FPg38QKf3nNlQMmWaxhfWCBT6hsb4awPbJiNEUmNbhnOGm3WhbAI3qzDlwOQOdlTRRgqWCAwmk4NKtXdGiwGO51Q2HXzpGcFMm4TiYuzHL0F0nOyyhhPWCByP3DOK3D94eOETEa9dSeovPNJEcpTOZVeR2F4bJeMdBhIWCC6_pChqBhMJ9MfHCp6Ow0h10cgGvV6k-sS1_qSZMWqCBg9WCAZLL3_PxCgDIclaiFjmqTonW2ze4Q7DY1ntTNDaGGHOxhTWCB6WlSy3sY39LzcLXQqXpNX7ru-WnUqsKNDV5TD8g4RkRhQWCDuXX_WRfrCyqJ3eCowCZSnK1RoXqtu_MlryoGGjlS0WxhDWCBEVhXcBI9Wz3X8-rj0Dz4U8FYxKUZ8kQO3HpT1AYN1hxRYIJ10hWh3c07Un4KJqcJQ9rNMJKZHkSjFih3w4gJxHszQGFJYICDgPm202OgcqmQYWT19fHuvMzkjy4rf7PcN6zFo9bpXGDlYIBiAEYZLIXJOGUQKR0THBCVXq8r4hp4ZvERxNlPX6MBrGGJYIDqOjIervO-Z3Hl0YQK11tVsx177POjE0CwSz_S0hIEoEVgggkQb4J1HUI3vGnqWfCaPTL3IxfRRABl9zLSsLjycojEMWCBGjo01fB5Iimgjxzg1J1rlH3MeM7jcBdzRuSJSh_CcqRg6WCA7IG5fkd6vqz9kUb1VEJoJf8ia2dJ_NgX8w_yv2tpRVRhNWCAb1KqHYjXwCZanFhOsax-_iOHc9L_mjzMI44t1NXkxQBhWWCApsfcBmfBBTrjjwR_j41Xd0HACQBiOSTqzR7OzSUTSYxhUWCBH6xHHMPUHhTbbh0FHlmT6-LElfA4UEhZdzKwTEk33021kZXZpY2VLZXlJbmZvoWlkZXZpY2VLZXmkAQIgASFYIOERlripeKIEeezswIAh5xIPZddS6800MuG8UbCz6RScIlggRH4Wm0VK2BtO-gejXmPf2kPX1mqK159Po5BbKbRnT4hsdmFsaWRpdHlJbmZvo2ZzaWduZWTAdDIwMjQtMDYtMTdUMDk6Mzk6MDNaaXZhbGlkRnJvbcB0MjAyNC0wNi0xN1QwOTozOTowM1pqdmFsaWRVbnRpbMB0MjAyNS0wNi0xN1QwOTozOTowM1pYQN5f7-DdxKWChcp8v0Sbm8p7ikPxP8MRw05U8OrkEU-GfgN1KNSf7qiMy3MaWEEkl-VJz8bCrxCfXq1Ly0QlKhdsZGV2aWNlU2lnbmVkompuYW1lU3BhY2Vz2BhBoGpkZXZpY2VBdXRooW9kZXZpY2VTaWduYXR1cmWEQ6EBJqD2WEAxalteYxOqH2qiesx2dmJolMgxWo-LoT5h6GT804VyfhEcaEacDRg3sczzP2XdR7UF1H8xk7k1SvDJUYNF5ZZaZnN0YXR1cwA",
  "presentation_submission": {
    "id": "EA0EFF67-C01F-4A3A-B088-D6E71A1FCE2C",
    "definition_id": "7700ec34-2feb-4ea7-bd6b-0adc95032e15",
    "descriptor_map": [
      { "id": "org.iso.18013.5.1.mDL", "format": "mso_mdoc", "path": "$" }
    ]
  }
}
```
