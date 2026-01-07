/**
 * This function handles the 3D diffusion math.
 * It's a translation of your Python 'parallel_sum_cubic' function.
 */
export const calculateChloride = (params, maxIndex = 15) => {
  // Destructure our parameters for easier use
  const { L1, L2, L3, x, y, z, Cs, Cs0, Da, t } = params;
  
  const delta_C = Cs0 - Cs;
  const PI = Math.PI;
  const coeff_base = (64 * delta_C) / Math.pow(PI, 3);
  
  let totalSum = 0;

  // In Python, you used meshgrid. In JS, we use nested loops.
  // We only use odd numbers (1, 3, 5...) up to maxIndex.
  for (let n = 1; n <= maxIndex; n += 2) {
    for (let m = 1; m <= maxIndex; m += 2) {
      for (let p = 1; p <= maxIndex; p += 2) {
        
        const termCoeff = coeff_base / (n * m * p);
        
        const sinProduct = 
          Math.sin((n * PI * x) / L1) * Math.sin((m * PI * y) / L2) * Math.sin((p * PI * z) / L3);
        
        const lambda = 
          Math.pow((n * PI) / L1, 2) + 
          Math.pow((m * PI) / L2, 2) + 
          Math.pow((p * PI) / L3, 2);
        
        // Handling exponential decay (clamping to avoid errors)
        let exponent = -Da * lambda * t;
        const decay = Math.exp(Math.max(exponent, -700));

        totalSum += termCoeff * sinProduct * decay;
      }
    }
  }

  return Cs + totalSum;
};

export const getConvergenceData = (params, maxCap = 31) => {
  let dataPoints = [];
  let prevValue = null;
  const tol = params.tol || 1e-6;

  // Loop through odd indices to build the plot data
  for (let i = 3; i <= maxCap; i += 2) {
    const currentVal = calculateChloride(params, i);
    const numTerms = Math.pow(Math.floor(i / 2) + 1, 3); // n*m*p total terms
    
    dataPoints.push({
      iteration: i,
      terms: numTerms,
      concentration: currentVal
    });

    if (prevValue !== null && Math.abs(currentVal - prevValue) < tol) {
      break;
    }
    prevValue = currentVal;
  }
  return dataPoints;
};