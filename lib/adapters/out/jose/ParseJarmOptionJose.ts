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

import {
  AbstractParseJarmOption,
  ParseJarmOption,
} from '../../../ports/out/jose/';

export const createParseJarmOptionJoseInvoker = (): ParseJarmOption => {
  return (jwsAlg, jweAlg, encryptionMethod) =>
    new ParseJarmOptionJose().invoke(jwsAlg, jweAlg, encryptionMethod);
};

const JWS_ALGS: { [index: string]: boolean } = { RS256: true, ES256: true };
const JWE_ALGS: { [index: string]: boolean } = { 'ECDH-ES': true };
const JWE_ENCS: { [index: string]: boolean } = { 'A128CBC-HS256': true };

class ParseJarmOptionJose extends AbstractParseJarmOption {
  jwsAlgOf(s: string): string {
    if (JWS_ALGS[s]) {
      return s;
    }
    throw new Error(`Invalid JWS alg: ${s}`);
  }

  jweAlgOf(s: string): string {
    if (JWE_ALGS[s]) {
      return s;
    }
    throw new Error(`Invalid JWE alg: ${s}`);
  }

  encMethodOf(s: string): string {
    if (JWE_ENCS[s]) {
      return s;
    }
    throw new Error(`Invalid JWE enc: ${s}`);
  }
}
