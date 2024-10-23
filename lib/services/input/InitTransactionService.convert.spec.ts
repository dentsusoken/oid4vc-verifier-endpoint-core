import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { PresentationDefinition } from 'oid4vc-prex';
import { Result } from 'oid4vc-core/utils';
import {
  toIdTokenTypes,
  toNonce,
  toPresentationType,
  toEmbedOption,
  toResponseModeOption,
  toGetWalletResponseMethod,
} from './InitTransactionService.convert';
import {
  IdTokenType,
  Nonce,
  PresentationType,
  EmbedOption,
  ResponseModeOption,
  GetWalletResponseMethod,
  UrlBuilder,
} from '../../domain';
import {
  IdTokenTypeTO,
  PresentationTypeTO,
  EmbedModeTO,
  ResponseModeTO,
} from '../../ports/input/InitTransaction.types';
import { CreateQueryWalletResponseRedirectUri } from '../../ports/out/cfg';

describe('InitTransactionService.convert', () => {
  describe('toIdTokenTypes', () => {
    it('should return an empty array when input is undefined', () => {
      const result = toIdTokenTypes();
      expect(result).toEqual([]);
    });

    it('should return an empty array when input is null', () => {
      const result = toIdTokenTypes(null as unknown as IdTokenTypeTO);
      expect(result).toEqual([]);
    });

    it('should return [IdTokenType.SubjectSigned] when input is IdTokenTypeTO.SubjectSigned', () => {
      const result = toIdTokenTypes(IdTokenTypeTO.SubjectSigned);
      expect(result).toEqual([IdTokenType.SubjectSigned]);
    });

    it('should return [IdTokenType.AttesterSigned] when input is IdTokenTypeTO.AttesterSigned', () => {
      const result = toIdTokenTypes(IdTokenTypeTO.AttesterSigned);
      expect(result).toEqual([IdTokenType.AttesterSigned]);
    });
  });

  describe('toNonce', () => {
    it('should create a Nonce instance with the provided value', () => {
      const value = 'nonce-value';
      const nonce = toNonce(value);

      expect(nonce).toBeInstanceOf(Nonce);
      expect(nonce.value).toBe(value);
    });

    it('should throw an error when nonce value is not provided', () => {
      expect(() => toNonce()).toThrowError('Missing nonce');
      expect(() => toNonce(undefined)).toThrowError('Missing nonce');
      expect(() => toNonce(null as unknown as string)).toThrowError(
        'Missing nonce'
      );
      expect(() => toNonce('')).toThrowError('Missing nonce');
    });
  });

  describe('toPresentationType', () => {
    it('should throw an error when presentation type is not provided', () => {
      expect(() => toPresentationType()).toThrowError(
        'Missing presentation type'
      );
    });

    it('should return IdTokenRequest when input is PresentationTypeTO.IdTokenRequest', () => {
      const idTokenTypes: IdTokenType[] = [IdTokenType.SubjectSigned];
      const result = toPresentationType(
        PresentationTypeTO.IdTokenRequest,
        idTokenTypes
      );
      expect(result).toBeInstanceOf(PresentationType.IdTokenRequest);
      expect(result.__type === 'IdTokenRequest' && result.idTokenType).toEqual(
        idTokenTypes
      );
    });

    it('should return VpTokenRequest when input is PresentationTypeTO.VpTokenRequest', () => {
      const pd = {} as PresentationDefinition;
      const result = toPresentationType(
        PresentationTypeTO.VpTokenRequest,
        [],
        pd
      );
      expect(result).toBeInstanceOf(PresentationType.VpTokenRequest);
      expect(
        result.__type === 'VpTokenRequest' && result.presentationDefinition
      ).toEqual(pd);
    });

    it('should throw an error when input is PresentationTypeTO.VpTokenRequest and presentation definition is missing', () => {
      expect(() =>
        toPresentationType(PresentationTypeTO.VpTokenRequest)
      ).toThrowError('Missing presentation definition');
    });

    it('should return IdAndVpTokenRequest when input is PresentationTypeTO.IdAndVpTokenRequest', () => {
      const idTokenTypes: IdTokenType[] = [IdTokenType.SubjectSigned];
      const pd = {} as PresentationDefinition;
      const result = toPresentationType(
        PresentationTypeTO.IdAndVpTokenRequest,
        idTokenTypes,
        pd
      );
      expect(result).toBeInstanceOf(PresentationType.IdAndVpTokenRequest);
      expect(
        result.__type === 'IdAndVpTokenRequest' && result.idTokenType
      ).toEqual(idTokenTypes);
      expect(
        result.__type === 'IdAndVpTokenRequest' && result.presentationDefinition
      ).toEqual(pd);
    });

    it('should throw an error when input is PresentationTypeTO.IdAndVpTokenRequest and presentation definition is missing', () => {
      const idTokenTypes: IdTokenType[] = [IdTokenType.SubjectSigned];
      expect(() =>
        toPresentationType(PresentationTypeTO.IdAndVpTokenRequest, idTokenTypes)
      ).toThrowError('Missing presentation definition');
    });
  });

  describe('toEmbedOption', () => {
    const byReference: EmbedOption.ByReference = new EmbedOption.ByReference(
      new UrlBuilder.WithRequestId(`https://example.com/`)
    );

    const defaultOption: EmbedOption = EmbedOption.ByValue.INSTANCE;

    it('should return the default option when input is undefined', () => {
      const result = toEmbedOption(undefined, byReference, defaultOption);
      expect(result).toEqual(defaultOption);
    });

    it('should return ByValue.INSTANCE when input is EmbedModeTO.ByValue', () => {
      const result = toEmbedOption(
        EmbedModeTO.ByValue,
        byReference,
        defaultOption
      );
      expect(result).toEqual(EmbedOption.ByValue.INSTANCE);
    });

    it('should return the byReference option when input is EmbedModeTO.ByReference', () => {
      const result = toEmbedOption(
        EmbedModeTO.ByReference,
        byReference,
        defaultOption
      );
      expect(result).toEqual(byReference);
    });
  });

  describe('toResponseModeOption', () => {
    const defaultOption = ResponseModeOption.DirectPost;

    it('should return the default option when input is undefined', () => {
      const result = toResponseModeOption(undefined, defaultOption);
      expect(result).toEqual(defaultOption);
    });

    it('should return ResponseModeOption.DirectPost when input is ResponseModeTO.DirectPost', () => {
      const result = toResponseModeOption(
        ResponseModeTO.DirectPost,
        defaultOption
      );
      expect(result).toEqual(ResponseModeOption.DirectPost);
    });

    it('should return ResponseModeOption.DirectPostJwt when input is ResponseModeTO.DirectPostJwt', () => {
      const result = toResponseModeOption(
        ResponseModeTO.DirectPostJwt,
        defaultOption
      );
      expect(result).toEqual(ResponseModeOption.DirectPostJwt);
    });
  });

  describe('toGetWalletResponseMethod', () => {
    const createRedirectUri: CreateQueryWalletResponseRedirectUri = (
      redirectUriTemplate,
      responseCode
    ) => {
      if (redirectUriTemplate === 'valid-template') {
        return Result.success(
          new URL(`https://example/com/redirect/${responseCode.value}`)
        );
      } else {
        return Result.failure(new Error('error'));
      }
    };

    it('should return GetWalletResponseMethod.Redirect when redirectUriTemplate is valid', () => {
      const redirectUriTemplate = 'valid-template';
      const result = toGetWalletResponseMethod(
        redirectUriTemplate,
        createRedirectUri
      );
      expect(result).toBeInstanceOf(GetWalletResponseMethod.Redirect);
      expect(result.__type === 'Redirect' && result.redirectUriTemplate).toBe(
        redirectUriTemplate
      );
    });

    it('should return GetWalletResponseMethod.Poll when redirectUriTemplate is undefined', () => {
      const result = toGetWalletResponseMethod(undefined, createRedirectUri);
      expect(result).toBeInstanceOf(GetWalletResponseMethod.Poll);
      expect(result.__type === 'Poll').toBe(true);
    });

    it('should throw an error when createRedirectUri returns failure', () => {
      const redirectUriTemplate = 'invalid-template';
      expect(() =>
        toGetWalletResponseMethod(redirectUriTemplate, createRedirectUri)
      ).toThrowError('Invalid wallet response template');
    });
  });
});
