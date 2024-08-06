import { describe, it, expect } from 'vitest';
import { DurationLuxon } from './DurationLuxon';
import { Duration as LuxonDuration } from 'luxon';

describe('DurationLuxon', () => {
  describe('static factory methods', () => {
    it('ofDays creates correct duration', () => {
      const duration = DurationLuxon.Factory.ofDays(2);
      expect(duration.toMillis()).toBe(2 * 24 * 60 * 60 * 1000);
    });

    it('ofHours creates correct duration', () => {
      const duration = DurationLuxon.Factory.ofHours(3);
      expect(duration.toMillis()).toBe(3 * 60 * 60 * 1000);
    });

    it('ofMinutes creates correct duration', () => {
      const duration = DurationLuxon.Factory.ofMinutes(30);
      expect(duration.toMillis()).toBe(30 * 60 * 1000);
    });

    it('ofSeconds creates correct duration', () => {
      const duration = DurationLuxon.Factory.ofSeconds(45, 500);
      expect(duration.toMillis()).toBe(45 * 1000 + 500);
    });

    it('ofMillis creates correct duration', () => {
      const duration = DurationLuxon.Factory.ofMillis(1500);
      expect(duration.toMillis()).toBe(1500);
    });

    it('parse creates correct duration from ISO string', () => {
      const duration = DurationLuxon.Factory.parse('PT1H30M');
      expect(duration.toMillis()).toBe((1 * 60 + 30) * 60 * 1000);
    });
  });

  describe('getSeconds', () => {
    it('returns correct number of seconds for whole seconds', () => {
      const duration = LuxonDuration.fromObject({ seconds: 65 });
      expect(DurationLuxon.getSeconds(duration)).toBe(65);
    });

    it('floors decimal seconds', () => {
      const duration = LuxonDuration.fromObject({ seconds: 65.9 });
      expect(DurationLuxon.getSeconds(duration)).toBe(65);
    });

    it('correctly handles durations longer than a minute', () => {
      const duration = LuxonDuration.fromObject({ minutes: 2, seconds: 30 });
      expect(DurationLuxon.getSeconds(duration)).toBe(150);
    });

    it('correctly handles durations with millis', () => {
      const duration = LuxonDuration.fromObject({
        seconds: 30,
        milliseconds: 500,
      });
      expect(DurationLuxon.getSeconds(duration)).toBe(30);
    });

    it('correctly handles durations longer than an hour', () => {
      const duration = LuxonDuration.fromObject({
        hours: 1,
        minutes: 30,
        seconds: 45,
      });
      expect(DurationLuxon.getSeconds(duration)).toBe(5445);
    });

    it('returns 0 for empty duration', () => {
      const duration = LuxonDuration.fromObject({});
      expect(DurationLuxon.getSeconds(duration)).toBe(0);
    });

    it('handles negative durations', () => {
      const duration = LuxonDuration.fromObject({ seconds: -65.9 });
      expect(DurationLuxon.getSeconds(duration)).toBe(-66);
    });
  });

  describe('getters', () => {
    it('seconds returns correct value', () => {
      const duration = DurationLuxon.Factory.ofSeconds(123, 456);
      expect(duration.seconds).toBe(123);
    });

    it('millis returns correct value', () => {
      const duration = DurationLuxon.Factory.ofSeconds(123, 456);
      expect(duration.millis).toBe(456);
    });
  });

  describe('operations', () => {
    it('isZero returns true for zero duration', () => {
      expect(DurationLuxon.Factory.ofMillis(0).isZero()).toBe(true);
      expect(DurationLuxon.Factory.ofSeconds(1).isZero()).toBe(false);
    });

    it('isNegative returns true for negative duration', () => {
      expect(DurationLuxon.Factory.ofMillis(-1).isNegative()).toBe(true);
      expect(DurationLuxon.Factory.ofMillis(1).isNegative()).toBe(false);
    });

    it('plus adds durations correctly', () => {
      const d1 = DurationLuxon.Factory.ofSeconds(30);
      const d2 = DurationLuxon.Factory.ofSeconds(15);
      const result = d1.plus(d2);
      expect(result.toMillis()).toBe(45 * 1000);
    });

    it('minus subtracts durations correctly', () => {
      const d1 = DurationLuxon.Factory.ofSeconds(30);
      const d2 = DurationLuxon.Factory.ofSeconds(15);
      expect(d1.minus(d2).toMillis()).toBe(15 * 1000);
    });

    it('multipliedBy multiplies duration correctly', () => {
      const duration = DurationLuxon.Factory.ofSeconds(10);
      expect(duration.multipliedBy(3).toMillis()).toBe(30 * 1000);
    });

    it('dividedBy divides duration correctly', () => {
      const duration = DurationLuxon.Factory.ofSeconds(30);
      expect(duration.dividedBy(3).toMillis()).toBe(10 * 1000);
    });

    it('negated negates duration correctly', () => {
      const duration = DurationLuxon.Factory.ofSeconds(10);
      expect(duration.negated().toMillis()).toBe(-10 * 1000);
    });

    it('abs returns absolute value of duration', () => {
      const duration = DurationLuxon.Factory.ofSeconds(-10);
      expect(duration.abs().toMillis()).toBe(10 * 1000);
    });
  });

  it('toString returns ISO 8601 representation', () => {
    const duration = DurationLuxon.Factory.ofSeconds(3661); // 1 hour, 1 minute, 1 second
    expect(duration.toString()).toBe('PT3661S');
  });
});
