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
import { UrlBuilder, urlBuilderSchema } from './UrlBuilder';
import { FromJSON } from '../common/json/FromJSON';

export type EmbedOption = EmbedOption.ByValue | EmbedOption.ByReference;

const byValueSchema = z.object({
  __type: z.literal('ByValue'),
});

const byReferenceSchema = z.object({
  __type: z.literal('ByReference'),
  url_builder: urlBuilderSchema,
});

export const embedOptionSchema = z.discriminatedUnion('__type', [
  byValueSchema,
  byReferenceSchema,
]);

export type EmbedOptionJSON = z.infer<typeof embedOptionSchema>;

export namespace EmbedOption {
  export const fromJSON: FromJSON<EmbedOptionJSON, EmbedOption> = (json) => {
    switch (json.__type) {
      case 'ByValue':
        return ByValue.INSTANCE;
      case 'ByReference':
        return new ByReference(UrlBuilder.fromJSON(json.url_builder));
    }
  };

  interface Base {
    readonly __type: 'ByValue' | 'ByReference';
    toJSON(): EmbedOptionJSON;
  }

  export class ByValue implements Base {
    static readonly INSTANCE = new ByValue();

    readonly __type = 'ByValue' as const;

    private constructor() {}

    toJSON() {
      return {
        __type: this.__type,
      };
    }
  }

  export class ByReference implements Base {
    readonly __type = 'ByReference' as const;

    constructor(public urlBuilder: UrlBuilder) {}

    toJSON() {
      return {
        __type: this.__type,
        url_builder: this.urlBuilder.toJSON(),
      };
    }
  }
}
