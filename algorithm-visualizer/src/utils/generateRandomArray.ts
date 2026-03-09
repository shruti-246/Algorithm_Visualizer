export function generateRandomArray(
  size = 12,
  min = 10,
  max = 100,
): number[] {
  return Array.from({ length: size }, () => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  });
}