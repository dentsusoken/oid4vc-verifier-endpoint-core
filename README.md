# oid4vc-verifier-endpoint-core

## はじめに
EUDIWのプロジェクトが公開している[verifier-endpoint]をベースに、Verifierとして実装する内容を整理したものとなります。
 
## 概要

* "Verifier"として行うVP要求や検証といった機能を実装するために必要な情報をまとめております。
* "Wallet"と"Verifier"が同じデバイス上で利用される場合は[Same device]をご参照ください。（"Verifier"がWebアプリの場合も同様）  
　異なるデバイスで利用される場合は[Cross device]をご参照ください。
* [Sequence]では処理全体のシーケンス、[Request / Response parameters]では  
　「"Verifier"と"Verifier Endpoint"間」または「"Wallet"と"Verifier Endpoint"間」のリクエスト/レスポンスの内容を記載しております。
* "Verifier Endpoint"を弊社にて作成しており、別途ご提供いたします。
* [Request / Response parameters]に記載している"Verifier Endpoint"のURLは、EUDIWのプロジェクトが公開している[verifier-endpoint]のURLとなります。  
　また、各パラメータ値はサンプルのものとなります。  
　このため、提供する"Verifier Endpoint"の稼働環境にあわせて変更いただく必要があります。
* [Verifier Endpoint]は、汎用性を意識してフレームワークとしてHonoベースで稼働するものとなります。  
　AWSであれば Lambda等でHonoを稼働し、そのうえで[Verifier Endpoint]を展開いただくことが可能です。  
　Lambdaで稼働する場合の設定用ドキュメントについて、別途手配を予定しております。
 
 
## ドキュメント

### シーケンス図

#### Same device

- [Markdown](docs/sequence/same_device.md)
- [PDF](docs/sequence/same_device.pdf)

#### Cross device

- [Markdown](docs/sequence/cross_device.md)
- [PDF](docs/sequence/cross_device.pdf)

## 補足

ご提示の内容は、以下をベースに作成を行っております。  
①[OpenID for Verifiable Presentations - draft 20](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)  
②[EUDIのVerifier Endpointのリファレンス実装のREADME](https://github.com/eu-digital-identity-wallet/eudi-srv-web-verifier-endpoint-23220-4-kt)  
①をベースに②が実装されているものとなりますので、不明点がございましたらこちらも合わせてご参照ください。