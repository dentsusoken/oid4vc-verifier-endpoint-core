import { describe, expect, it } from 'vitest';
import { PresentationSubmission, Id } from 'oid4vc-prex';
import { walletResponseSchema, WalletResponseTO } from './GetWalletResponse.types';

describe('WalletResponseTO', () => {
  describe('plainToInstance', () => {
    it('should convert plain object to class instance', () => {
      const plainObject = {
        id_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        vp_token: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...',
        presentation_submission: {
          id: 'submission1',
          definition_id: 'def1',
          descriptor_map: [
            {
              id: 'desc1',
              format: 'jwt_vp',
              path: '$.vp_token',
            },
          ],
        },
      };

      const instance = WalletResponseTO.fromJSON(plainObject);

      expect(instance).toBeInstanceOf(WalletResponseTO);
      expect(instance.idToken).toBe(plainObject.id_token);
      expect(instance.vpToken).toBe(plainObject.vp_token);
      expect(instance.presentationSubmission).toBeInstanceOf(
        PresentationSubmission
      );
      expect(instance.presentationSubmission?.id).toBeInstanceOf(Id);
      expect(instance.presentationSubmission?.id?.value).toBe('submission1');
      expect(instance.error).toBeUndefined();
      expect(instance.errorDescription).toBeUndefined();
    });

    it('should handle missing properties', () => {
      expect(() => WalletResponseTO.fromJSON({})).toThrowError();
    });
  });

  describe('instanceToPlain', () => {
    it('should convert class instance to plain object', () => {
      const instance = new WalletResponseTO({
        idToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        vpToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...',
        presentationSubmission: new PresentationSubmission(
          new Id('submission1'),
          new Id('def1'),
          []
        ),
        error: undefined,
        errorDescription: undefined,
      });

      const plainObject = instance.toJSON();

      expect(plainObject.id_token).toBe(instance.idToken);
      expect(plainObject.vp_token).toBe(instance.vpToken);
      expect(plainObject.presentation_submission).toEqual({
        id: 'submission1',
        definition_id: 'def1',
        descriptor_map: [],
      });
      expect(plainObject.error).toBeUndefined();
      expect(plainObject.error_description).toBeUndefined();
    });

    it('should handle undefined properties', () => {
      const instance = new WalletResponseTO({});

      const plainObject = instance.toJSON();

      expect(plainObject.id_token).toBeUndefined();
      expect(plainObject.vp_token).toBeUndefined();
      expect(plainObject.presentation_submission).toBeUndefined();
      expect(plainObject.error).toBeUndefined();
      expect(plainObject.error_description).toBeUndefined();
    });
  });

  describe('constructor', () => {
    it('should create an instance with provided values', () => {
      const args = {
        idToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        vpToken: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...',
        presentationSubmission: new PresentationSubmission(
          new Id('submission1'),
          new Id('def1'),
          []
        ),
        error: 'error_code',
        errorDescription: 'Error description',
      };

      const instance = new WalletResponseTO(args);

      expect(instance.idToken).toBe(args.idToken);
      expect(instance.vpToken).toBe(args.vpToken);
      expect(instance.presentationSubmission).toBe(args.presentationSubmission);
      expect(instance.error).toBe(args.error);
      expect(instance.errorDescription).toBe(args.errorDescription);
    });

    it('should create an empty instance when no arguments are provided', () => {
      const instance = new WalletResponseTO();

      expect(instance.idToken).toBeUndefined();
      expect(instance.vpToken).toBeUndefined();
      expect(instance.presentationSubmission).toBeUndefined();
      expect(instance.error).toBeUndefined();
      expect(instance.errorDescription).toBeUndefined();
    });
  });
});

describe('walletResponseSchema', () => {
  it('should create shema with provided value', () => {
    const args = {
      id_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      vp_token: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9...',
      presentation_submission: {
        id: 'submission1',
        definition_id: 'def1',
        descriptor_map: [
          {
            id: 'desc1',
            format: 'jwt_vp',
            path: '$.vp_token',
          },
        ],
      },
      error: 'error_code',
      error_description: 'Error description',
    };
    const schema = walletResponseSchema.parse({
      id_token: args.id_token,
      vp_token: args.vp_token,
      presentation_submission: args.presentation_submission,
      error: args.error,
      error_description: args.error_description
    });

    expect(schema.id_token).toBe(args.id_token);
    expect(schema.vp_token).toBe(args.vp_token);
    expect(schema.presentation_submission).toEqual(args.presentation_submission);
    expect(schema.error).toBe(args.error);
    expect(schema.error_description).toBe(args.error_description);
  });

  it('should create shema with undefined provided value', () => {
    expect(() => walletResponseSchema.parse(undefined)).toThrowError();
  });
});
