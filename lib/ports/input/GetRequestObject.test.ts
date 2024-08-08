// import { describe, expect, it, vi } from 'vitest';
// import { GetRequestObjectLive } from './GetRequestObject';
// import {
//   LoadPresentationByRequestId,
//   StorePresentation,
// } from '../out/persistence';
// import { SignRequestObject } from '../out/jose';
// import {
//   ClientIdSchemeNS,
//   ClientMetaData,
//   EmbedOptionNS,
//   EphemeralECDHPrivateJwk,
//   GetWalletResponseMethodNS,
//   JarmOptionNS,
//   Nonce,
//   PresentationNS,
//   BuildUrl,
//   PresentationTypeNS,
//   RequestId,
//   ResponseModeOption,
//   SigningConfig,
//   TransactionId,
//   VerifierConfig,
// } from '../../domain';
// import { PresentationDefinition } from '../../../mock/prex';
// import { Result } from '../../kotlin';
// import { QueryResponse } from './QueryResponse';

// const presentation = new PresentationNS.Requested(
//   new TransactionId('test'),
//   new Date(),
//   new PresentationTypeNS.VpTokenRequest(new PresentationDefinition()),
//   new RequestId('test'),
//   new Nonce('test'),
//   new EphemeralEncryptionPrivateJwk('test'),
//   ResponseModeOption.DirectPostJwt,
//   EmbedOptionNS.ByValue,
//   GetWalletResponseMethodNS.Redirect
// );

// describe('GetRequestObject', () => {
//   const storePresentation: StorePresentation = (_presentation: Presentation) =>
//     Promise.resolve();
//   const signRequestObject: SignRequestObject = (
//     _verifierConfig: VerifierConfig,
//     _clock: Date,
//     _presentation: PresentationNS.Requested
//   ) => Result.success('jwt');
//   const urlBuilder: BuildUrl<RequestId> = (_id: RequestId) =>
//     new URL('http://localhost');

//   it('should return QueryResponse.Found', async () => {
//     const loadPresentationByRequestId: LoadPresentationByRequestId = (
//       _requestId: RequestId
//     ) => Promise.resolve(presentation);

//     const verifierConfig: VerifierConfig = new VerifierConfig(
//       new ClientIdSchemeNS.PreRegistered(
//         'test',
//         new SigningConfig({ parsedX509CertChain: ['alg', 'enc'] }, 'alg')
//       ),
//       new EmbedOptionNS.ByValue(),
//       new EmbedOptionNS.ByValue(),
//       ResponseModeOption.DirectPostJwt,
//       urlBuilder,
//       10 * 60 * 1000,
//       new ClientMetaData(
//         new EmbedOptionNS.ByValue(),
//         'alg',
//         'alg',
//         'enc',
//         ['alg', 'enc'],
//         new JarmOptionNS.Signed('alg')
//       )
//     );
//     const clock: Date = new Date();

//     const instanse = new GetRequestObjectLive(
//       loadPresentationByRequestId,
//       storePresentation,
//       signRequestObject,
//       verifierConfig,
//       clock
//     );

//     const result = await instanse.invoke(new RequestId('test'));
//     expect(result).toBeInstanceOf(QueryResponse.Found);
//   });
//   it('should return QueryResponse.NotFound', async () => {
//     const loadPresentationByRequestId: LoadPresentationByRequestId = vi
//       .fn()
//       .mockReturnValue(undefined);

//     const verifierConfig: VerifierConfig = new VerifierConfig(
//       new ClientIdSchemeNS.PreRegistered(
//         'test',
//         new SigningConfig({ parsedX509CertChain: ['alg', 'enc'] }, 'alg')
//       ),
//       new EmbedOptionNS.ByValue(),
//       new EmbedOptionNS.ByValue(),
//       ResponseModeOption.DirectPostJwt,
//       urlBuilder,
//       10 * 60 * 1000,
//       new ClientMetaData(
//         new EmbedOptionNS.ByValue(),
//         'alg',
//         'alg',
//         'enc',
//         ['alg', 'enc'],
//         new JarmOptionNS.Signed('alg')
//       )
//     );
//     const clock: Date = new Date();

//     const instanse = new GetRequestObjectLive(
//       loadPresentationByRequestId,
//       storePresentation,
//       signRequestObject,
//       verifierConfig,
//       clock
//     );

//     const result = await instanse.invoke(new RequestId('test'));
//     expect(result).toBe(QueryResponse.NotFound);
//   });
//   it('should return QueryResponse.InvalidState', async () => {
//     const loadPresentationByRequestId: LoadPresentationByRequestId = vi
//       .fn()
//       .mockReturnValue({});

//     const verifierConfig: VerifierConfig = new VerifierConfig(
//       new ClientIdSchemeNS.PreRegistered(
//         'test',
//         new SigningConfig({ parsedX509CertChain: ['alg', 'enc'] }, 'alg')
//       ),
//       new EmbedOptionNS.ByValue(),
//       new EmbedOptionNS.ByValue(),
//       ResponseModeOption.DirectPostJwt,
//       urlBuilder,
//       10 * 60 * 1000,
//       new ClientMetaData(
//         new EmbedOptionNS.ByValue(),
//         'alg',
//         'alg',
//         'enc',
//         ['alg', 'enc'],
//         new JarmOptionNS.Signed('alg')
//       )
//     );
//     const clock: Date = new Date();

//     const instanse = new GetRequestObjectLive(
//       loadPresentationByRequestId,
//       storePresentation,
//       signRequestObject,
//       verifierConfig,
//       clock
//     );

//     const result = await instanse.invoke(new RequestId('test'));
//     expect(result).toBe(QueryResponse.InvalidState);
//   });
// });
