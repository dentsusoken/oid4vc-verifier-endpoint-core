import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { PresentationSubmission } from 'oid4vc-prex';
import { WalletResponse } from '.';
import { ZodError } from 'zod';

describe('WalletResponse', () => {
  describe('IdToken', () => {
    describe('fromJSON', () => {
      it('should create an IdToken instance for a valid JSON object', () => {
        const json = { __type: 'IdToken', id_token: 'example_id_token' };
        const result = WalletResponse.IdToken.fromJSON(json);
        expect(result).toBeInstanceOf(WalletResponse.IdToken);
        expect(result.__type === 'IdToken').toBe(true);
        expect(result.idToken).toBe('example_id_token');
      });

      it('should throw a ZodError for an invalid JSON object with missing id_token', () => {
        const json = { __type: 'IdToken' };

        try {
          WalletResponse.IdToken.fromJSON(json);
          expect.fail('Expected a ZodError to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);
          expect(error instanceof ZodError && error.issues).toEqual([
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['id_token'],
              message: 'Required',
            },
          ]);
        }
      });

      it('should throw a ZodError for an invalid JSON object with empty id_token', () => {
        const json = { __type: 'IdToken', id_token: '' };

        try {
          WalletResponse.IdToken.fromJSON(json);
          expect.fail('Expected a ZodError to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);
          expect(error instanceof ZodError && error.issues).toEqual([
            {
              code: 'too_small',
              exact: false,
              minimum: 1,
              type: 'string',
              inclusive: true,
              path: ['id_token'],
              message: 'String must contain at least 1 character(s)',
            },
          ]);
        }
      });
    });

    describe('toJSON', () => {
      it('should return the correct JSON representation', () => {
        const idToken = new WalletResponse.IdToken('example_id_token');
        expect(idToken.toJSON()).toEqual({
          __type: 'IdToken',
          id_token: 'example_id_token',
        });
      });
    });
  });

  describe('VpToken', () => {
    describe('fromJSON', () => {
      it('should create a VpToken instance for a valid JSON object', () => {
        const json = {
          __type: 'VpToken',
          vp_token: 'example_vp_token',
          presentation_submission: {},
        };
        const result = WalletResponse.VpToken.fromJSON(json);
        expect(result).toBeInstanceOf(WalletResponse.VpToken);
        expect(result.vpToken).toBe('example_vp_token');
        expect(result.presentationSubmission).toBeInstanceOf(
          PresentationSubmission
        );
      });

      it('should throw a ZodError for an invalid JSON object with missing vp_token', () => {
        const json = { __type: 'VpToken', presentation_submission: {} };

        try {
          WalletResponse.VpToken.fromJSON(json);
          expect.fail('Expected a ZodError to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);
          expect(error instanceof ZodError && error.issues).toEqual([
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['vp_token'],
              message: 'Required',
            },
          ]);
        }
      });

      it('should throw a ZodError for an invalid JSON object with empty vp_token', () => {
        const json = {
          __type: 'VpToken',
          vp_token: '',
          presentation_submission: {},
        };

        try {
          WalletResponse.VpToken.fromJSON(json);
          expect.fail('Expected a ZodError to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);
          expect(error instanceof ZodError && error.issues).toEqual([
            {
              code: 'too_small',
              exact: false,
              minimum: 1,
              type: 'string',
              inclusive: true,
              path: ['vp_token'],
              message: 'String must contain at least 1 character(s)',
            },
          ]);
        }
      });
    });

    describe('toJSON', () => {
      it('should return the correct JSON representation', () => {
        const vpToken = new WalletResponse.VpToken(
          'example_vp_token',
          new PresentationSubmission()
        );
        expect(vpToken.toJSON()).toEqual({
          __type: 'VpToken',
          vp_token: 'example_vp_token',
          presentation_submission: {},
        });
      });
    });
  });

  describe('IdAndVpToken', () => {
    describe('fromJSON', () => {
      it('should create an IdAndVpToken instance for a valid JSON object', () => {
        const json = {
          __type: 'IdAndVpToken',
          id_token: 'example_id_token',
          vp_token: 'example_vp_token',
          presentation_submission: {},
        };
        const result = WalletResponse.IdAndVpToken.fromJSON(json);
        expect(result).toBeInstanceOf(WalletResponse.IdAndVpToken);
        expect(result.idToken).toBe('example_id_token');
        expect(result.vpToken).toBe('example_vp_token');
        expect(result.presentationSubmission).toBeInstanceOf(
          PresentationSubmission
        );
      });

      it('should throw a ZodError for an invalid JSON object with missing id_token', () => {
        const json = {
          __type: 'IdAndVpToken',
          vp_token: 'example_vp_token',
          presentation_submission: {},
        };

        try {
          WalletResponse.IdAndVpToken.fromJSON(json);
          expect.fail('Expected a ZodError to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);
          expect(error instanceof ZodError && error.issues).toEqual([
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['id_token'],
              message: 'Required',
            },
          ]);
        }
      });

      it('should throw a ZodError for an invalid JSON object with missing vp_token', () => {
        const json = {
          __type: 'IdAndVpToken',
          id_token: 'example_id_token',
          presentation_submission: {},
        };

        try {
          WalletResponse.IdAndVpToken.fromJSON(json);
          expect.fail('Expected a ZodError to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);
          expect(error instanceof ZodError && error.issues).toEqual([
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['vp_token'],
              message: 'Required',
            },
          ]);
        }
      });

      it('should throw a ZodError for an invalid JSON object with empty id_token', () => {
        const json = {
          __type: 'IdAndVpToken',
          id_token: '',
          vp_token: 'example_vp_token',
          presentation_submission: {},
        };

        try {
          WalletResponse.IdAndVpToken.fromJSON(json);
          expect.fail('Expected a ZodError to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);
          expect(error instanceof ZodError && error.issues).toEqual([
            {
              code: 'too_small',
              exact: false,
              minimum: 1,
              type: 'string',
              inclusive: true,
              path: ['id_token'],
              message: 'String must contain at least 1 character(s)',
            },
          ]);
        }
      });

      it('should throw a ZodError for an invalid JSON object with empty vp_token', () => {
        const json = {
          __type: 'IdAndVpToken',
          id_token: 'example_id_token',
          vp_token: '',
          presentation_submission: {},
        };

        try {
          WalletResponse.IdAndVpToken.fromJSON(json);
          expect.fail('Expected a ZodError to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);
          expect(error instanceof ZodError && error.issues).toEqual([
            {
              code: 'too_small',
              exact: false,
              minimum: 1,
              type: 'string',
              inclusive: true,
              path: ['vp_token'],
              message: 'String must contain at least 1 character(s)',
            },
          ]);
        }
      });
    });

    describe('toJSON', () => {
      it('should return the correct JSON representation', () => {
        const idAndVpToken = new WalletResponse.IdAndVpToken(
          'example_id_token',
          'example_vp_token',
          new PresentationSubmission()
        );
        expect(idAndVpToken.toJSON()).toEqual({
          __type: 'IdAndVpToken',
          id_token: 'example_id_token',
          vp_token: 'example_vp_token',
          presentation_submission: {},
        });
      });
    });
  });

  describe('WalletResponseError', () => {
    describe('fromJSON', () => {
      it('should create a WalletResponseError instance for a valid JSON object', () => {
        const json = {
          __type: 'WalletResponseError',
          value: 'example_error',
          description: 'Example error description',
        };
        const result = WalletResponse.WalletResponseError.fromJSON(json);
        expect(result).toBeInstanceOf(WalletResponse.WalletResponseError);
        expect(result.value).toBe('example_error');
        expect(result.description).toBe('Example error description');
      });

      it('should create a WalletResponseError instance for a valid JSON object without description', () => {
        const json = {
          __type: 'WalletResponseError',
          value: 'example_error',
        };
        const result = WalletResponse.WalletResponseError.fromJSON(json);
        expect(result).toBeInstanceOf(WalletResponse.WalletResponseError);
        expect(result.value).toBe('example_error');
        expect(result.description).toBeUndefined();
      });

      it('should throw a ZodError for an invalid JSON object with missing value', () => {
        const json = { __type: 'WalletResponseError' };

        try {
          WalletResponse.WalletResponseError.fromJSON(json);
          expect.fail('Expected a ZodError to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);
          expect(error instanceof ZodError && error.issues).toEqual([
            {
              code: 'invalid_type',
              expected: 'string',
              received: 'undefined',
              path: ['value'],
              message: 'Required',
            },
          ]);
        }
      });

      it('should throw a ZodError for an invalid JSON object with empty value', () => {
        const json = { __type: 'WalletResponseError', value: '' };

        try {
          WalletResponse.WalletResponseError.fromJSON(json);
          expect.fail('Expected a ZodError to be thrown');
        } catch (error) {
          expect(error).toBeInstanceOf(ZodError);
          expect(error instanceof ZodError && error.issues).toEqual([
            {
              code: 'too_small',
              exact: false,
              minimum: 1,
              type: 'string',
              inclusive: true,
              path: ['value'],
              message: 'String must contain at least 1 character(s)',
            },
          ]);
        }
      });
    });

    describe('toJSON', () => {
      it('should return the correct JSON representation with description', () => {
        const walletResponseError = new WalletResponse.WalletResponseError(
          'example_error',
          'Example error description'
        );
        expect(walletResponseError.toJSON()).toEqual({
          __type: 'WalletResponseError',
          value: 'example_error',
          description: 'Example error description',
        });
      });

      it('should return the correct JSON representation without description', () => {
        const walletResponseError = new WalletResponse.WalletResponseError(
          'example_error'
        );
        expect(walletResponseError.toJSON()).toEqual({
          __type: 'WalletResponseError',
          value: 'example_error',
          description: undefined,
        });
      });
    });
  });
});
