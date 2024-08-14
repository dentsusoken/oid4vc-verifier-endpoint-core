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

import { EmbedOption } from './EmbedOption';
import { JarmOption } from './JarmOption';
import { RequestId } from './RequestId';

/**
 * Represents the metadata of a client in the authentication process.
 */
export class ClientMetaData {
  /**
   * Constructor for the class.
   * @param {EmbedOption<RequestId>} jwkOption - The JWK (JSON Web Key) option for the request ID.
   * @param {string|undefined} idTokenSignedResponseAlg - The algorithm used for signing the ID token response.
   * @param {string|undefined} idTokenEncryptedResponseAlg - The algorithm used for encrypting the ID token response.
   * @param {string|undefined} idTokenEncryptedResponseEnc - The encryption method used for the ID token response.
   * @param {string[]} subjectSyntaxTypesSupported - An array of supported subject syntax types.
   * @param {JarmOption} jarmOption - The JARM (JWT Secured Authorization Response Mode) option.
   */
  constructor(
    public jwkOption: EmbedOption<RequestId>,
    public idTokenSignedResponseAlg: string | undefined,
    public idTokenEncryptedResponseAlg: string | undefined,
    public idTokenEncryptedResponseEnc: string | undefined,
    public subjectSyntaxTypesSupported: string[],
    public jarmOption: JarmOption
  ) {}
}
