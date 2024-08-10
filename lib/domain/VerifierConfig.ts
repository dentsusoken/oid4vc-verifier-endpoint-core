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
  RequestId,
  EmbedOption,
  BuildUrl,
  ResponseModeOption,
  Duration,
  ClientMetaData,
  ClientIdScheme,
} from '.';

/**
 * Configuration class for the verifier in an authentication or authorization process.
 */
export class VerifierConfig {
  /**
   * Creates a new instance of VerifierConfig.
   *
   * @param clientIdScheme - The scheme used for client identification.
   * @param requestJarOption - The option for embedding the request as a JWT (JSON Web Token).
   * @param presentationDefinitionEmbedOption - The option for embedding the presentation definition.
   * @param responseModeOption - The option specifying how the response should be returned.
   * @param responseUriBuilder - A function to build the URI for the response.
   * @param maxAge - The maximum allowed age for the authentication.
   * @param clientMetaData - Metadata about the client.
   */
  constructor(
    public clientIdScheme: ClientIdScheme,
    public requestJarOption: EmbedOption<RequestId>,
    public presentationDefinitionEmbedOption: EmbedOption<RequestId>,
    public responseModeOption: ResponseModeOption,
    public responseUriBuilder: BuildUrl<RequestId>,
    public maxAge: Duration,
    public clientMetaData: ClientMetaData
  ) {}
}
