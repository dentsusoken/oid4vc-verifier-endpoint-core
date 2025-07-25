# oid4vc-verifier-endpoint-core

## Introduction

This project is based on the [verifier-endpoint](https://github.com/eu-digital-identity-wallet/eudi-srv-web-verifier-endpoint-23220-4-kt) published by the EUDIW project and organizes the implementation content as a Verifier.

## Overview

- This repository contains the necessary information to implement VP (Verifiable Presentation) requests and verification functions as a "Verifier".
- For cases where "Wallet" and "Verifier" are used on the same device, please refer to [Same device]. (This also applies when "Verifier" is a web application)
  For cases where they are used on different devices, please refer to [Cross device].
- [Sequence] documents the overall processing sequence, while [Request / Response parameters] documents
  the request/response content between "Verifier and Verifier Endpoint" or "Wallet and Verifier Endpoint".
- We have created a "Verifier Endpoint" which will be provided separately.
- The "Verifier Endpoint" URLs documented in [Request / Response parameters] are from the [verifier-endpoint](https://github.com/eu-digital-identity-wallet/eudi-srv-web-verifier-endpoint-23220-4-kt) published by the EUDIW project.
  Also, each parameter value is a sample.
  Therefore, you will need to modify them according to the operating environment of the provided "Verifier Endpoint".
- The [Verifier Endpoint] is designed as a framework with versatility in mind, operating on Hono.
  For AWS, you can run Hono on Lambda and deploy the [Verifier Endpoint] on top of it.
  Documentation for Lambda deployment configuration is planned to be provided separately.

## Documentation

### Sequence Diagrams

- [Same device](docs/sequence/same_device.md)
- [Cross device](docs/sequence/cross_device.md)

### API Documentation

#### Frontend

- [Initiate Transaction](docs/api/frontend/InitiateTransaction.md)
- [Get Wallet Response](docs/api/frontend/GetWalletResponse.md)

#### Wallet

- [Get Authorization Request](docs/api/wallet/GetAuthorizationRequest.md)
- [Get Public Key](docs/api/wallet/GetPublicKey.md)
- [Post Wallet Response](docs/api/wallet/PostWalletResponse.md)

### Development Guides

- [Verifier Endpoint Building Guide](docs/verifier_endpoint_building_guide.md)

### JWK Generation

- [How to Generate JWK with X509 Certificate](docs/jwk_generate/how_to_generate_JWK_with_x509_certificate.md)

## Additional Information

The content provided is based on the following:

1. [OpenID for Verifiable Presentations - draft 20](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)
2. [EUDI Verifier Endpoint Reference Implementation README](https://github.com/eu-digital-identity-wallet/eudi-srv-web-verifier-endpoint-23220-4-kt)
   2 is implemented based on 1, so please refer to both if you have any questions.
