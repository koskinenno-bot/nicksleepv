/**
 * Calculates the present value of a stock based on a 2-stage DCF.
 * Stage 1: High growth for `years`
 * Stage 2: Terminal value based on a multiple of earnings in the final year
 */
export const calculateIntrinsicValue = (
  currentFcf: number,
  growthRate: number,
  discountRate: number,
  years: number = 10,
  terminalMultiple: number = 15
): number => {
  let presentValueSum = 0;
  let futureFcf = currentFcf;

  // Stage 1: Growth Period
  for (let i = 1; i <= years; i++) {
    futureFcf = futureFcf * (1 + growthRate);
    presentValueSum += futureFcf / Math.pow(1 + discountRate, i);
  }

  // Stage 2: Terminal Value
  const terminalValue = futureFcf * terminalMultiple;
  const presentValueTerminal = terminalValue / Math.pow(1 + discountRate, years);

  return presentValueSum + presentValueTerminal;
};

/**
 * Iteratively finds the implied growth rate for a current price.
 */
export const findImpliedGrowth = (
  currentPrice: number,
  currentFcf: number,
  discountRate: number,
  years: number = 10,
  terminalMultiple: number = 15
): number => {
  let low = -0.5;
  let high = 1.0;
  let guess = 0.0;
  let calculatedPrice = 0;

  for (let i = 0; i < 100; i++) {
    guess = (low + high) / 2;
    calculatedPrice = calculateIntrinsicValue(currentFcf, guess, discountRate, years, terminalMultiple);
    
    if (Math.abs(calculatedPrice - currentPrice) < 0.01) {
      return guess;
    }

    if (calculatedPrice > currentPrice) {
      high = guess;
    } else {
      low = guess;
    }
  }
  return guess;
};

/**
 * Calculates the Annualized Return (CAGR) of the share price.
 * Assuming the share price converges to (Future Earnings * Exit Multiple) in `years`.
 */
export const calculateScenarioCAGR = (
  currentPrice: number,
  currentOwnersEarnings: number,
  earningsGrowthRate: number,
  exitMultiple: number,
  years: number
): number => {
  const futureEarnings = currentOwnersEarnings * Math.pow(1 + earningsGrowthRate, years);
  const futurePrice = futureEarnings * exitMultiple;
  
  // Avoid division by zero or negative roots if price is weird (though unlikely here)
  if (currentPrice <= 0 || futurePrice < 0) return 0;

  // CAGR formula: (End Value / Start Value) ^ (1/n) - 1
  const cagr = Math.pow(futurePrice / currentPrice, 1 / years) - 1;
  return cagr;
};