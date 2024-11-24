function factorial(x) {
  if (x < 0) {
    return 0;
  }
  return x === 0 ? 1 : Array.from({ length: x }, (_, i) => i + 1).reduce((acc, num) => acc * num, 1);
}