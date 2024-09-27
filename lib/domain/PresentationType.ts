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
  PresentationDefinition,
  presentationDefinitionSchema,
} from 'oid4vc-prex';
import { IdTokenType, idTokenTypeSchema } from './IdTokenType';
import { FromJSON } from '../common/json/FromJSON';
import { z } from 'zod';

const idTokenRequestSchema = z.object({
  __type: z.literal('IdTokenRequest'),
  id_token_type: z.array(idTokenTypeSchema),
});

/**
 * Zod schema for validating ID Token Request objects.
 *
 * This schema defines the structure and types for an ID Token Request:
 * - __type: Must be the literal string 'IdTokenRequest'
 * - id_token_type: An array of ID token types
 *
 * @type {z.ZodObject<{
 *   __type: z.ZodLiteral<'IdTokenRequest'>,
 *   id_token_type: z.ZodArray<typeof idTokenTypeSchema>
 * }>}
 *
 * @example
 * // Valid usage
 * const validRequest = {
 *   __type: 'IdTokenRequest',
 *   id_token_type: ['subject_signed_id_token', 'attester_signed_id_token']
 * };
 * idTokenRequestSchema.parse(validRequest);
 *
 * // Invalid usage (will throw ZodError)
 * const invalidRequest = {
 *   __type: 'InvalidType',
 *   id_token_type: ['invalid_type']
 * };
 * idTokenRequestSchema.parse(invalidRequest); // Throws ZodError
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
const vpTokenRequestSchema = z.object({
  __type: z.literal('VpTokenRequest'),
  presentation_definition: presentationDefinitionSchema,
});

/**
 * Zod schema for validating ID and VP Token Request objects.
 *
 * This schema defines the structure and types for a combined ID and VP (Verifiable Presentation) Token Request:
 * - __type: Must be the literal string 'IdAndVpTokenRequest'
 * - id_token_type: An array of ID token types
 * - presentation_definition: A Presentation Definition object
 *
 * @type {z.ZodObject<{
 *   __type: z.ZodLiteral<'IdAndVpTokenRequest'>,
 *   id_token_type: z.ZodArray<typeof idTokenTypeSchema>,
 *   presentation_definition: typeof presentationDefinitionSchema
 * }>}
 *
 * @example
 * // Valid usage
 * const validRequest = {
 *   __type: 'IdAndVpTokenRequest',
 *   id_token_type: ['subject_signed_id_token'],
 *   presentation_definition: {
 *     id: 'example_pd_id',
 *     input_descriptors: [
 *       // ... presentation definition details
 *     ]
 *   }
 * };
 * idAndVpTokenRequestSchema.parse(validRequest);
 *
 * // Invalid usage (will throw ZodError)
 * const invalidRequest = {
 *   __type: 'InvalidType',
 *   id_token_type: ['invalid_type'],
 *   presentation_definition: {}
 * };
 * idAndVpTokenRequestSchema.parse(invalidRequest); // Throws ZodError
 *
 * @throws {z.ZodError} Throws a ZodError if the input fails validation
 */
const idAndVpTokenRequestSchema = z.object({
  __type: z.literal('IdAndVpTokenRequest'),
  id_token_type: z.array(idTokenTypeSchema),
  presentation_definition: presentationDefinitionSchema,
});

/**
 * Base Zod schema for validating PresentationType objects without transformation.
 *
 * This schema uses a discriminated union based on the '__type' field to determine
 * which specific PresentationType to validate. It supports:
 * - IdTokenRequest
 * - VpTokenRequest
 * - IdAndVpTokenRequest
 *
 * This schema only performs validation and does not transform the input into
 * class instances. It's used as a base for further processing or transformation.
 *
 * @type {z.ZodDiscriminatedUnion<
 *   "__type",
 *   [
 *     typeof idTokenRequestSchema,
 *     typeof vpTokenRequestSchema,
 *     typeof idAndVpTokenRequestSchema
 *   ]
 */
// export const presentationTypeSchema = z.discriminatedUnion('__type', [
//   idTokenRequestSchema,
//   vpTokenRequestSchema,
//   idAndVpTokenRequestSchema,
// ]);

export const presentationTypeSchema: z.ZodType<
  | { __type: 'IdTokenRequest'; id_token_type: IdTokenType[] }
  | {
      __type: 'VpTokenRequest';
      presentation_definition: PresentationDefinition;
    }
  | {
      __type: 'IdAndVpTokenRequest';
      id_token_type: IdTokenType[];
      presentation_definition: PresentationDefinition;
    }
> = z.discriminatedUnion('__type', [
  idTokenRequestSchema,
  vpTokenRequestSchema,
  idAndVpTokenRequestSchema,
]);

export type PresentationTypeJSON = z.infer<typeof presentationTypeSchema>;

/**
 * Namespace containing implementations and type guards for various PresentationType.
 */
