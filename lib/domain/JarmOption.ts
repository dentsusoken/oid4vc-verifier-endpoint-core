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
 * @typedef {JarmOption.Signed | JarmOption.Encrypted | JarmOption.SignedAndEncrypted} JarmOption
 */
export type JarmOption =
  | JarmOption.Signed
  | JarmOption.Encrypted
  | JarmOption.SignedAndEncrypted;

/**
 * Namespace for JARM option related classes and functions.
 * @namespace JarmOption
 */
export namespace JarmOption {
  /**
   * Interface representing a JARM option.
   * @interface JarmOption
   */
  interface JarmOption {
    /**
     * The type of the JARM option.
     * @type {('Signed' | 'Encrypted' | 'SignedAndEncrypted')}
     * @readonly
     */
    readonly __type: 'Signed' | 'Encrypted' | 'SignedAndEncrypted';

    /**
     * Returns the JWS (JSON Web Signature) algorithm used for signing.
     * @returns {(string | undefined)} The JWS algorithm or undefined if not applicable.
     */
    jwsAlg(): string | undefined;

    /**
     * Returns the JWE (JSON Web Encryption) algorithm used for encryption.
     * @returns {(string | undefined)} The JWE algorithm or undefined if not applicable.
     */
    jweAlg(): string | undefined;

    /**
     * Returns the encryption method used for JARM.
     * @returns {(string | undefined)} The encryption method or undefined if not applicable.
     */
    jweEnc(): string | undefined;
  }

  /**
   * Represents a JARM option for signed responses.
   * @class Signed
   * @implements {JarmOption}
   */
  export class Signed implements JarmOption {
    /**
     * The type of the JARM option.
     * @type {('Signed')}
     * @readonly
     */
    readonly __type = 'Signed' as const;

    /**
     * Creates an instance of Signed.
     * @param {string} algorithm - The JWS algorithm used for signing.
     */
    constructor(public algorithm: string) {}

    /**
     * Returns the JWS algorithm used for signing.
     * @returns {string} The JWS algorithm.
     */
    jwsAlg(): string {
      return this.algorithm;
    }

    /**
     * Returns undefined since JWE algorithm is not applicable for signed responses.
     * @returns {undefined} Always returns undefined.
     */
    jweAlg(): undefined {
      return undefined;
    }

    /**
     * Returns undefined since encryption method is not applicable for signed responses.
     * @returns {undefined} Always returns undefined.
     */
    jweEnc(): undefined {
      return undefined;
    }
  }

  /**
   * Represents a JARM option for encrypted responses.
   * @class Encrypted
   * @implements {JarmOption}
   */
  export class Encrypted implements JarmOption {
    /**
     * The type of the JARM option.
     * @type {('Encrypted')}
     * @readonly
     */
    readonly __type = 'Encrypted' as const;

    /**
     * Creates an instance of Encrypted.
     * @param {string} algorithm - The JWE algorithm used for encryption.
     * @param {string} encMethod - The encryption method used for JARM.
     */
    constructor(public algorithm: string, public encMethod: string) {}

    /**
     * Returns undefined since JWS algorithm is not applicable for encrypted responses.
     * @returns {undefined} Always returns undefined.
     */
    jwsAlg(): undefined {
      return undefined;
    }

    /**
     * Returns the JWE algorithm used for encryption.
     * @returns {string} The JWE algorithm.
     */
    jweAlg(): string {
      return this.algorithm;
    }

    /**
     * Returns the encryption method used for JARM.
     * @returns {string} The encryption method.
     */
    jweEnc(): string {
      return this.encMethod;
    }
  }

  /**
   * Represents a JARM option for signed and encrypted responses.
   * @class SignedAndEncrypted
   * @implements {JarmOption}
   */
  export class SignedAndEncrypted implements JarmOption {
    /**
     * The type of the JARM option.
     * @type {('SignedAndEncrypted')}
     * @readonly
     */
    readonly __type = 'SignedAndEncrypted' as const;

    /**
     * Creates an instance of SignedAndEncrypted.
     * @param {Signed} signed - The signed JARM option.
     * @param {Encrypted} encrypted - The encrypted JARM option.
     */
    constructor(public signed: Signed, public encrypted: Encrypted) {}

    /**
     * Returns the JWS algorithm used for signing.
     * @returns {string} The JWS algorithm.
     */
    jwsAlg(): string {
      return this.signed.algorithm;
    }

    /**
     * Returns the JWE algorithm used for encryption.
     * @returns {string} The JWE algorithm.
     */
    jweAlg(): string {
      return this.encrypted.algorithm;
    }

    /**
     * Returns the encryption method used for JARM.
     * @returns {string} The encryption method.
     */
    jweEnc(): string {
      return this.encrypted.encMethod;
    }
  }
}
