/*
 * Copyright (c) 2023 European Commission
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Expose } from 'class-transformer';

/**
 * Represents the accepted response from a wallet.
 * This class is used to encapsulate the redirect URI provided in the wallet's response.
 */
export class WalletResponseAcceptedTO {
  /**
   * The URI to which the user should be redirected after the wallet operation.
   * This property is serialized/deserialized as 'redirect_uri' in JSON.
   */
  @Expose({ name: 'redirect_uri' })
  redirectUri?: string;

  /**
   * Creates a new instance of WalletResponseAcceptedTO.
   * @param redirectUri - The URI to which the user should be redirected. Optional.
   */
  constructor();
  constructor(redirectUri: string);
  constructor(redirectUri?: string) {
    this.redirectUri = redirectUri;
  }
}
