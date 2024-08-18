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

import { FromJSON } from '../common/json/FromJSON';

/**
 * Enum representing the response mode options for authorization responses.
 */
export enum ResponseModeOption {
  /**
   * Direct POST response mode.
   * The authorization response is sent as a direct POST request to the client.
   */
  DirectPost = 'direct_post',

  /**
   * Direct POST JWT response mode.
   * The authorization response is sent as a JWT in a direct POST request to the client.
   */
  DirectPostJwt = 'direct_post.jwt',
}

const schema = z.enum([
  ResponseModeOption.DirectPost,
  ResponseModeOption.DirectPostJwt,
]);

export namespace ResponseModeOption {
  export const fromJSON: FromJSON<ResponseModeOption> = (json) =>
    schema.parse(json);

  export const toJSON = (responseMode: ResponseModeOption): string =>
    responseMode as string;
}
