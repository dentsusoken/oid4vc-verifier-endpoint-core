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
   * Creates an instance of ClientMetaData.
   * @param {EmbedOption<RequestId>} jwkOption - The JWK (JSON Web Key) option for the client.
   * @param {string} idTokenSignedResponseAlg - The algorithm used for signing ID tokens.
   * @param {string} idTokenEncryptedResponseAlg - The algorithm used for encrypting ID tokens.
   * @param {string} idTokenEncryptedResponseEnc - The encryption method used for ID tokens.
   * @param {string[]} subjectSyntaxTypesSupported - The subject syntax types supported by the client.
   * @param {JarmOption} jarmOption - The JARM (JWT Secured Authorization Response Mode) option for the client.
   */
  constructor(
    public jwkOption: EmbedOption<RequestId>,
    public idTokenSignedResponseAlg: string,
    public idTokenEncryptedResponseAlg: string,
    public idTokenEncryptedResponseEnc: string,
    public subjectSyntaxTypesSupported: string[],
    public jarmOption: JarmOption
  ) {}
}
