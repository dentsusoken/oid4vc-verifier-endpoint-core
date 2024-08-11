import { describe, it, expect } from 'vitest';

import { Result } from '../../kotlin';
import {
  EphemeralECDHPrivateJwk,
  ResponseModeOption,
  JarmOption,
} from '../../domain';
import { GenerateEphemeralECDHPrivateJwk } from '../../ports/out/jose';
import { createEphemeralECDHPrivateJwk } from './InitTransactionService.create';

describe('InitTransactionService.create', () => {
  describe('createEphemeralECDHPrivateJwk', () => {
    const ephemeralECDHPrivateJwk: EphemeralECDHPrivateJwk = {
      value: 'hoge',
    };
    const generatePrivateJwk: GenerateEphemeralECDHPrivateJwk = async () => {
      return Result.success(ephemeralECDHPrivateJwk);
    };

    it('should return undefined when responseModeOption is not DirectPostJwt', async () => {
      const responseModeOption = ResponseModeOption.DirectPost;
      const jarmOption: JarmOption = new JarmOption.Signed('RS256');
      const result = await createEphemeralECDHPrivateJwk(
        responseModeOption,
        jarmOption,
        generatePrivateJwk
      );
      expect(result).toBeUndefined();
    });

    it('should throw an error when jarmOption is Signed', async () => {
      const responseModeOption = ResponseModeOption.DirectPostJwt;
      const jarmOption: JarmOption = new JarmOption.Signed('RS256');
      await expect(
        createEphemeralECDHPrivateJwk(
          responseModeOption,
          jarmOption,
          generatePrivateJwk
        )
      ).rejects.toThrowError('Misconfiguration');
    });

    it('should return the generated EphemeralECDHPrivateJwk when conditions are met', async () => {
      const responseModeOption = ResponseModeOption.DirectPostJwt;
      const jarmOption = new JarmOption.Encrypted('RSA-OAEP', 'A256GCM');
      const result = await createEphemeralECDHPrivateJwk(
        responseModeOption,
        jarmOption,
        generatePrivateJwk
      );
      expect(result).toEqual(ephemeralECDHPrivateJwk);
    });

    it('should throw an error when generatePrivateJwk fails', async () => {
      const responseModeOption = ResponseModeOption.DirectPostJwt;
      const jarmOption: JarmOption = new JarmOption.Encrypted(
        'RSA-OAEP',
        'A256GCM'
      );
      const failingGeneratePrivateJwk: GenerateEphemeralECDHPrivateJwk =
        async () => {
          return Result.failure(new Error('Failed to generate private JWK'));
        };
      await expect(
        createEphemeralECDHPrivateJwk(
          responseModeOption,
          jarmOption,
          failingGeneratePrivateJwk
        )
      ).rejects.toThrowError('Failed to generate private JWK');
    });
  });
});
