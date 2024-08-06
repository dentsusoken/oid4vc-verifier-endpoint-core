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

/**
 * Represents the options for JARM (JWT Secured Authorization Response Mode).
 */
export interface JarmOption {
  /**
   * Returns the JWS (JSON Web Signature) algorithm used for signing.
   * @returns The JWS algorithm or undefined if not applicable.
   */
  jwsAlg(): string | undefined;

  /**
   * Returns the JWE (JSON Web Encryption) algorithm used for encryption.
   * @returns The JWE algorithm or undefined if not applicable.
   */
  jweAlg(): string | undefined;

  /**
   * Returns the encryption method used for JARM.
   * @returns The encryption method or undefined if not applicable.
   */
  jweEnc(): string | undefined;
}

/**
 * Namespace for JARM option related classes and functions.
 */
export namespace JarmOptionNS {
  /**
   * Represents a JARM option for signed responses.
   */
  export class Signed implements JarmOption {
    /**
     * Creates an instance of Signed.
     * @param algorithm - The JWS algorithm used for signing.
     */
    constructor(public algorithm: string) {}

    jwsAlg(): string | undefined {
      return this.algorithm;
    }

    jweAlg(): string | undefined {
      return undefined;
    }

    jweEnc(): string | undefined {
      return undefined;
    }
  }

  /**
   * Represents a JARM option for encrypted responses.
   */
  export class Encrypted implements JarmOption {
    /**
     * Creates an instance of Encrypted.
     * @param algorithm - The JWE algorithm used for encryption.
     * @param encMethod - The encryption method used for JARM.
     */
    constructor(public algorithm: string, public encMethod: string) {}

    jwsAlg(): string | undefined {
      return undefined;
    }

    jweAlg(): string | undefined {
      return this.algorithm;
    }

    jweEnc(): string | undefined {
      return this.encMethod;
    }
  }

  /**
   * Represents a JARM option for signed and encrypted responses.
   */
  export class SignedAndEncrypted implements JarmOption {
    /**
     * Creates an instance of SignedAndEncrypted.
     * @param signed - The signed JARM option.
     * @param encrypted - The encrypted JARM option.
     */
    constructor(public signed: Signed, public encrypted: Encrypted) {}

    jwsAlg(): string | undefined {
      return this.signed.algorithm;
    }
    jweAlg(): string | undefined {
      return this.encrypted.algorithm;
    }
    jweEnc(): string | undefined {
      return this.encrypted.encMethod;
    }
  }

  /**
   * Checks if a JARM option is an instance of Signed.
   * @param option - The JARM option to check.
   * @returns True if the option is an instance of Signed, false otherwise.
   */
  export function isSigned(option: JarmOption): option is Signed {
    return option.constructor === Signed;
  }

  /**
   * Checks if a JARM option is an instance of Encrypted.
   * @param option - The JARM option to check.
   * @returns True if the option is an instance of Encrypted, false otherwise.
   */
  export function isEncrypted(option: JarmOption): option is Encrypted {
    return option.constructor === Encrypted;
  }

  /**
   * Checks if a JARM option is an instance of SignedAndEncrypted.
   * @param option - The JARM option to check.
   * @returns True if the option is an instance of SignedAndEncrypted, false otherwise.
   */
  export function isSignedAndEncrypted(
    option: JarmOption
  ): option is SignedAndEncrypted {
    return option.constructor === SignedAndEncrypted;
  }
}
