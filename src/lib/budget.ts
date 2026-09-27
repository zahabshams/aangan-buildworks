export function estimateBudget(input: {
  builtArea: number;
  quality: string;
  interiors: boolean;
  floors: string;
}): { low: number; high: number } {
  const bands: Record<string, [number, number]> = {
    "Essential and durable": [2400, 2800],
    "Thoughtful premium": [2800, 3400],
    "Premium custom": [3400, 4200],
  };
  const [rateLow, rateHigh] = bands[input.quality] ?? [2800, 3400];
  const floorFactor = input.floors === "1" ? 1.05 : 1;
  const interiorFactor = input.interiors ? 1.15 : 1;
  const low = Math.round(input.builtArea * rateLow * floorFactor * interiorFactor);
  const high = Math.round(input.builtArea * rateHigh * floorFactor * interiorFactor);
  return { low, high };
}
