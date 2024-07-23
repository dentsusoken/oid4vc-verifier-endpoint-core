export type JWK = {
  parsedX509CertChain: any[];
};

// export enum SanType {
//   DNS,
//   URI,
// }

export class X509Certificate {
  public static subjectAlternativeNames?: any[] = [];
  //   containsSanDns: (x: any) => true;
  //   containsSanUri: (x: any) => true;
}
export type JWSAlgorithm = any;

export namespace JWSAlgorithm {
  export const Family = {
    SIGNATURE: [] as any[],
  };
}

export class DefaultJWSSignerFactory {
  // @ts-expect-error
  createJWSSigner(key: JWK, algorithm: JWSAlgorithm) {
    return 'hoge';
  }
}
