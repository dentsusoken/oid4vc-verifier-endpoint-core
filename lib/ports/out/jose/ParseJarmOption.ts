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

import { JarmOption } from '../../../domain';

/**
 * Models a function that parses three strings into a [JarmOption]
 */
export interface ParseJarmOption {
  /**
   *
   * @param jwsAlg an optional string representing a JWS algorithm
   * @param jweAlg an optional string representing a JWE algorithm
   * @param encryptionMethod an optional string representing an encryption method
   * @return a [JarmOption] or null
   */
  (
    jwsAlg: string | null,
    jweAlg: string | null,
    encryptionMethod: string | null
  ): JarmOption | null;
}

export abstract class AbstractParseJarmOption {
  invoke: ParseJarmOption = (jwsAlg, jweAlg, encryptionMethod) => {
    jwsAlg = (jwsAlg && jwsAlg.trim()) || null;
    jweAlg = (jweAlg && jweAlg.trim()) || null;
    encryptionMethod = (encryptionMethod && encryptionMethod.trim()) || null;

    const signed: JarmOption.Signed | null = jwsAlg
      ? new JarmOption.Signed(this.jwsAlgOf(jwsAlg))
      : null;
    const encrypted: JarmOption.Encrypted | null =
      jweAlg && encryptionMethod
        ? new JarmOption.Encrypted(
            this.jweAlgOf(jweAlg),
            this.encMethodOf(encryptionMethod)
          )
        : null;
    if (jweAlg && !encryptionMethod) {
      throw 'Encryption method must be provided with JWE algorithm';
    }
    if (!jweAlg && encryptionMethod) {
      throw 'JWE algorithm must be provided with Encryption method';
    }
    if (signed && encrypted) {
      return new JarmOption.SignedAndEncrypted(signed, encrypted);
    } else if (signed) {
      return signed;
    } else if (encrypted) {
      return encrypted;
    } else {
      return null;
    }
  };

  abstract jwsAlgOf(s: string): string;
  abstract jweAlgOf(s: string): string;
  abstract encMethodOf(s: string): string;
}

// export function parseJarmOption(
//   jwsAlg: string | null,
//   jweAlg: string | null,
//   encryptionMethod: string | null
// ): JarmOption | null {
//   const signed: JarmOption.Signed | null =
//     jwsAlg && jwsAlg.trim() !== ''
//       ? new JarmOption.Signed(jwsAlgOf(jwsAlg))
//       : null;
//   const encrypted: JarmOption.Encrypted | null =
//     jweAlg &&
//     jweAlg.trim() !== '' &&
//     encryptionMethod &&
//     encryptionMethod.trim() !== ''
//       ? new JarmOption.Encrypted(
//           jweAlgOf(jweAlg),
//           encMethodOf(encryptionMethod)
//         )
//       : null;

//   if (signed && encrypted) {
//     return new JarmOption.SignedAndEncrypted(signed, encrypted);
//   } else if (signed) {
//     return signed;
//   } else if (encrypted) {
//     return encrypted;
//   } else {
//     return null;
//   }
// }
