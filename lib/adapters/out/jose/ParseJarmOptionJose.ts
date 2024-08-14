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

import { ParseJarmOption } from '../../../ports/out/jose/';
import { JarmOption } from '../../../domain';

/**
 * Creates a function to parse JARM options
 * @returns {ParseJarmOption} A function that parses JARM options
 */
// export const createParseJarmOptionJoseInvoker = (): ParseJarmOption => parseJarmOption;

/**
 * Valid JWS algorithms
 */
const JWS_ALGS: { [index: string]: boolean } = { ES256: true };

/**
 * Valid JWE algorithms
 */
const JWE_ALGS: { [index: string]: boolean } = { 'ECDH-ES+A256KW': true };

/**
 * Valid JWE encryption methods
 */
const JWE_ENCS: { [index: string]: boolean } = { A256GCM: true };

/**
 * Parses JARM options
 * @param {string | null | undefined} jwsAlg - JWS algorithm
 * @param {string | null | undefined} jweAlg - JWE algorithm
 * @param {string | null | undefined} jweEnc - Encryption method
 * @returns {JarmOption.Signed | JarmOption.Encrypted | JarmOption.SignedAndEncrypted | null} Parsed JARM option
 * @throws {Error} If invalid combination of parameters is provided
 */
export const parseJarmOption: ParseJarmOption = (jwsAlg, jweAlg, jweEnc) => {
  jwsAlg = (jwsAlg && jwsAlg.trim()) || undefined;
  jweAlg = (jweAlg && jweAlg.trim()) || undefined;
  jweEnc = (jweEnc && jweEnc.trim()) || undefined;

  const signed: JarmOption.Signed | undefined = jwsAlg
    ? new JarmOption.Signed(jwsAlgOf(jwsAlg))
    : undefined;
  const encrypted: JarmOption.Encrypted | undefined =
    jweAlg && jweEnc
      ? new JarmOption.Encrypted(jweAlgOf(jweAlg), jweEncOf(jweEnc))
      : undefined;
  if (jweAlg && !jweEnc) {
    throw 'Encryption method must be provided with JWE algorithm';
  }
  if (!jweAlg && jweEnc) {
    throw 'JWE algorithm must be provided with Encryption method';
  }
  if (signed && encrypted) {
    return new JarmOption.SignedAndEncrypted(signed, encrypted);
  } else if (signed) {
    return signed;
  } else if (encrypted) {
    return encrypted;
  } else {
    return undefined;
  }
};

/**
 * Validates and returns the JWS algorithm
 * @param {string} s - JWS algorithm string
 * @returns {string} Validated JWS algorithm
 * @throws {Error} If invalid JWS algorithm is provided
 */
const jwsAlgOf = (s: string): string => {
  if (JWS_ALGS[s]) {
    return s;
  }
  throw new Error(`Invalid JWS alg: ${s}`);
};

/**
 * Validates and returns the JWE algorithm
 * @param {string} s - JWE algorithm string
 * @returns {string} Validated JWE algorithm
 * @throws {Error} If invalid JWE algorithm is provided
 */
const jweAlgOf = (s: string): string => {
  if (JWE_ALGS[s]) {
    return s;
  }
  throw new Error(`Invalid JWE alg: ${s}`);
};

/**
 * Validates and returns the encryption method
 * @param {string} s - Encryption method string
 * @returns {string} Validated encryption method
 * @throws {Error} If invalid encryption method is provided
 */
const jweEncOf = (s: string): string => {
  if (JWE_ENCS[s]) {
    return s;
  }
  throw new Error(`Invalid JWE enc: ${s}`);
};
