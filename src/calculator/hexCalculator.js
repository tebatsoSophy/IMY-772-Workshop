export const isValidHexInput = (char) => /^[0-9A-Fa-f]$/.test(char);
const toDecimal = (hex) => parseInt(hex, 16);

export const formatHexResult = (decimal) => decimal.toString(16).toUpperCase();

const validateResult = (result) => {
  if (result < 0) return 'ERROR: Negative result';
  if (!Number.isInteger(result)) return 'ERROR: Fractional result';
  if (result > 0xFFFF) return 'ERROR: Result out of range';
  return formatHexResult(result);
};

export const hexAdd      = (a, b) => validateResult(toDecimal(a) + toDecimal(b));
export const hexSubtract = (a, b) => validateResult(toDecimal(a) - toDecimal(b));
export const hexMultiply = (a, b) => validateResult(toDecimal(a) * toDecimal(b));
export const hexDivide   = (a, b) => {
  if (toDecimal(b) === 0) return 'ERROR: Division by zero';
  return validateResult(toDecimal(a) / toDecimal(b));
};