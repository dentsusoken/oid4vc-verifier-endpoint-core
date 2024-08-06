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

import { Duration } from '../../../domain';
import { DurationFactory } from '../../../ports/out/cfg';
import { DurationLuxon } from './DurationLuxon';

/**
 * Creates a DurationFactory that uses DurationLuxon.Factory to create Duration objects.
 *
 * @returns A DurationFactory object with methods to create Duration instances.
 *
 * @example
 * const durationFactory = createDurationFactoryLuxon();
 * const duration = durationFactory.ofDays(2);
 */
export const createDurationFactoryLuxon = (): DurationFactory => factory;

const factory: DurationFactory = {
  ofDays: (days: number): Duration => DurationLuxon.Factory.ofDays(days),

  ofHours: (hours: number): Duration => DurationLuxon.Factory.ofHours(hours),

  ofMinutes: (minutes: number): Duration =>
    DurationLuxon.Factory.ofMinutes(minutes),

  ofSeconds: (seconds: number, millisAdjustment: number = 0): Duration =>
    DurationLuxon.Factory.ofSeconds(seconds, millisAdjustment),

  ofMillis: (millis: number): Duration =>
    DurationLuxon.Factory.ofMillis(millis),

  parse: (text: string): Duration => DurationLuxon.Factory.parse(text),
};
