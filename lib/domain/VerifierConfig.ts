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
import { UrlBuilder } from './UrlBuilder';
import { EmbedOption } from './EmbedOption';
import { ResponseModeOption } from './ResponseModeOption';
import { Duration } from './Duration';
import { ClientMetaData } from './ClientMetaData';
import { ClientIdScheme } from './ClientIdScheme';

/**
 * Configuration class for the verifier in an authentication or authorization process.
 */
export class VerifierConfig {
  /**
   * Creates a new instance of VerifierConfig.
   *
   * @param clientIdScheme - The scheme used for client identification.
   * @param jarOption - The option for embedding the request as a JWT (JSON Web Token).
   * @param presentationDefinitionOption - The option for embedding the presentation definition.
   * @param responseModeOption - The option specifying how the response should be returned.
   * @param responseUrlBuilder - A function to build the URL for the response.
   * @param maxAge - The maximum allowed age for the authentication.
   * @param clientMetaData - Metadata about the client.
   */
  constructor(
    public clientIdScheme: ClientIdScheme,
    public jarOption: EmbedOption,
    public presentationDefinitionOption: EmbedOption,
    public responseModeOption: ResponseModeOption,
    public responseUrlBuilder: UrlBuilder,
    public maxAge: Duration,
    public clientMetaData: ClientMetaData
  ) {}
}
