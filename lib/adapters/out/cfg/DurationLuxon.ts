import { Duration as LuxonDuration } from 'luxon';
import { Duration } from '../../../domain';
import { DurationFactory } from '../../../ports/out/cfg';

/**
 * Implements the Duration interface using the Luxon library.
 * This class provides a concrete implementation of Duration using Luxon's Duration class.
 */
export class DurationLuxon implements Duration {
  private duration: LuxonDuration;

  /**
   * Creates a DurationLuxon instance.
   * @param seconds - The number of seconds in the duration.
   * @param millis - The number of milliseconds in the duration, in addition to the seconds.
   */
  constructor(seconds: number = 0, millis: number = 0) {
    this.duration = LuxonDuration.fromObject({ seconds, milliseconds: millis });
  }

  /**
   * Factory for creating Duration instances.
   * This factory provides static methods to create Duration objects
   * from various time units or by parsing ISO 8601 duration strings.
   */
  static readonly Factory: DurationFactory = class {
    /**
     * Creates a Duration from a number of days.
     * @param days - The number of days.
     * @returns A Duration representing the specified number of days.
     */
    static ofDays(days: number): Duration {
      return new DurationLuxon(days * 24 * 60 * 60);
    }

    /**
     * Creates a Duration from a number of hours.
     * @param hours - The number of hours.
     * @returns A Duration representing the specified number of hours.
     */
    static ofHours(hours: number): Duration {
      return new DurationLuxon(hours * 60 * 60);
    }

    /**
     * Creates a Duration from a number of minutes.
     * @param minutes - The number of minutes.
     * @returns A Duration representing the specified number of minutes.
     */
    static ofMinutes(minutes: number): Duration {
      return new DurationLuxon(minutes * 60);
    }

    /**
     * Creates a Duration from a number of seconds and an optional millisecond adjustment.
     * @param seconds - The number of seconds.
     * @param millis - The millisecond adjustment to apply. Defaults to 0.
     * @returns A Duration representing the specified time.
     */
    static ofSeconds(seconds: number, millis: number = 0): Duration {
      return new DurationLuxon(seconds, millis);
    }

    /**
     * Creates a Duration from a number of milliseconds.
     * @param millis - The number of milliseconds.
     * @returns A Duration representing the specified number of milliseconds.
     */
    static ofMillis(millis: number): Duration {
      return new DurationLuxon(0, millis);
    }

    /**
     * Parses a duration from an ISO 8601 duration string.
     * @param text - The ISO 8601 duration string to parse.
     * @returns A Duration representing the parsed time.
     * @throws {Error} If the input string is not a valid ISO 8601 duration.
     */
    static parse(text: string): Duration {
      const luxonDuration = LuxonDuration.fromISO(text);
      return new DurationLuxon(
        DurationLuxon.getSeconds(luxonDuration),
        luxonDuration.milliseconds
      );
    }
  };

  /**
   * Retrieves the number of whole seconds from a Luxon Duration.
   *
   * This static method calculates the total number of whole seconds
   * represented by the given Luxon Duration object. It floors the result
   * to ensure only complete seconds are counted.
   *
   * @param duration - The Luxon Duration object to extract seconds from.
   * @returns The number of whole seconds in the duration.
   *
   * @example
   * const luxonDuration = Duration.fromObject({ seconds: 65.5 });
   * const seconds = DurationLuxon.getSeconds(luxonDuration);
   * console.log(seconds); // Outputs: 65
   */
  static getSeconds(duration: LuxonDuration): number {
    return Math.floor(duration.as('seconds'));
  }

  /**
   * Gets the number of whole seconds in this duration.
   * @returns The number of whole seconds.
   */
  get seconds(): number {
    return DurationLuxon.getSeconds(this.duration);
  }

  /**
   * Gets the number of milliseconds in this duration, excluding whole seconds.
   * @returns The number of milliseconds, excluding whole seconds.
   */
  get millis(): number {
    return this.duration.milliseconds;
  }

  /**
   * Checks if this duration is zero length.
   * @returns true if this duration has a total length of zero, false otherwise.
   */
  isZero(): boolean {
    return this.toMillis() === 0;
  }

  /**
   * Checks if this duration is negative.
   * @returns true if this duration has a total length less than zero, false otherwise.
   */
  isNegative(): boolean {
    return this.toMillis() < 0;
  }

  /**
   * Returns a copy of this duration with the specified duration added.
   * @param other - The duration to add.
   * @returns A new Duration instance with the addition applied.
   */
  plus(other: Duration): Duration {
    const totalMillis = this.toMillis() + other.toMillis();
    return DurationLuxon.Factory.ofMillis(totalMillis);
  }

  /**
   * Returns a copy of this duration with the specified duration subtracted.
   * @param other - The duration to subtract.
   * @returns A new Duration instance with the subtraction applied.
   */
  minus(other: Duration): Duration {
    const totalMillis = this.toMillis() - other.toMillis();
    return DurationLuxon.Factory.ofMillis(totalMillis);
  }

  /**
   * Returns a copy of this duration multiplied by the scalar.
   * @param multiplicand - The scalar to multiply by.
   * @returns A new Duration instance with the multiplication applied.
   */
  multipliedBy(multiplicand: number): Duration {
    const newDuration = this.duration.mapUnits((x) => x * multiplicand);
    return new DurationLuxon(
      DurationLuxon.getSeconds(newDuration),
      newDuration.milliseconds
    );
  }

  /**
   * Returns a copy of this duration divided by the scalar.
   * @param divisor - The scalar to divide by.
   * @returns A new Duration instance with the division applied.
   */
  dividedBy(divisor: number): Duration {
    const newDuration = this.duration.mapUnits((x) => x / divisor);
    return new DurationLuxon(
      DurationLuxon.getSeconds(newDuration),
      newDuration.milliseconds
    );
  }

  /**
   * Returns a copy of this duration with the length negated.
   * @returns A new Duration instance with the negation applied.
   */
  negated(): Duration {
    return this.multipliedBy(-1);
  }

  /**
   * Returns a copy of this duration with a positive length.
   * @returns A new Duration instance with the absolute value of the length.
   */
  abs(): Duration {
    return this.isNegative() ? this.negated() : this;
  }

  /**
   * Converts this duration to the total length in milliseconds.
   * @returns The total length of the duration in milliseconds.
   */
  toMillis(): number {
    return this.duration.as('milliseconds');
  }

  /**
   * Returns an ISO 8601 representation of this duration.
   * @returns An ISO 8601 representation of this duration.
   */
  toString(): string {
    return this.duration.toISO()!;
  }
}
