import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { PresentationDefinition } from 'oid4vc-prex';
import { PresentationType } from './PresentationType';
import { IdTokenType } from '.';
import { ZodError } from 'zod';

describe('PresentationType', () => {
  describe('IdTokenRequest', () => {
    describe('constructor', () => {
      it('should create an instance of IdTokenRequest with the provided idTokenType', () => {
        const idTokenType = [
          IdTokenType.SubjectSigned,
          IdTokenType.AttesterSigned,
        ];
        const request = new PresentationType.IdTokenRequest(idTokenType);
        expect(request).toBeInstanceOf(PresentationType.IdTokenRequest);
        expect(request.__type === 'IdTokenRequest').toBe(true);
        expect(request.idTokenType).toEqual(idTokenType);
      });
    });

    describe('toJSON', () => {
      it('should return the JSON representation of IdTokenRequest', () => {
        const idTokenType = [
          IdTokenType.SubjectSigned,
          IdTokenType.AttesterSigned,
        ];
        const request: PresentationType = new PresentationType.IdTokenRequest(
          idTokenType
        );
        const json = request.toJSON();
        expect(json).toEqual({
          __type: 'IdTokenRequest',
          id_token_type: idTokenType.map((v) => IdTokenType.toJSON(v)),
        });
      });
    });

    describe('fromJSON', () => {
      it('should create an instance of IdTokenRequest from the provided JSON', () => {
        const json = {
          __type: 'IdTokenRequest',
          id_token_type: [
            IdTokenType.toJSON(IdTokenType.SubjectSigned),
            IdTokenType.toJSON(IdTokenType.AttesterSigned),
          ],
        };
        const request = PresentationType.IdTokenRequest.fromJSON(json);
        expect(request).toBeInstanceOf(PresentationType.IdTokenRequest);
        expect(request.__type === 'IdTokenRequest').toBe(true);
        expect(request.idTokenType).toEqual([
          IdTokenType.SubjectSigned,
          IdTokenType.AttesterSigned,
        ]);
      });

      it('should throw an error if the provided JSON has an invalid __type', () => {
        const json = {
          id_token_type: [],
        };
        expect(() =>
          PresentationType.IdTokenRequest.fromJSON(json)
        ).toThrowError(
          `Invalid __type. Expected 'IdTokenRequest', but 'undefined'`
        );
      });

      it('should throw an error if the provided JSON contains an invalid id_token_type', () => {
        const json = {
          __type: 'IdTokenRequest',
          id_token_type: ['invalid'],
        };
        try {
          PresentationType.IdTokenRequest.fromJSON(json);
          expect.fail('Expected a ZodError to be thrown');
        } catch (error) {
          console.log(error);
          expect(error).toBeInstanceOf(ZodError);
          expect(error instanceof ZodError && error.issues).toEqual([
            {
              received: 'invalid',
              code: 'invalid_enum_value',
              options: [IdTokenType.SubjectSigned, IdTokenType.AttesterSigned],
              path: [],
              message: `Invalid enum value. Expected '${IdTokenType.SubjectSigned}' | '${IdTokenType.AttesterSigned}', received 'invalid'`,
            },
          ]);
        }
      });

      it('should throw an error if the provided JSON is missing id_token_type', () => {
        const json3 = {
          __type: 'IdTokenRequest',
        };
        expect(() =>
          PresentationType.IdTokenRequest.fromJSON(json3)
        ).toThrowError(`Missing id_token_type`);
      });
    });
  });

  describe('VpTokenRequest', () => {
    describe('constructor', () => {
      it('should create an instance of VpTokenRequest with the provided presentationDefinition', () => {
        const presentationDefinition = new PresentationDefinition(/* ... */);
        const request = new PresentationType.VpTokenRequest(
          presentationDefinition
        );
        expect(request).toBeInstanceOf(PresentationType.VpTokenRequest);
        expect(request.__type === 'VpTokenRequest').toBe(true);
        expect(request.presentationDefinition).toEqual(presentationDefinition);
      });
    });

    describe('toJSON', () => {
      it('should return the JSON representation of VpTokenRequest', () => {
        const presentationDefinition = new PresentationDefinition(/* ... */);
        const request = new PresentationType.VpTokenRequest(
          presentationDefinition
        );
        const json = request.toJSON();
        expect(json).toEqual({
          __type: 'VpTokenRequest',
          presentation_definition: presentationDefinition.serialize(),
        });
      });
    });

    describe('fromJSON', () => {
      it('should create an instance of VpTokenRequest from the provided JSON', () => {
        const presentationDefinition = new PresentationDefinition(/* ... */);
        const json = {
          __type: 'VpTokenRequest',
          presentation_definition: presentationDefinition.serialize(),
        };
        const request = PresentationType.VpTokenRequest.fromJSON(json);
        expect(request).toBeInstanceOf(PresentationType.VpTokenRequest);
        expect(request.__type === 'VpTokenRequest').toBe(true);
        expect(request.presentationDefinition).toEqual(presentationDefinition);
      });

      it('should throw an error if the provided JSON is invalid', () => {
        const json = {
          presentation_definition: {},
        };
        const json2 = {
          __type: 'VpTokenRequest',
          presentation_definition: 'invalid',
        };
        expect(() =>
          PresentationType.VpTokenRequest.fromJSON(json)
        ).toThrowError(
          `Invalid __type. Expected 'VpTokenRequest', but 'undefined'`
        );
        expect(() =>
          PresentationType.VpTokenRequest.fromJSON(json2)
        ).toThrowError(`Invalid presentation_definition: invalid`);
      });
    });
  });

  describe('IdAndVpTokenRequest', () => {
    describe('constructor', () => {
      it('should create an instance of IdAndVpTokenRequest with the provided idTokenType and presentationDefinition', () => {
        const idTokenType = [
          IdTokenType.SubjectSigned,
          IdTokenType.AttesterSigned,
        ];
        const presentationDefinition = new PresentationDefinition(/* ... */);
        const request = new PresentationType.IdAndVpTokenRequest(
          idTokenType,
          presentationDefinition
        );
        expect(request).toBeInstanceOf(PresentationType.IdAndVpTokenRequest);
        expect(request.__type === 'IdAndVpTokenRequest').toBe(true);
        expect(request.idTokenType).toEqual(idTokenType);
        expect(request.presentationDefinition).toEqual(presentationDefinition);
      });
    });

    describe('toJSON', () => {
      it('should return the JSON representation of IdAndVpTokenRequest', () => {
        const idTokenType = [
          IdTokenType.SubjectSigned,
          IdTokenType.AttesterSigned,
        ];
        const presentationDefinition = new PresentationDefinition(/* ... */);
        const request = new PresentationType.IdAndVpTokenRequest(
          idTokenType,
          presentationDefinition
        );
        const json = request.toJSON();
        expect(json).toEqual({
          __type: 'IdAndVpTokenRequest',
          id_token_type: [
            'subject_signed_id_token',
            'attester_signed_id_token',
          ],
          presentation_definition: {},
        });
      });
    });

    describe('fromJSON', () => {
      it('should create an instance of IdAndVpTokenRequest from the provided JSON', () => {
        const idTokenType = [
          IdTokenType.SubjectSigned,
          IdTokenType.AttesterSigned,
        ];
        const presentationDefinition = new PresentationDefinition(/* ... */);
        const json = {
          __type: 'IdAndVpTokenRequest',
          id_token_type: idTokenType.map((v) => IdTokenType.toJSON(v)),
          presentation_definition: presentationDefinition.serialize(),
        };
        const request = PresentationType.IdAndVpTokenRequest.fromJSON(json);
        expect(request).toBeInstanceOf(PresentationType.IdAndVpTokenRequest);
        expect(request.__type === 'IdAndVpTokenRequest').toBe(true);
        expect(request.idTokenType).toEqual(idTokenType);
        expect(request.presentationDefinition).toEqual(presentationDefinition);
      });

      it('should throw an error if the provided JSON has an invalid __type', () => {
        const json = {
          id_token_type: [],
          presentation_definition: {},
        };
        expect(() =>
          PresentationType.IdAndVpTokenRequest.fromJSON(json)
        ).toThrowError(
          `Invalid __type. Expected 'IdAndVpTokenRequest', but 'undefined'`
        );
      });

      it('should throw a ZodError with the expected error details if the provided JSON contains an invalid id_token_type', () => {
        const json = {
          __type: 'IdAndVpTokenRequest',
          id_token_type: ['invalid'],
          presentation_definition: {},
        };

        try {
          PresentationType.IdAndVpTokenRequest.fromJSON(json);
          expect.fail('Expected a ZodError to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);
          expect(error instanceof ZodError && error.issues).toEqual([
            {
              received: 'invalid',
              code: 'invalid_enum_value',
              options: [IdTokenType.SubjectSigned, IdTokenType.AttesterSigned],
              path: [],
              message: `Invalid enum value. Expected '${IdTokenType.SubjectSigned}' | '${IdTokenType.AttesterSigned}', received 'invalid'`,
            },
          ]);
        }
      });

      it('should throw an error if the provided JSON is missing id_token_type', () => {
        const json = {
          __type: 'IdAndVpTokenRequest',
          presentation_definition: {},
        };
        expect(() =>
          PresentationType.IdAndVpTokenRequest.fromJSON(json)
        ).toThrowError(`Missing id_token_type`);
      });

      it('should throw an error if the provided JSON is missing presentation_definition', () => {
        const json = {
          __type: 'IdAndVpTokenRequest',
          id_token_type: [],
        };
        expect(() =>
          PresentationType.IdAndVpTokenRequest.fromJSON(json)
        ).toThrowError(`Missing presentation_definition`);
      });

      it('should throw an error if the provided JSON contains an invalid presentation_definition', () => {
        const json = {
          __type: 'IdAndVpTokenRequest',
          id_token_type: [],
          presentation_definition: 'invalid',
        };
        expect(() =>
          PresentationType.IdAndVpTokenRequest.fromJSON(json)
        ).toThrowError(`Invalid presentation_definition: invalid`);
      });
    });
  });

  describe('type guard', () => {
    it('should correctly identify IdTokenRequest using if statement', () => {
      const idTokenType: IdTokenType[] = [IdTokenType.SubjectSigned];
      const presentationType: PresentationType =
        new PresentationType.IdTokenRequest(idTokenType);

      if (presentationType.__type === 'IdTokenRequest') {
        expect(presentationType.idTokenType).toBe(idTokenType);
      } else {
        throw new Error(
          'Expected presentationType to be of type IdTokenRequest'
        );
      }
    });

    it('should correctly identify VpTokenRequest using if statement', () => {
      const presentationDefinition = {} as PresentationDefinition;
      const presentationType: PresentationType =
        new PresentationType.VpTokenRequest(presentationDefinition);

      if (presentationType.__type === 'VpTokenRequest') {
        expect(presentationType.presentationDefinition).toBe(
          presentationDefinition
        );
      } else {
        throw new Error(
          'Expected presentationType to be of type VpTokenRequest'
        );
      }
    });

    it('should correctly identify IdAndVpTokenRequest using if statement', () => {
      const idTokenType: IdTokenType[] = [IdTokenType.SubjectSigned];
      const presentationDefinition = {} as PresentationDefinition;
      const presentationType: PresentationType =
        new PresentationType.IdAndVpTokenRequest(
          idTokenType,
          presentationDefinition
        );

      if (presentationType.__type === 'IdAndVpTokenRequest') {
        expect(presentationType.idTokenType).toBe(idTokenType);
        expect(presentationType.presentationDefinition).toBe(
          presentationDefinition
        );
      } else {
        throw new Error(
          'Expected presentationType to be of type IdAndVpTokenRequest'
        );
      }
    });

    it('should correctly identify IdTokenRequest using switch statement', () => {
      const idTokenType: IdTokenType[] = [IdTokenType.SubjectSigned];
      const presentationType: PresentationType =
        new PresentationType.IdTokenRequest(idTokenType);

      switch (presentationType.__type) {
        case 'IdTokenRequest':
          expect(presentationType.idTokenType).toBe(idTokenType);
          break;
        default:
          throw new Error(
            'Expected presentationType to be of type IdTokenRequest'
          );
      }
    });

    it('should correctly identify VpTokenRequest using switch statement', () => {
      const presentationDefinition = {} as PresentationDefinition;
      const presentationType: PresentationType =
        new PresentationType.VpTokenRequest(presentationDefinition);

      switch (presentationType.__type) {
        case 'VpTokenRequest':
          expect(presentationType.presentationDefinition).toBe(
            presentationDefinition
          );
          break;
        default:
          throw new Error(
            'Expected presentationType to be of type VpTokenRequest'
          );
      }
    });

    it('should correctly identify IdAndVpTokenRequest using switch statement', () => {
      const idTokenType: IdTokenType[] = [IdTokenType.SubjectSigned];
      const presentationDefinition = {} as PresentationDefinition;
      const presentationType: PresentationType =
        new PresentationType.IdAndVpTokenRequest(
          idTokenType,
          presentationDefinition
        );

      switch (presentationType.__type) {
        case 'IdAndVpTokenRequest':
          expect(presentationType.idTokenType).toBe(idTokenType);
          expect(presentationType.presentationDefinition).toBe(
            presentationDefinition
          );
          break;
        default:
          throw new Error(
            'Expected presentationType to be of type IdAndVpTokenRequest'
          );
      }
    });
  });
});
