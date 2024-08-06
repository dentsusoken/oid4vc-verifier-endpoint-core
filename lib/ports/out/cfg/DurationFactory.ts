import { Duration } from '../../../domain';

/**
 * Interface for creating Duration objects
 */
export interface DurationFactory {
  /**
   * Creates a Duration object representing a number of days
   * @param days - The number of days
   * @returns A Duration object
   */
  ofDays(days: number): Duration;

  /**
   * Creates a Duration object representing a number of hours
   * @param hours - The number of hours
   * @returns A Duration object
   */
  ofHours(hours: number): Duration;

  /**
   * Creates a Duration object representing a number of minutes
   * @param minutes - The number of minutes
   * @returns A Duration object
   */
  ofMinutes(minutes: number): Duration;

  /**
   * Creates a Duration object representing a number of seconds, with an optional millisecond adjustment
   * @param seconds - The number of seconds
   * @param millisAdjustment - Optional millisecond adjustment
   * @returns A Duration object
   */
  ofSeconds(seconds: number, millisAdjustment?: number): Duration;

  /**
   * Creates a Duration object representing a number of milliseconds
   * @param millis - The number of milliseconds
   * @returns A Duration object
   */
  ofMillis(millis: number): Duration;

  /**
   * Parses a string representation of a duration into a Duration object
   * @param text - The string representation of the duration
   * @returns A Duration object
   */
  parse(text: string): Duration;
}
