import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { presentationDefinitionSchema } from './presentationDefinitionSchema';

describe('presentationDefinitionSchema', () => {
  it('should transform a valid JSON object to a PresentationDefinition instance', () => {
    const presentationDefinitionJson = { id: 'test', input_descriptors: [] };

    const result = presentationDefinitionSchema.parse(
      presentationDefinitionJson
    );

    //expect(result).toBeInstanceOf(PresentationDefinition);
    expect(result).toEqual(presentationDefinitionJson);
  });
});
