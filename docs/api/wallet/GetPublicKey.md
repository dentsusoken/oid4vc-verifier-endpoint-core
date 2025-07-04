# Get Public Key

## 概要

署名の検証に必要な公開鍵を取得するためのエンドポイント。

## URL

https://oid4vc-verifier-endpoint-hono.g-trustedweb.workers.dev/wallet/public-keys.json

## リクエスト

### メソッド

- GET

### パラメータ

なし

## レスポンス

### フォーマット

- JSON

### パラメータ

| パラメータ | 型   | 必須 | 説明             |
| ---------- | ---- | ---- | ---------------- |
| keys       | JSON | Yes  | JSON Web Key Set |

## サンプルリクエスト

```sh
curl --location 'https://oid4vc-verifier-endpoint-hono.g-trustedweb.workers.dev/wallet/public-keys.json'
```

## サンプルレスポンス

```sh
{
  "keys": [
    {
      "kty": "EC",
      "crv": "P-256",
      "x": "JUzffSI36_W_nxxY6_byP8swRe6kbIa5bBk4kjnfKlQ",
      "y": "Ok_X4cfR2I7C1BtfpVPz1H1d26FgrE_L3XlkHPJbfDE",
      "alg": "ES256",
      "use": "sig",
      "x5c": [
        "MIIBfDCCASGgAwIBAgIUEmmlElA5hRjuzPBe8u+gOO/EPVwwCgYIKoZIzj0EAwIwEzERMA8GA1UEAwwIVmVyaWZpZXIwHhcNMjQwODIxMDAzODE4WhcNMjQwOTIwMDAzODE4WjATMREwDwYDVQQDDAhWZXJpZmllcjBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABCVM330iN+v1v58cWOv28j/LMEXupGyGuWwZOJI53ypUOk/X4cfR2I7C1BtfpVPz1H1d26FgrE/L3XlkHPJbfDGjUzBRMB0GA1UdDgQWBBQpvC5mfQK3FJzua7Pk0d00lPQRhDAfBgNVHSMEGDAWgBQpvC5mfQK3FJzua7Pk0d00lPQRhDAPBgNVHRMBAf8EBTADAQH/MAoGCCqGSM49BAMCA0kAMEYCIQCB3AhuOALOaW+5zDgL1mn+U+zGw8WS2zoDZySoC8oCzgIhAKothleK1BWfmpv1Qzy4bQ5+dUj+p2RXjGj/A4zcP/E2"
      ]
    }
  ]
}
```
