# Initiate Transaction

## 概要

VP 提示フローの開始をリクエストをするためのエンドポイント。

## URL

`https://oid4vc-verifier-endpoint-hono.g-trustedweb.workers.dev/ui/presentations`

## リクエスト

### メソッド

- POST

### パラメータ

| パラメータ                                                                    | 型                 | 必須 | 説明                                                                                                                                                                                                                                              |
| ----------------------------------------------------------------------------- | ------------------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type                                                                          | string             | Yes  | 認可リクエストに対するレスポンスのタイプ。`id_token`、`vp_token`または`vp_token id_token`のいずれかが指定される。                                                                                                                                 |
| id_token_type                                                                 | string             | No   | `type`が`id_token`の場合、Wallet から要求される`id_token`のタイプ。`subject_signed_id_token`または`attester_signed_id_token`が指定される。                                                                                                        |
| presentation_definition                                                       | JSON               | No   | `type`が`vp_token`の場合に、提示される VP の定義を表す JSON オブジェクト。                                                                                                                                                                        |
| presentation_definition.id                                                    | string             | Yes  | UUID のような一意の値を指定する。                                                                                                                                                                                                                 |
| presentation_definition.input_descriptors                                     | JSON[]             | Yes  | Input Descriptor Objects の配列。                                                                                                                                                                                                                 |
| presentation_definition.input_descriptors.id                                  | string             | Yes  | 他の Input Descriptor Objects と衝突しない ID                                                                                                                                                                                                     |
| presentation_definition.input_descriptors.name                                | string             | No   | 人間が識別しやすい Input Descriptor Objects の名称。                                                                                                                                                                                              |
| presentation_definition.input_descriptors.purpose                             | string             | No   | Claim のデータが要求されている目的。                                                                                                                                                                                                              |
| presentation_definition.input_descriptors.format                              | JSON               | No   | Verifier が処理できる Claim format の設定を Wallet に通知するためのプロパティ。<br>登録済みの [Claim Format Designations](https://identity.foundation/claim-format-registry/#registry) に一致するプロパティを持つ。                               |
| presentation_definition.input_descriptors.format.`xxx`[^1].alg                | string or string[] | No   | Verifier がフォーマットに対してどのアルゴリズムをサポートするかを示す。                                                                                                                                                                           |
| presentation_definition.input_descriptors.format.`xxx`[^1].proof_type         | string or string[] | No   | Verifier がフォーマットに対してどのアルゴリズムをサポートするかを示す。                                                                                                                                                                           |
| presentation_definition.input_descriptors.constraints                         | JSON               | Yes  | Constraint Objects の配列。                                                                                                                                                                                                                       |
| presentation_definition.input_descriptors.constraints.fields                  | JSON               | No   | Field Objects の配列。                                                                                                                                                                                                                            |
| presentation_definition.input_descriptors.constraints.fields.path             | string[]           | Yes  | JSONPath 文字列の配列。                                                                                                                                                                                                                           |
| presentation_definition.input_descriptors.constraints.fields.id               | string             | No   | Field Objects ごとに一意の ID                                                                                                                                                                                                                     |
| presentation_definition.input_descriptors.constraints.fields.purpose          | string             | No   | 対象の Field Objects が要求される目的。                                                                                                                                                                                                           |
| presentation_definition.input_descriptors.constraints.fields.name             | string             | No   | 人間が識別しやすい Field Objects の名称。                                                                                                                                                                                                         |
| presentation_definition.input_descriptors.constraints.fields.filter           | JSON               | No   | `path` 配列内の JSONPath 文字列の評価から返される値に対してフィルタリングを行うために使用される JSON Schema。                                                                                                                                     |
| presentation_definition.input_descriptors.constraints.fields.optional         | boolean            | No   | 対象の Field Object が必須の場合は、`false`、オプショナルの場合は`true`を指定する。                                                                                                                                                               |
| presentation_definition.input_descriptors.constraints.fields.intent_to_retain | boolean            | No   | Verifier が対象のデータを保持する意図がある場合は`true`、保持する意図がない場合は`false`を指定する。                                                                                                                                              |
| presentation_definition.name                                                  | string             | No   | 人間が識別しやすい Presentation Definition の名称。                                                                                                                                                                                               |
| presentation_definition.purpose                                               | string             | No   | Presentation Definition が使用される目的。                                                                                                                                                                                                        |
| presentation_definition.format                                                | JSON               | No   | Verifier が処理できる Claim format の設定を Wallet に通知するためのプロパティ。<br>登録済みの [Claim Format Designations](https://identity.foundation/claim-format-registry/#registry) に一致するプロパティを持つ。                               |
| presentation_definition.input_descriptors.format.`xxx`[^1].alg                | string or string[] | No   | Verifier がフォーマットに対してどのアルゴリズムをサポートするかを示す。                                                                                                                                                                           |
| presentation_definition.input_descriptors.format.`xxx`[^1].proof_type         | string or string[] | No   | Verifier がフォーマットに対してどのアルゴリズムをサポートするかを示す。                                                                                                                                                                           |
| nonce                                                                         | -                  | No   | OID4VP リクエストに含まれる Nonce 値。                                                                                                                                                                                                            |
| response_mode                                                                 | -                  | No   | OID4VP リクエストのレスポンスモード。`direct_post`もしくは`direct_post.jwt`を指定する。                                                                                                                                                           |
| jar_mode                                                                      | -                  | No   | 認可リクエストが Wallet に渡される方法を制御する。`by_value`または`by_reference`を指定する。`by_value`の場合は、認可リクエストが Wallet にインラインで渡され、`by_reference`の場合は、`request_uri`を経由して渡される。                           |
| presentation_definition_mode                                                  | -                  | No   | Presentation Definition が Wallet に渡される方法を制御する。`by_value`または`by_reference`を指定する。`by_value`の場合は、認可リクエストが Wallet にインラインで渡され、`by_reference`の場合は、`presentation_definition_uri`を経由して渡される。 |
| wallet_response_redirect_uri_template                                         | -                  | No   | Same device で VP 提示フローを実施した際に、Wallet から Verifier に VP を提示後 Wallet から Verifier Frontend へリダイレクトする際の URI のテンプレートを指定する。                                                                               |

## レスポンス

### フォーマット

- JSON 形式

### パラメータ

| パラメータ      | 型     | 必須 | 説明                                                                                                                                             |
| --------------- | ------ | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| presentation_id | string | Yes  | VP 提示のトランザクションを識別するための一意の ID。Wallet が VP の提示を完了後、Verifier Backend に対して提示された VP を要求する際に使用する。 |
| client_id       | string | Yes  | Verifier の Client ID。Wallet へリダイレクトする際に、`client_id`というクエリパラメータで受け渡す。                                              |
| request_uri     | string | No   | Wallet が認可リクエストを取得するための URI。Wallet へリダイレクトする際に、`request_uri`というクエリパラメータで受け渡す。                      |

## サンプルリクエスト

> [!NOTE]
> サンプルの curl コマンドでは、リクエストパラメータに含まれるシングルコーテーションがエスケープされています。  
> 実装に合わせて、エスケープを取り除くなどの修正を行ってください。

```sh
curl --location 'https://oid4vc-verifier-endpoint-hono.g-trustedweb.workers.dev/ui/presentations' \
--header 'Content-Type: application/json' \
--data '{
    "type": "vp_token",
    "presentation_definition": {
      "id": "5db00636-73fb-425a-b5a3-482d26d0d602",
      "input_descriptors": [
        {
          "id": "org.iso.18013.5.1.mDL",
          "name": "Mobile Driving Licence",
          "purpose": "We need to verify your mobile driving licence",
          "format": { "mso_mdoc": { "alg": ["ES256", "ES384", "ES512"] } },
          "constraints": {
            "fields": [
              {
                "path": ["$['\''org.iso.18013.5.1'\'']['\''given_name'\'']"],
                "intent_to_retain": false
              },
              {
                "path": ["$['\''org.iso.18013.5.1'\'']['\''document_number'\'']"],
                "intent_to_retain": false
              }
            ]
          }
        }
      ]
    },
    "nonce": "3b75b9b1-2463-4d4a-b921-adc21642c43c"
  }'
```

## サンプルレスポンス

```sh
{
  "presentation_id": "WQf87pNgNyDZP8PCL_9-sOXAOPfWD8dwWUyyMlRyVvA_aEG6CqMfe1SBRIVoreyVMZjPNAmde2dYwbaFp_rdDA",
  "client_id": "Verifier",
  "request_uri": "https://oid4vc-verifier-endpoint-hono.g-trustedweb.workers.dev/wallet/request.jwt/En-jBwmrLHl_aIvRep6zKv4aAjpluWWIglynp9iIGN2gKOiPl58EBThiMGlYRuW9OaL0muqz_0JNUhP_u4pkyA"
}
```

[^1]: `xxx` には、登録済みの [Claim Format Designations](https://identity.foundation/claim-format-registry/#registry) に一致する文字列が指定される。
