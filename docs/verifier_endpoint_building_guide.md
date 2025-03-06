# Verifier Endpoint 構築

- [Verifier Endpoint 構築](#verifier-endpoint-構築)
  - [クライアントの登録](#クライアントの登録)
  - [Verifier Endpoint のデプロイ（Cloudflare Workers)](#verifier-endpoint-のデプロイcloudflare-workers)
    - [モジュールのクローン](#モジュールのクローン)
    - [KV の作成](#kv-の作成)
    - [設定ファイルを修正](#設定ファイルを修正)
    - [デプロイ](#デプロイ)
    - [シークレットの設定](#シークレットの設定)

## クライアントの登録

## Verifier Endpoint のデプロイ（Cloudflare Workers)

### モジュールのクローン

```bash
git clone https://github.com/dentsusoken/oid4vc-verifier-endpoint-hono
```

### KV の作成

作成済みの場合は不要。
コマンド実行後 ID が表示されるので控えておく。

```bash
npm i -g wrangler
npx wrangler login
npx wrangler kv namespace create "PRESENTATION_KV"
```

### 設定ファイルを修正

```toml
# oid4vc-verifier-endpoint-hono/wrangler.toml

name = "<Verifier Endpointの名前>" # 適宜設定する

...

[[kv_namespaces]]
binding = "PRESENTATION_KV"
id = "<KVのID>" # 控えておいたIDを設定する
```

### デプロイ

oid4vc-verifier-endpoint-hono ディレクトリで shell/deploy_verifier_endpoint.[sh|bat] を実行する。
(Linux、MacOS の場合は deploy_verifier_endpoint.sh を実行する。Windows の場合は deploy_verifier_endpoint.bat を実行する。)

```bash
# Linux、MacOS の場合
sh ./shell/deploy_verifier_endpoint.sh
```

```bash
# Windows の場合
./shell/deploy_verifier_endpoint.bat
```

### シークレットの設定

[Cloudflare](https://dash.cloudflare.com/)のダッシュボードにアクセスし、画面左側のメニューから、`Compute` -> `Workers & Pages`を選択。
デプロイされた Workers をクリックする。
画面上部のメニューから`Settings`を選択。

`Variables and Secrets`の`Add`をクリックしてシークレットを追加する。

| Type     | Variable name             | Value                                                                                                          |
| -------- | ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `Secret` | `PUBLIC_URL`              | Verifier Endpoint のデプロイ先の URL（例：https://verifier-endpoint.example.com）                              |
| `Secret` | `JAR_SIGNING_PRIVATE_JWK` | X509 の秘密鍵（JWK 形式）作成手順は[こちら](./jwk_generate/how_to_generate_JWK_with_x509_certificate.md)を参照 |
| `Secret` | `CLIENT_ID`               | `JAR_SIGNING_PRIVATE_JWK`作成時に設定したクライアント ID                                                       |
| `Secret` | `CLIENT_ID_SCHEME`        | `x509_san_dns`                                                                                                 |
| `Secret` | `CORS_ORIGIN`             | Verifier Frontend のデプロイ先のオリジン（例：https://verifier-frontend.example.com）                          |
