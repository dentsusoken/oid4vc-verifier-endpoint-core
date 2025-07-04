import { describe, it, expect } from 'vitest';
import { PresentationDefinition } from '@vecrea/oid4vc-prex';
import {
  PresentationType,
  presentationTypeSchema,
  PresentationTypeJSON,
} from '../PresentationType';
import { IdTokenType } from '..';
import { ZodError } from 'zod';

describe('PresentationType', () => {
  describe('IdTokenRequest', () => {
    it('should create an instance correctly', () => {
      const idTokenTypes: IdTokenType[] = [
        IdTokenType.SubjectSigned,
        IdTokenType.AttesterSigned,
      ];
      const request = new PresentationType.IdTokenRequest(idTokenTypes);

      expect(request.__type).toBe('IdTokenRequest');
      expect(request.idTokenType).toEqual(idTokenTypes);
    });

    it('should serialize to JSON correctly', () => {
      const idTokenTypes: IdTokenType[] = [IdTokenType.SubjectSigned];
      const request = new PresentationType.IdTokenRequest(idTokenTypes);
      const json = request.toJSON();

      expect(json).toEqual({
        __type: 'IdTokenRequest',
        id_token_type: idTokenTypes,
      });
    });
  });

  describe('VpTokenRequest', () => {
    it('should create an instance correctly', () => {
      const pd = {} as PresentationDefinition;
      const request = new PresentationType.VpTokenRequest(pd);

      expect(request.__type).toBe('VpTokenRequest');
      expect(request.presentationDefinition).toBe(pd);
    });

    it('should serialize to JSON correctly', () => {
      const pd = PresentationDefinition.fromJSON({
        id: 'test',
      });
      const request = new PresentationType.VpTokenRequest(pd);
      const json = request.toJSON();

      expect(json).toEqual({
        __type: 'VpTokenRequest',
        presentation_definition: { id: 'test' },
      });
    });
  });

  describe('IdAndVpTokenRequest', () => {
    it('should create an instance correctly', () => {
      const idTokenTypes: IdTokenType[] = [IdTokenType.SubjectSigned];
      const pd = PresentationDefinition.fromJSON({
        id: 'test',
      });
      const request = new PresentationType.IdAndVpTokenRequest(
        idTokenTypes,
        pd
      );

      expect(request.__type).toBe('IdAndVpTokenRequest');
      expect(request.idTokenType).toEqual(idTokenTypes);
      expect(request.presentationDefinition).toBe(pd);
    });

    it('should serialize to JSON correctly', () => {
      const idTokenTypes: IdTokenType[] = [IdTokenType.SubjectSigned];
      const pd = PresentationDefinition.fromJSON({
        id: 'test',
      });
      const request = new PresentationType.IdAndVpTokenRequest(
        idTokenTypes,
        pd
      );
      const json = request.toJSON();

      expect(json).toEqual({
        __type: 'IdAndVpTokenRequest',
        id_token_type: idTokenTypes,
        presentation_definition: { id: 'test' },
      });
    });
  });

  describe('fromJSON', () => {
    it('should create IdTokenRequest from JSON', () => {
      const json: PresentationTypeJSON = {
        __type: 'IdTokenRequest',
        id_token_type: [IdTokenType.SubjectSigned],
      };
      const result = PresentationType.fromJSON(json);

      expect(result).toBeInstanceOf(PresentationType.IdTokenRequest);
      expect(result.__type).toBe('IdTokenRequest');
      expect(result.__type === 'IdTokenRequest' && result.idTokenType).toEqual([
        IdTokenType.SubjectSigned,
      ]);
    });

    it('should create VpTokenRequest from JSON', () => {
      const json: PresentationTypeJSON = {
        __type: 'VpTokenRequest',
        presentation_definition: { id: 'test', input_descriptors: [] },
      };
      const result = PresentationType.fromJSON(json);

      expect(result).toBeInstanceOf(PresentationType.VpTokenRequest);
      expect(result.__type).toBe('VpTokenRequest');
      expect(
        (result as PresentationType.VpTokenRequest).presentationDefinition
      ).toBeInstanceOf(PresentationDefinition);
    });

    it('should create IdAndVpTokenRequest from JSON', () => {
      const json: PresentationTypeJSON = {
        __type: 'IdAndVpTokenRequest',
        id_token_type: [IdTokenType.SubjectSigned],
        presentation_definition: { id: 'test', input_descriptors: [] },
      };
      const result = PresentationType.fromJSON(json);

      expect(result).toBeInstanceOf(PresentationType.IdAndVpTokenRequest);
      expect(result.__type).toBe('IdAndVpTokenRequest');
      expect(
        (result as PresentationType.IdAndVpTokenRequest).idTokenType
      ).toEqual([IdTokenType.SubjectSigned]);
      expect(
        (result as PresentationType.IdAndVpTokenRequest).presentationDefinition
      ).toBeInstanceOf(PresentationDefinition);
    });
  });

  describe('PresentationType Type Guards', () => {
    const idTokenRequest = new PresentationType.IdTokenRequest([
      IdTokenType.SubjectSigned,
    ]);
    const vpTokenRequest = new PresentationType.VpTokenRequest(
      PresentationDefinition.fromJSON({ id: 'test', input_descriptors: [] })
    );
    const idAndVpTokenRequest = new PresentationType.IdAndVpTokenRequest(
      [IdTokenType.SubjectSigned],
      PresentationDefinition.fromJSON({ id: 'test', input_descriptors: [] })
    );

    describe('Using if statements', () => {
      it('should correctly identify IdTokenRequest', () => {
        if (idTokenRequest.__type === 'IdTokenRequest') {
          expect(idTokenRequest.idTokenType).toEqual([
            IdTokenType.SubjectSigned,
          ]);
        } else {
          throw new Error('Failed to identify IdTokenRequest');
        }
      });

      it('should correctly identify VpTokenRequest', () => {
        if (vpTokenRequest.__type === 'VpTokenRequest') {
          expect(vpTokenRequest.presentationDefinition).toBeInstanceOf(
            PresentationDefinition
          );
        } else {
          throw new Error('Failed to identify VpTokenRequest');
        }
      });

      it('should correctly identify IdAndVpTokenRequest', () => {
        if (idAndVpTokenRequest.__type === 'IdAndVpTokenRequest') {
          expect(idAndVpTokenRequest.idTokenType).toEqual([
            IdTokenType.SubjectSigned,
          ]);
          expect(idAndVpTokenRequest.presentationDefinition).toBeInstanceOf(
            PresentationDefinition
          );
        } else {
          throw new Error('Failed to identify IdAndVpTokenRequest');
        }
      });
    });

    describe('Using switch statements', () => {
      it('should correctly handle all PresentationType variants', () => {
        const testPresentationType = (pt: PresentationType): string => {
          switch (pt.__type) {
            case 'IdTokenRequest':
              return `IdTokenRequest with ${pt.idTokenType.length} token types`;
            case 'VpTokenRequest':
              return `VpTokenRequest with definition id: ${pt.presentationDefinition.id?.value}`;
            case 'IdAndVpTokenRequest':
              return `IdAndVpTokenRequest with ${pt.idTokenType.length} token types and definition id: ${pt.presentationDefinition.id?.value}`;
          }
        };

        expect(testPresentationType(idTokenRequest)).toBe(
          'IdTokenRequest with 1 token types'
        );
        expect(testPresentationType(vpTokenRequest)).toBe(
          'VpTokenRequest with definition id: test'
        );
        expect(testPresentationType(idAndVpTokenRequest)).toBe(
          'IdAndVpTokenRequest with 1 token types and definition id: test'
        );
      });
    });
  });
});

describe('presentationTypeSchema', () => {
  it('should validate IdTokenRequest correctly', () => {
    const validData = {
      __type: 'IdTokenRequest',
      id_token_type: [IdTokenType.SubjectSigned],
    };
    expect(() => presentationTypeSchema.parse(validData)).not.toThrow();
  });

  it('should validate VpTokenRequest correctly', () => {
    const validData = {
      __type: 'VpTokenRequest',
      presentation_definition: { id: 'test', input_descriptors: [] },
    };
    expect(() => presentationTypeSchema.parse(validData)).not.toThrow();
  });

  it('should validate IdAndVpTokenRequest correctly', () => {
    const validData = {
      __type: 'IdAndVpTokenRequest',
      id_token_type: [IdTokenType.SubjectSigned],
      presentation_definition: { id: 'test', input_descriptors: [] },
    };
    expect(() => presentationTypeSchema.parse(validData)).not.toThrow();
  });

  it('should reject invalid data', () => {
    const invalidData = {
      __type: 'InvalidType',
      some_field: 'some_value',
    };
    expect(() => presentationTypeSchema.parse(invalidData)).toThrow(ZodError);
  });
});
