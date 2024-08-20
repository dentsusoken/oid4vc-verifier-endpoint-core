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

import { z } from 'zod';

/**
 * Zod schema for validating the structure of a JWK (JSON Web Key) object.
 *
 * This schema ensures that the JWK object contains the following required properties:
 * - kty: Key Type (string)
 * - crv: Curve (string)
 * - x: X Coordinate (string)
 * - y: Y Coordinate (string)
 * - d: Private Key (string)
 *
 * @type {z.ZodObject<{kty: z.ZodString, crv: z.ZodString, x: z.ZodString, y: z.ZodString, d: z.ZodString}>}
 */
const jwkSchema = z.object({
  kty: z.string(),
  crv: z.string(),
  x: z.string(),
  y: z.string(),
  d: z.string(),
});

/**
 * Zod schema for validating an ephemeral ECDH private key in JWK format as a JSON string.
 *
 * This schema applies the following validations:
 * 1. The input must be a string.
 * 2. The string must be a valid JSON.
 * 3. The parsed JSON object must conform to the jwkSchema structure.
 *
 * @type {z.ZodEffects<z.ZodString>}
 *
 * @example
 * // Valid usage
 * const validJwk = '{"kty":"EC","crv":"P-256","x":"example-x","y":"example-y","d":"example-d"}';
 * ephemeralECDHPrivateJwkSchema.parse(validJwk); // Returns the validJwk string
 *
 * // Invalid usage (will throw ZodError)
 * ephemeralECDHPrivateJwkSchema.parse('{"kty":"EC"}'); // Missing required properties
 * ephemeralECDHPrivateJwkSchema.parse('not a json'); // Not a valid JSON string
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
export const ephemeralECDHPrivateJwkSchema = z.string().refine(
  (str) => {
    try {
      const parsed = JSON.parse(str);
      return jwkSchema.safeParse(parsed).success;
    } catch {
      return false;
    }
  },
  {
    message:
      'Must be a valid JSON string representing a JWK with kty, crv, x, y, and d properties',
  }
);

/**
 * Represents an ephemeral ECDH private key in JWK format.
 *
 * This class encapsulates a JWK string representing an ephemeral ECDH private key.
 * It provides methods for JSON serialization.
 */
export class EphemeralECDHPrivateJwk {
  /**
   * Creates a new instance of EphemeralECDHPrivateJwk.
   *
   * @param {string} value - The JWK string representing the ephemeral ECDH private key.
   */
  constructor(public value: string) {}

  /**
   * Returns the JWK string for JSON serialization.
   *
   * This method is used by JSON.stringify() to serialize the object.
   *
   * @returns {string} The JWK string.
   */
  toJSON(): string {
    return this.value;
  }
}
