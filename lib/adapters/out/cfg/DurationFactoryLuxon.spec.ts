import { describe, it, expect, vi, afterEach } from 'vitest';
import { createDurationFactoryLuxon } from './DurationFactoryLuxon';
import { DurationLuxon } from './DurationLuxon';
import { Duration } from '../../../domain';

describe('createDurationFactoryLuxon', () => {
  const durationFactory = createDurationFactoryLuxon();

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('ofDays should call DurationLuxon.Factory.ofDays', () => {
    const mockDuration = {} as Duration;
    const spy = vi
      .spyOn(DurationLuxon.Factory, 'ofDays')
      .mockReturnValue(mockDuration);

    const result = durationFactory.ofDays(2);

    expect(spy).toHaveBeenCalledWith(2);
    expect(result).toBe(mockDuration);
  });

  it('ofHours should call DurationLuxon.Factory.ofHours', () => {
    const mockDuration = {} as Duration;
    const spy = vi
      .spyOn(DurationLuxon.Factory, 'ofHours')
      .mockReturnValue(mockDuration);

    const result = durationFactory.ofHours(3);

    expect(spy).toHaveBeenCalledWith(3);
    expect(result).toBe(mockDuration);
  });

  it('ofMinutes should call DurationLuxon.Factory.ofMinutes', () => {
    const mockDuration = {} as Duration;
    const spy = vi
      .spyOn(DurationLuxon.Factory, 'ofMinutes')
      .mockReturnValue(mockDuration);

    const result = durationFactory.ofMinutes(30);

    expect(spy).toHaveBeenCalledWith(30);
    expect(result).toBe(mockDuration);
  });

  it('ofSeconds should call DurationLuxon.Factory.ofSeconds', () => {
    const mockDuration = {} as Duration;
    const spy = vi
      .spyOn(DurationLuxon.Factory, 'ofSeconds')
      .mockReturnValue(mockDuration);

    const result = durationFactory.ofSeconds(45, 500);

    expect(spy).toHaveBeenCalledWith(45, 500);
    expect(result).toBe(mockDuration);
  });

  it('ofSeconds should call DurationLuxon.Factory.ofSeconds with default millisAdjustment', () => {
    const mockDuration = {} as Duration;
    const spy = vi
      .spyOn(DurationLuxon.Factory, 'ofSeconds')
      .mockReturnValue(mockDuration);

    const result = durationFactory.ofSeconds(45);

    expect(spy).toHaveBeenCalledWith(45, 0);
    expect(result).toBe(mockDuration);
  });

  it('ofMillis should call DurationLuxon.Factory.ofMillis', () => {
    const mockDuration = {} as Duration;
    const spy = vi
      .spyOn(DurationLuxon.Factory, 'ofMillis')
      .mockReturnValue(mockDuration);

    const result = durationFactory.ofMillis(1500);

    expect(spy).toHaveBeenCalledWith(1500);
    expect(result).toBe(mockDuration);
  });

  it('parse should call DurationLuxon.Factory.parse', () => {
    const mockDuration = {} as Duration;
    const spy = vi
      .spyOn(DurationLuxon.Factory, 'parse')
      .mockReturnValue(mockDuration);

    const result = durationFactory.parse('PT1H30M');

    expect(spy).toHaveBeenCalledWith('PT1H30M');
    expect(result).toBe(mockDuration);
  });
});
