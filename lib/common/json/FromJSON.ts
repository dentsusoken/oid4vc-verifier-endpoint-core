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
 * Represents a function type that converts JSON data to a specific type.
 *
 * @template J The type of the input JSON data.
 * @template T The type of the output after conversion.
 *
 * @param {J} json - The JSON data to be converted.
 * @returns {T} The converted data of type T.
 *
 * @typedef {function(J): T} FromJSON
 *
 * @example
 * // Define a FromJSON function for User type
 * const userFromJSON: FromJSON<UserJSON, User> = (json) => {
 *   return new User(json.name, json.age);
 * };
 *
 * // Use the function
 * const userJSON = { name: "John", age: 30 };
 * const user = userFromJSON(userJSON);
 */
export type FromJSON<J, T> = (json: J) => T;
