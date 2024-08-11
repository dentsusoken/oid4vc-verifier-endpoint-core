import {
  ResponseModeOption,
  JarmOption,
  EphemeralECDHPrivateJwk,
} from '../../domain';
import { GenerateEphemeralECDHPrivateJwk } from '../../ports/out/jose';

export const createEphemeralECDHPrivateJwk = async (
  responseModeOption: ResponseModeOption,
  jarmOption: JarmOption,
  generatePrivateJwk: GenerateEphemeralECDHPrivateJwk
): Promise<EphemeralECDHPrivateJwk | undefined> => {
  if (responseModeOption !== ResponseModeOption.DirectPostJwt) {
    return undefined;
  }

  if (jarmOption.__type === 'Signed') {
    throw new Error('Misconfiguration');
  }

  const result = await generatePrivateJwk();

  return result.getOrThrow();
};
