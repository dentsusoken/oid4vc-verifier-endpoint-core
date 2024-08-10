import { describe, it, expect } from 'vitest';
import { PresentationDefinition } from 'oid4vc-prex';
import { PresentationType } from './PresentationType';
import { IdTokenType } from '.';

describe('PresentationType', () => {
  describe('IdTokenRequest', () => {
    it('should have the correct __type', () => {
      const idTokenType: IdTokenType[] = [IdTokenType.SubjectSigned];
      const idTokenRequest = new PresentationType.IdTokenRequest(idTokenType);
      expect(idTokenRequest.__type).toBe('IdTokenRequest');
    });

    it('should store the idTokenType', () => {
      const idTokenType: IdTokenType[] = [IdTokenType.SubjectSigned];
      const idTokenRequest = new PresentationType.IdTokenRequest(idTokenType);
      expect(idTokenRequest.idTokenType).toBe(idTokenType);
    });
  });

  describe('VpTokenRequest', () => {
    it('should have the correct __type', () => {
      const presentationDefinition: PresentationDefinition = {};
      const vpTokenRequest = new PresentationType.VpTokenRequest(
        presentationDefinition
      );
      expect(vpTokenRequest.__type).toBe('VpTokenRequest');
    });

    it('should store the presentationDefinition', () => {
      const presentationDefinition: PresentationDefinition = {};
      const vpTokenRequest = new PresentationType.VpTokenRequest(
        presentationDefinition
      );
      expect(vpTokenRequest.presentationDefinition).toBe(
        presentationDefinition
      );
    });
  });

  describe('IdAndVpTokenRequest', () => {
    it('should have the correct __type', () => {
      const idTokenType: IdTokenType[] = [IdTokenType.SubjectSigned];
      const presentationDefinition: PresentationDefinition = {};
      const idAndVpTokenRequest = new PresentationType.IdAndVpTokenRequest(
        idTokenType,
        presentationDefinition
      );
      expect(idAndVpTokenRequest.__type).toBe('IdAndVpTokenRequest');
    });

    it('should store the idTokenType and presentationDefinition', () => {
      const idTokenType: IdTokenType[] = [IdTokenType.SubjectSigned];
      const presentationDefinition: PresentationDefinition = {};
      const idAndVpTokenRequest = new PresentationType.IdAndVpTokenRequest(
        idTokenType,
        presentationDefinition
      );
      expect(idAndVpTokenRequest.idTokenType).toBe(idTokenType);
      expect(idAndVpTokenRequest.presentationDefinition).toBe(
        presentationDefinition
      );
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
      const presentationDefinition: PresentationDefinition = {};
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
      const presentationDefinition: PresentationDefinition = {};
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
      const presentationDefinition: PresentationDefinition = {};
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
      const presentationDefinition: PresentationDefinition = {};
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
