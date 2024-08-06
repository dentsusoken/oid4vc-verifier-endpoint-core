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
 * Guesses the algorithm from a given JSON Web Key (JWK).
 *
 * This function attempts to determine the algorithm based on the properties of the JWK:
 * 1. If the JWK has an 'alg' property, it returns that value.
 * 2. For EC keys, it maps the curve to the corresponding ECDSA algorithm.
 * 3. For OKP keys with the Ed25519 curve, it returns EdDSA.
 * 4. For other key types or unknown curves, it returns null.
 *
 * @param {any} jwk - The JSON Web Key object to analyze.
 * @returns {string | null} The guessed algorithm as a string, or null if the algorithm cannot be determined.
 *
 * @example
 * const jwk = { kty: 'EC', crv: 'P-256' };
 * const algorithm = guessAlgorithmFromJWK(jwk);
 * console.log(algorithm); // Outputs: 'ES256'
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const guessAlgorithmFromJWK = (jwk: any): string | null => {
  if (jwk.alg) {
    return jwk.alg;
  }

  switch (jwk.kty) {
    case 'EC':
      switch (jwk.crv) {
        case 'P-256':
          return 'ES256';
        case 'P-384':
          return 'ES384';
        case 'P-521':
          return 'ES512';
        default:
          return null;
      }
    case 'OKP':
      if (jwk.crv === 'Ed25519') {
        return 'EdDSA';
      }
      return null;
    default:
      return null;
  }
};
