import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { presentationSubmissionSchema } from './presentationSubmissionSchema';

describe('presentationSubmissionSchema', () => {
  it('should parse a valid JSON object', () => {
    const presentationDefinitionJson = {
      id: 'test',
      definition_id: 'hoge',
      descriptor_map: [],
    };

    const result = presentationSubmissionSchema.parse(
      presentationDefinitionJson
    );

    //expect(result).toBeInstanceOf(PresentationSubmission);
    expect(result).toEqual(presentationDefinitionJson);
  });
});
