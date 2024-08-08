import 'reflect-metadata';
import { describe, expect, it } from 'vitest';
import { plainToInstance, instanceToPlain } from 'class-transformer';
import { validateSync } from 'class-validator';
import { PresentationDefinition } from 'oid4vc-prex';
import {
  PresentationTypeTO,
  IdTokenTypeTO,
  ResponseModeTO,
  EmbedModeTO,
  InitTransactionTO,
  JwtSecuredAuthorizationRequestTO,
} from './InitTransaction.types';

describe('InitTransactionTO', () => {
  it('should convert plain object to class instance', () => {
    const plainObject = {
      type: 'vp_token',
      id_token_type: 'subject_signed_id_token',
      presentation_definition: {
        id: 'id',
        input_descriptors: [],
      },
      nonce: 'abc123',
      response_mode: 'direct_post.jwt',
      jar_mode: 'by_reference',
      presentation_definition_mode: 'by_value',
      wallet_response_redirect_uri_template: 'https://example.com/callback',
    };

    const instance = plainToInstance(InitTransactionTO, plainObject);

    expect(instance).toBeInstanceOf(InitTransactionTO);
    expect(instance.type).toBe(PresentationTypeTO.VpTokenRequest);
    expect(instance.idTokenType).toBe(IdTokenTypeTO.SubjectSigned);
    expect(instance.presentationDefinition).toBeInstanceOf(
      PresentationDefinition
    );
    expect(instance.presentationDefinition).toEqual(
      plainObject.presentation_definition
    );
    expect(instance.nonce).toBe('abc123');
    expect(instance.responseMode).toBe(ResponseModeTO.DirectPostJwt);
    expect(instance.jarMode).toBe(EmbedModeTO.ByReference);
    expect(instance.presentationDefinitionMode).toBe(EmbedModeTO.ByValue);
    expect(instance.redirectUriTemplate).toBe('https://example.com/callback');
  });

  it('should convert class instance to plain object', () => {
    const instance = new InitTransactionTO(
      PresentationTypeTO.IdTokenRequest,
      IdTokenTypeTO.AttesterSigned,
      {} as PresentationDefinition,
      'xyz789',
      ResponseModeTO.DirectPost,
      EmbedModeTO.ByValue,
      EmbedModeTO.ByReference,
      'https://example.com/callback'
    );

    const plainObject = instanceToPlain(instance);

    expect(plainObject.type).toBe('id_token');
    expect(plainObject.id_token_type).toBe('attester_signed_id_token');
    expect(plainObject.presentation_definition).toEqual(
      instance.presentationDefinition
    );
    expect(plainObject.nonce).toBe('xyz789');
    expect(plainObject.response_mode).toBe('direct_post');
    expect(plainObject.jar_mode).toBe('by_value');
    expect(plainObject.presentation_definition_mode).toBe('by_reference');
    expect(plainObject.wallet_response_redirect_uri_template).toBe(
      'https://example.com/callback'
    );
  });

  it('should validate the class instance', () => {
    const instance = new InitTransactionTO(
      PresentationTypeTO.IdTokenRequest,
      IdTokenTypeTO.AttesterSigned,
      {} as PresentationDefinition,
      'xyz789',
      ResponseModeTO.DirectPost,
      EmbedModeTO.ByValue,
      EmbedModeTO.ByReference,
      'https://example.com/callback'
    );

    const errors = validateSync(instance);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for invalid enum values', () => {
    const instance = new InitTransactionTO(
      'invalid_type' as PresentationTypeTO,
      'invalid_id_token_type' as IdTokenTypeTO,
      {} as PresentationDefinition,
      'xyz789',
      'invalid_response_mode' as ResponseModeTO,
      'invalid_jar_mode' as EmbedModeTO,
      'invalid_presentation_definition_mode' as EmbedModeTO,
      'https://example.com/callback'
    );

    const errors = validateSync(instance);
    //console.log(errors);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('JwtSecuredAuthorizationRequestTO', () => {
  it('should convert plain object to class instance', () => {
    const plainObject = {
      presentation_id: 'abc123',
      client_id: 'client1',
      request: 'request_data',
      request_uri: 'https://example.com/request',
    };

    const instance = plainToInstance(
      JwtSecuredAuthorizationRequestTO,
      plainObject
    );

    expect(instance).toBeInstanceOf(JwtSecuredAuthorizationRequestTO);
    expect(instance.transactionId).toBe('abc123');
    expect(instance.clientId).toBe('client1');
    expect(instance.request).toBe('request_data');
    expect(instance.requestUri).toBe('https://example.com/request');
  });

  it('should convert class instance to plain object', () => {
    const instance = new JwtSecuredAuthorizationRequestTO(
      'xyz789',
      'client2',
      'https://example.com/request2',
      'request_data2'
    );

    const plainObject = instanceToPlain(instance);

    expect(plainObject.presentation_id).toBe('xyz789');
    expect(plainObject.client_id).toBe('client2');
    expect(plainObject.request).toBe('request_data2');
    expect(plainObject.request_uri).toBe('https://example.com/request2');
  });

  it('should validate the class instance', () => {
    const instance = new JwtSecuredAuthorizationRequestTO(
      'abc123',
      'client1',
      'https://example.com/request',
      'request_data'
    );

    const errors = validateSync(instance);
    expect(errors.length).toBe(0);
  });

  it('should fail validation for missing required properties', () => {
    const instance = new JwtSecuredAuthorizationRequestTO();

    const errors = validateSync(instance);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail validation for invalid property types', () => {
    const instance = new JwtSecuredAuthorizationRequestTO();

    const errors = validateSync(instance);
    expect(errors.length).toBeGreaterThan(0);
  });
});