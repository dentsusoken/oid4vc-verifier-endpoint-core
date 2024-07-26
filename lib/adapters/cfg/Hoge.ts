interface Calc {
  (a: number, b: number): number;
}

class Add implements Calc {
  (a: number, b: number): number {
    return a + b;
  }
}