export namespace PresentationType {
  export const fromJSON: FromJSON<PresentationTypeJSON, PresentationType> = (
    json
  ) => {
    switch (json.__type) {
      case 'IdTokenRequest':
        return new PresentationType.IdTokenRequest(json.id_token_type);
      case 'VpTokenRequest': {
        const pd = PresentationDefinition.fromJSON(
          json.presentation_definition
        );

        return new PresentationType.VpTokenRequest(pd);
      }
      case 'IdAndVpTokenRequest': {
        const pd = PresentationDefinition.fromJSON(
          json.presentation_definition
        );

        return new PresentationType.IdAndVpTokenRequest(json.id_token_type, pd);
      }
    }
  };

  interface Base {
    __type: 'IdTokenRequest' | 'VpTokenRequest' | 'IdAndVpTokenRequest';

    toJSON(): PresentationTypeJSON;
  }

  /**
   * Represents a request for an ID token.
   */
  export class IdTokenRequest implements Base {
    readonly __type = 'IdTokenRequest' as const;

    /**
     * Creates an instance of IdTokenRequest.
     * @param idTokenType - An array of ID token types.
     */
    constructor(public idTokenType: IdTokenType[]) {}

    /**
     * Converts the instance to a JSON-serializable object.
     *
     * This method is automatically called by JSON.stringify() when serializing the object.
     * It returns an object with the following properties:
     * - __type: The type of the request (always 'IdTokenRequest' for this class)
     * - id_token_type: An array of ID token types
     *
     * @returns {Object} An object representation of the instance
     * @returns {string} returns.__type - The type of the request
     * @returns {string[]} returns.id_token_type - An array of ID token types
     *
     * @example
     * const request = new IdTokenRequest(['subject_signed_id_token']);
     * const jsonString = JSON.stringify(request);
     * console.log(jsonString);
     * // Output: {"__type":"IdTokenRequest","id_token_type":["subject_signed_id_token"]}
     */
    toJSON() {
      return {
        __type: this.__type,
        id_token_type: this.idTokenType,
      };
    }
  }

  /**
   * Represents a request for a VP token.
   */
  export class VpTokenRequest implements Base {
    readonly __type = 'VpTokenRequest' as const;

    /**
     * Creates an instance of VpTokenRequest.
     * @param presentationDefinition - The presentation definition for the VP token.
     */
    constructor(public presentationDefinition: PresentationDefinition) {}

    /**
     * Converts the instance to a JSON-serializable object.
     *
     * This method is automatically called by JSON.stringify() when serializing the object.
     * It returns an object with the type of the request and the serialized presentation definition.
     *
     * @example
     * const presentationDefinition = new PresentationDefinition({ id: 'example', input_descriptors: [] });
     * const request = new VpTokenRequest(presentationDefinition);
     * const jsonString = JSON.stringify(request);
     * console.log(jsonString);
     * // Output: {"__type":"VpTokenRequest","presentation_definition":{"id":"example","input_descriptors":[]}}
     */
    toJSON() {
      return {
        __type: this.__type,
        presentation_definition: this.presentationDefinition.toJSON(),
      };
    }
  }

  /**
   * Represents a request for both an ID token and a VP token.
   */
  export class IdAndVpTokenRequest implements Base {
    readonly __type = 'IdAndVpTokenRequest' as const;

    /**
     * Creates an instance of IdAndVpTokenRequest.
     * @param idTokenType - An array of ID token types.
     * @param presentationDefinition - The presentation definition for the VP token.
     */
    constructor(
      public idTokenType: IdTokenType[],
      public presentationDefinition: PresentationDefinition
    ) {}

    /**
     * Converts the instance to a JSON-serializable object.
     *
     * This method is automatically called by JSON.stringify() when serializing the object.
     * It returns an object containing the type of the request, the array of ID token types,
     * and the serialized presentation definition.
     *
     * @example
     * const presentationDefinition = new PresentationDefinition({ id: 'example', input_descriptors: [] });
     * const request = new IdAndVpTokenRequest(['subject_signed_id_token'], presentationDefinition);
     * const jsonString = JSON.stringify(request);
     * console.log(jsonString);
     * // Output: {
     * //   "__type": "IdAndVpTokenRequest",
     * //   "id_token_type": ["subject_signed_id_token"],
     * //   "presentation_definition": {"id":"example","input_descriptors":[]}
     * // }
     */
    toJSON() {
      return {
        __type: this.__type,
        id_token_type: this.idTokenType,
        presentation_definition: this.presentationDefinition.toJSON(),
      };
    }
  }
}

/**
 * Represents the type of presentation request.
 * @typedef {PresentationType.IdTokenRequest | PresentationType.VpTokenRequest | PresentationType.IdAndVpTokenRequest} PresentationType
 */
export type PresentationType =
  | PresentationType.IdTokenRequest
  | PresentationType.VpTokenRequest
  | PresentationType.IdAndVpTokenRequest;
