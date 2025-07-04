# Get Authorization Request

## 概要

Verifier から Wallet に対する認可リクエストを取得するためのエンドポイント。  
リクエスト URL は Initiate Transaction のレスポンスパラメータ`request_uri`から取得する。

## URL

https://oid4vc-verifier-endpoint-hono.g-trustedweb.workers.dev/wallet/request.jwt/:transactionId

## リクエスト

### メソッド

・GET

### パラメータ

| パラメータ     | 型     | 必須 | 説明                                                                  |
| -------------- | ------ | ---- | --------------------------------------------------------------------- |
| :transactionId | string | Yes  | URL の末尾のパスパラメーター。 トランザクションを識別するための識別子 |

## レスポンス

### フォーマット

- テキスト（JWT 形式の文字列）

### パラメータ

> [!NOTE]
> 以下に記載するパラメータは JWT のペイロード部をデコードした際に、取得できるものです。

| パラメータ                                           | 型       | 必須 | 説明                                                                                                                        |
| ---------------------------------------------------- | -------- | ---- | --------------------------------------------------------------------------------------------------------------------------- |
| iss                                                  | string   | Yes  | クライアント ID を示す発行者識別子                                                                                          |
| aud                                                  | string[] | Yes  | 想定される受信者（Audience）の配列                                                                                          |
| response_type                                        | string   | Yes  | `id_token` または `vp_token`                                                                                                |
| response_mode                                        | string   | Yes  | レスポンスの返却方式。 `direct_post`、`direct_post.jwt`のどちらか                                                           |
| client_id                                            | string   | Yes  | クライアントの識別子                                                                                                        |
| scope                                                | string   | Yes  | 要求するスコープ（スペース区切りの文字列）                                                                                  |
| state                                                | string   | Yes  | リクエストの状態を表す文字列                                                                                                |
| nonce                                                | string   | Yes  | リプレイ攻撃を防ぐための一回限りの値                                                                                        |
| client_id_scheme                                     | string   | Yes  | クライアント ID 方式の名前。 `pre-registered`、`x509_san_dns`、`x509_san_uri`のいずれか                                     |
| iat                                                  | number   | Yes  | JWT が発行された時刻（UNIX タイムスタンプ）                                                                                 |
| id_token_type                                        | string   | No   | ID トークンのタイプ（スペース区切りの文字列）                                                                               |
| presentation_definition                              | JSON     | No   | [Presentation Definition](https://github.com/dentsusoken/oid4vc-prex/blob/main/docs/PresentationDefinition.md) オブジェクト |
| presentation_definition_uri                          | string   | No   | Presentation Definition を取得するための URI                                                                                |
| client_metadata.id_token_signed_response_alg         | string   | No   | ID トークン署名アルゴリズム                                                                                                 |
| client_metadata.id_token_encrypted_response_alg      | string   | No   | ID トークン暗号化アルゴリズム                                                                                               |
| client_metadata.id_token_encrypted_response_enc      | string   | No   | ID トークン暗号化エンコーディング                                                                                           |
| client_metadata.subject_syntax_types_supported       | string[] | Yes  | サポートされる主体構文タイプの配列                                                                                          |
| client_metadata.jwks                                 | JSON[]   | No   | JSON Web Key Set。jwks_uri と排他。形式: `{"keys": [JWK, ...]}`                                                             |
| client_metadata.jwks_uri                             | string   | No   | JWKS の URI。jwks と排他                                                                                                    |
| client_metadata.authorization_signed_response_alg    | string   | No   | 認可レスポンス署名アルゴリズム。 response_mode が'direct_post.jwt'の場合のみ使用                                            |
| client_metadata.authorization_encrypted_response_alg | string   | No   | 認可レスポンス暗号化アルゴリズム。 response_mode が'direct_post.jwt'の場合のみ使用                                          |
| client_metadata.authorization_encrypted_response_enc | string   | No   | 認可レスポンス暗号化エンコーディング。 response_mode が'direct_post.jwt'の場合のみ使用                                      |
| response_uri                                         | string   | No   | レスポンスの送信先 URI                                                                                                      |

## サンプルリクエスト

```sh
curl --location 'https://oid4vc-verifier-endpoint-hono.g-trustedweb.workers.dev/wallet/request.jwt/XEzb7Gtk_rzghzPgd6zTETT8UiEm0jY4y35bJzgOQ0aWkTr9ToeTz_hMFy-DRKtAWdPaB5D1Frhcvqk7tE6nuQ'
```

## サンプルレスポンス

```sh
eyJhbGciOiJFUzI1NiIsInR5cCI6Im9hdXRoLWF1dGh6LXJlcStqd3QiLCJ4NWMiOlsiTUlJQmZEQ0NBU0dnQXdJQkFnSVVFbW1sRWxBNWhSanV6UEJlOHUrZ09PL0VQVnd3Q2dZSUtvWkl6ajBFQXdJd0V6RVJNQThHQTFVRUF3d0lWbVZ5YVdacFpYSXdIaGNOTWpRd09ESXhNREF6T0RFNFdoY05NalF3T1RJd01EQXpPREU0V2pBVE1SRXdEd1lEVlFRRERBaFdaWEpwWm1sbGNqQlpNQk1HQnlxR1NNNDlBZ0VHQ0NxR1NNNDlBd0VIQTBJQUJDVk0zMzBpTit2MXY1OGNXT3YyOGovTE1FWHVwR3lHdVd3Wk9KSTUzeXBVT2svWDRjZlIySTdDMUJ0ZnBWUHoxSDFkMjZGZ3JFL0wzWGxrSFBKYmZER2pVekJSTUIwR0ExVWREZ1FXQkJRcHZDNW1mUUszRkp6dWE3UGswZDAwbFBRUmhEQWZCZ05WSFNNRUdEQVdnQlFwdkM1bWZRSzNGSnp1YTdQazBkMDBsUFFSaERBUEJnTlZIUk1CQWY4RUJUQURBUUgvTUFvR0NDcUdTTTQ5QkFNQ0Ewa0FNRVlDSVFDQjNBaHVPQUxPYVcrNXpEZ0wxbW4rVSt6R3c4V1Myem9EWnlTb0M4b0N6Z0loQUtvdGhsZUsxQldmbXB2MVF6eTRiUTUrZFVqK3AyUlhqR2ovQTR6Y1AvRTIiXX0.eyJpc3MiOiJWZXJpZmllciIsImF1ZCI6WyJodHRwczovL3NlbGYtaXNzdWVkLm1lL3YyIl0sInJlc3BvbnNlX3R5cGUiOiJ2cF90b2tlbiIsInJlc3BvbnNlX21vZGUiOiJkaXJlY3RfcG9zdC5qd3QiLCJjbGllbnRfaWQiOiJWZXJpZmllciIsInNjb3BlIjoiIiwic3RhdGUiOiJ2T3VaR2ZMQXRXeWhWTUxNU2RFZTlISnFPTFdPVllEM29SbFRNVTJmV0pJVnh5VlY2OWx3Y2didVVvVnJVZnRPdXFZZTdDak1fTDVxQ3ZfaUhwd245dyIsIm5vbmNlIjoiM2I3NWI5YjEtMjQ2My00ZDRhLWI5MjEtYWRjMjE2NDJjNDNjIiwiY2xpZW50X2lkX3NjaGVtZSI6Ing1MDlfc2FuX2RucyIsImlhdCI6MTczMTAzMjg5NiwicHJlc2VudGF0aW9uX2RlZmluaXRpb24iOnsiaWQiOiI1ZGIwMDYzNi03M2ZiLTQyNWEtYjVhMy00ODJkMjZkMGQ2MDIiLCJpbnB1dF9kZXNjcmlwdG9ycyI6W3siaWQiOiJvcmcuaXNvLjE4MDEzLjUuMS5tREwiLCJuYW1lIjoiTW9iaWxlIERyaXZpbmcgTGljZW5jZSIsInB1cnBvc2UiOiJXZSBuZWVkIHRvIHZlcmlmeSB5b3VyIG1vYmlsZSBkcml2aW5nIGxpY2VuY2UiLCJmb3JtYXQiOnsibXNvX21kb2MiOnsiYWxnIjpbIkVTMjU2IiwiRVMzODQiLCJFUzUxMiJdfX0sImNvbnN0cmFpbnRzIjp7ImZpZWxkcyI6W3sicGF0aCI6WyIkWydvcmcuaXNvLjE4MDEzLjUuMSddWydnaXZlbl9uYW1lJ10iXSwiaW50ZW50X3RvX3JldGFpbiI6ZmFsc2V9LHsicGF0aCI6WyIkWydvcmcuaXNvLjE4MDEzLjUuMSddWydkb2N1bWVudF9udW1iZXInXSJdLCJpbnRlbnRfdG9fcmV0YWluIjpmYWxzZX1dfX1dfSwiY2xpZW50X21ldGFkYXRhIjp7ImlkX3Rva2VuX2VuY3J5cHRlZF9yZXNwb25zZV9hbGciOiJFQ0RILUVTK0EyNTZLVyIsImlkX3Rva2VuX2VuY3J5cHRlZF9yZXNwb25zZV9lbmMiOiJBMjU2R0NNIiwic3ViamVjdF9zeW50YXhfdHlwZXNfc3VwcG9ydGVkIjpbInVybjppZXRmOnBhcmFtczpvYXV0aDpqd2stdGh1bWJwcmludCJdLCJqd2tzIjp7ImtleXMiOlt7Imt0eSI6IkVDIiwiY3J2IjoiUC0yNTYiLCJ4IjoiVGVqM21yRThET3FJQnE2WkZCY0JNVnFZOVg4UDVUNzhBOTIxMVFTdzNodyIsInkiOiJ1djlEWjZpa3JkRXZFT24zVTVCZk45a2ZTOTRVd2Zlamc4VkZ0NmExVzRBIiwia2lkIjoiZTc2MTkzOTEtMDU0OC00MWIxLWE4ZTEtM2ZkZGQ3ZTI2M2E3IiwidXNlIjoiZW5jIiwiYWxnIjoiRUNESC1FUyJ9XX0sImF1dGhvcml6YXRpb25fZW5jcnlwdGVkX3Jlc3BvbnNlX2FsZyI6IkVDREgtRVMrQTI1NktXIiwiYXV0aG9yaXphdGlvbl9lbmNyeXB0ZWRfcmVzcG9uc2VfZW5jIjoiQTI1NkdDTSJ9LCJyZXNwb25zZV91cmkiOiJodHRwczovL29pZDR2Yy12ZXJpZmllci1lbmRwb2ludC1ob25vLmctdHJ1c3RlZHdlYi53b3JrZXJzLmRldi93YWxsZXQvZGlyZWN0X3Bvc3QvIn0.febL0e1j9GdEMfSt2SQXlqWNOcOnjT0QqohMGCVTrSXWg983t9a_KuWEchZXcFC-IsBiEFKVKgXIBUzuCp5rqg
```
