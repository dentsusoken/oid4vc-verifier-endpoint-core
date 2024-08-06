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
 * Represents a duration of time.
 * This interface provides methods for creating, manipulating, and querying time-based amounts of time.
 */
export interface Duration {
  /**
   * The number of whole seconds in this duration.
   */
  readonly seconds: number;

  /**
   * The number of milliseconds in this duration, excluding whole seconds.
   */
  readonly millis: number;

  /**
   * Checks if this duration is zero length.
   * @returns true if this duration has a total length of zero, false otherwise.
   */
  isZero(): boolean;

  /**
   * Checks if this duration is negative.
   * @returns true if this duration has a total length less than zero, false otherwise.
   */
  isNegative(): boolean;

  /**
   * Returns a copy of this duration with the specified duration added.
   * @param other - The duration to add.
   * @returns A new Duration instance with the addition applied.
   */
  plus(other: Duration): Duration;

  /**
   * Returns a copy of this duration with the specified duration subtracted.
   * @param other - The duration to subtract.
   * @returns A new Duration instance with the subtraction applied.
   */
  minus(other: Duration): Duration;

  /**
   * Returns a copy of this duration multiplied by the scalar.
   * @param multiplicand - The scalar to multiply by.
   * @returns A new Duration instance with the multiplication applied.
   */
  multipliedBy(multiplicand: number): Duration;

  /**
   * Returns a copy of this duration divided by the scalar.
   * @param divisor - The scalar to divide by.
   * @returns A new Duration instance with the division applied.
   */
  dividedBy(divisor: number): Duration;

  /**
   * Returns a copy of this duration with the length negated.
   * @returns A new Duration instance with the negation applied.
   */
  negated(): Duration;

  /**
   * Returns a copy of this duration with a positive length.
   * @returns A new Duration instance with the absolute value of the length.
   */
  abs(): Duration;

  /**
   * Converts this duration to the total length in milliseconds.
   * @returns The total length of the duration in milliseconds.
   */
  toMillis(): number;

  /**
   * Returns a string representation of this duration.
   * The format of the returned string may vary depending on the implementation.
   * @returns A string representation of this duration.
   */
  toString(): string;
}
