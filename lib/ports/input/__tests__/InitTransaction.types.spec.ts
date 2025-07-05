import { describe, expect, it } from 'vitest';
import { Id, PresentationDefinition } from '@vecrea/oid4vc-prex';
import {
  PresentationTypeTO,
  IdTokenTypeTO,
  ResponseModeTO,
  EmbedModeTO,
  InitTransactionTO,
  JwtSecuredAuthorizationRequestTO,
  initTransactionSchema,
  jwtSecuredAuthorizationRequestSchema,
} from '../InitTransaction.types';

describe('InitTransactionTO', () => {
  it('should convert plain object to class instance', () => {
    const plainObject = {
      type: PresentationTypeTO.VpTokenRequest,
      id_token_type: IdTokenTypeTO.SubjectSigned,
      presentation_definition: {
        id: 'id',
        input_descriptors: [],
      },
      nonce: 'abc123',
      response_mode: ResponseModeTO.DirectPostJwt,
      jar_mode: EmbedModeTO.ByReference,
      presentation_definition_mode: EmbedModeTO.ByValue,
      wallet_response_redirect_uri_template: 'https://example.com/callback',
    };

    // const instance = plainToInstance(InitTransactionTO, plainObject);
    const instance = InitTransactionTO.fromJSON(plainObject);

    expect(instance).toBeInstanceOf(InitTransactionTO);
    expect(instance.type).toBe(PresentationTypeTO.VpTokenRequest);
    expect(instance.idTokenType).toBe(IdTokenTypeTO.SubjectSigned);
    expect(instance.presentationDefinition).toBeInstanceOf(
      PresentationDefinition
    );
    // expect(instance.presentationDefinition).toEqual(
    //   new PresentationDefinition(
    //     new Id('id'),
    //     undefined,
    //     undefined,
    //     undefined,
    //     [new InputDescriptor()],
    //     undefined
    //   )
    // );
    expect(instance.nonce).toBe('abc123');
    expect(instance.responseMode).toBe(ResponseModeTO.DirectPostJwt);
    expect(instance.jarMode).toBe(EmbedModeTO.ByReference);
    expect(instance.presentationDefinitionMode).toBe(EmbedModeTO.ByValue);
    expect(instance.redirectUriTemplate).toBe('https://example.com/callback');
  });

  it('should convert class instance to plain object', () => {
    const dummyPresentationDefinition = new PresentationDefinition(
      new Id('dummy-id'),
      undefined,
      undefined,
      undefined,
      [],
      []
    );

    const instance = new InitTransactionTO(
      PresentationTypeTO.IdTokenRequest,
      IdTokenTypeTO.AttesterSigned,
      dummyPresentationDefinition,
      'xyz789',
      ResponseModeTO.DirectPost,
      EmbedModeTO.ByValue,
      EmbedModeTO.ByReference,
      'https://example.com/callback'
    );

    const plainObject = instance.toJSON();

    expect(plainObject.type).toBe('id_token');
    expect(plainObject.id_token_type).toBe('attester_signed_id_token');
    expect(plainObject.presentation_definition).toEqual(
      instance.presentationDefinition?.toJSON()
    );
    expect(plainObject.nonce).toBe('xyz789');
    expect(plainObject.response_mode).toBe('direct_post');
    expect(plainObject.jar_mode).toBe('by_value');
    expect(plainObject.presentation_definition_mode).toBe('by_reference');
    expect(plainObject.wallet_response_redirect_uri_template).toBe(
      'https://example.com/callback'
    );
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

    const instance = JwtSecuredAuthorizationRequestTO.fromJSON(plainObject);

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
      'request_data2',
      'https://example.com/request2'
    );

    // const plainObject = instanceToPlain(instance);
    const plainObject = instance.toJSON();

    expect(plainObject.presentation_id).toBe('xyz789');
    expect(plainObject.client_id).toBe('client2');
    expect(plainObject.request).toBe('request_data2');
    expect(plainObject.request_uri).toBe('https://example.com/request2');
  });
});

describe('InitTransationSchema', () => {
  it('should create schema with provided value', () => {
    const plainObject = {
      type: PresentationTypeTO.VpTokenRequest,
      id_token_type: IdTokenTypeTO.SubjectSigned,
      presentation_definition: {
        id: 'id',
        input_descriptors: [],
      },
      nonce: 'abc123',
      response_mode: ResponseModeTO.DirectPostJwt,
      jar_mode: EmbedModeTO.ByReference,
      presentation_definition_mode: EmbedModeTO.ByValue,
      wallet_response_redirect_uri_template: 'https://example.com/callback',
    };

    const schema = initTransactionSchema.parse({
      type: plainObject.type,
      id_token_type: plainObject.id_token_type,
      presentation_definition: plainObject.presentation_definition,
      nonce: plainObject.nonce,
      response_mode: plainObject.response_mode,
      jar_mode: plainObject.jar_mode,
      presentation_definition_mode: plainObject.presentation_definition_mode,
      wallet_response_redirect_uri_template:
        plainObject.wallet_response_redirect_uri_template,
    });

    expect(schema.type).toBe(plainObject.type);
    expect(schema.id_token_type).toBe(plainObject.id_token_type);
    expect(schema.presentation_definition).toEqual(
      plainObject.presentation_definition
    );
    expect(schema.nonce).toBe(plainObject.nonce);
    expect(schema.response_mode).toBe(plainObject.response_mode);
    expect(schema.jar_mode).toBe(plainObject.jar_mode);
    expect(schema.presentation_definition_mode).toBe(
      plainObject.presentation_definition_mode
    );
    expect(schema.wallet_response_redirect_uri_template).toBe(
      plainObject.wallet_response_redirect_uri_template
    );
  });

  it('should create schema with undefined provided value', () => {
    expect(() => initTransactionSchema.parse(undefined)).toThrowError();
  });
});

describe('JwtSecuredAuthorizationRequestSchema', () => {
  it('should create schema with provided value', () => {
    const plainObject = {
      presentation_id: 'abc123',
      client_id: 'client1',
      request: 'request_data',
      request_uri: 'https://example.com/request',
    };

    const schema = jwtSecuredAuthorizationRequestSchema.parse({
      presentation_id: plainObject.presentation_id,
      client_id: plainObject.client_id,
      request: plainObject.request,
      request_uri: plainObject.request_uri,
    });

    expect(schema.presentation_id).toBe(plainObject.presentation_id);
    expect(schema.client_id).toBe(plainObject.client_id);
    expect(schema.request).toBe(plainObject.request);
    expect(schema.request_uri).toBe(plainObject.request_uri);
  });

  it('should create schema with undefined value', () => {
    expect(() =>
      jwtSecuredAuthorizationRequestSchema.parse(undefined)
    ).toThrowError();
  });
});
