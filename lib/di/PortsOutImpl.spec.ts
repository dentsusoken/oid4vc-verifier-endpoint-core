import 'reflect-metadata';
import { describe, it, expect } from 'vitest';
import { PortsOutImpl } from './PortsOutImpl';
import {
  CreateQueryWalletResponseRedirectUri,
  DurationFactory,
  GenerateRequestId,
  GenerateResponseCode,
  GenerateTransactionId,
} from '../ports/out/cfg';
import {
  GenerateEphemeralECDHPrivateJwk,
  SignRequestObject,
  VerifyJarmJwt,
} from '../ports/out/jose';
import {
  LoadPresentationById,
  LoadPresentationByRequestId,
  StorePresentation,
} from '../ports/out/persistence';
import { PortsOut } from './PortsOut';
import { MockConfiguration } from './MockConfiguration';

describe('PortsOutImpl', () => {
  const portsOut: PortsOut = new PortsOutImpl(new MockConfiguration());

  it('should create CreateQueryWalletResponseRedirectUri invoker', () => {
    const invoker: CreateQueryWalletResponseRedirectUri =
      portsOut.createQueryWalletResponseRedirectUri();
    expect(typeof invoker).toBe('function');
  });

  it('should create DurationFactory', () => {
    const factory: DurationFactory = portsOut.durationFactory();
    expect(typeof factory).toBe('object');
  });

  it('should create GenerateRequestId invoker', () => {
    const invoker: GenerateRequestId = portsOut.generateRequestId();
    expect(typeof invoker).toBe('function');
  });

  it('should create GenerateResponseCode invoker', () => {
    const invoker: GenerateResponseCode = portsOut.generateResponseCode();
    expect(typeof invoker).toBe('function');
  });

  it('should create GenerateTransactionId invoker', () => {
    const invoker: GenerateTransactionId = portsOut.generateTransactionId();
    expect(typeof invoker).toBe('function');
  });

  it('should create GenerateEphemeralECDHPrivateJwk invoker', () => {
    const invoker: GenerateEphemeralECDHPrivateJwk =
      portsOut.generateEphemeralECDHPrivateJwk();
    expect(typeof invoker).toBe('function');
  });

  it('should create SignRequestObject invoker', () => {
    const invoker: SignRequestObject = portsOut.signRequestObject();
    expect(typeof invoker).toBe('function');
  });

  it('should create VerifyJarmJwt invoker', () => {
    const invoker: VerifyJarmJwt = portsOut.verifyJarmJwt();
    expect(typeof invoker).toBe('function');
  });

  it('should create LoadPresentationById invoker', () => {
    const invoker: LoadPresentationById = portsOut.loadPresentationById();
    expect(typeof invoker).toBe('function');
  });

  it('should create LoadPresentationByRequestId invoker', () => {
    const invoker: LoadPresentationByRequestId =
      portsOut.loadPresentationByRequestId();
    expect(typeof invoker).toBe('function');
  });

  it('should create StorePresentation invoker', () => {
    const invoker: StorePresentation = portsOut.storePresentation();
    expect(typeof invoker).toBe('function');
  });
});
