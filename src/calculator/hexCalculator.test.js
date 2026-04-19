import {isValidHexInput, hexAdd, hexSubtract, hexMultiply, hexDivide,formatHexResult} from './hexCalculator';



 describe('Input Validation', () => {
  test('accepts valid hex characters (0-9, A-F)', () => {
    expect(isValidHexInput('0')).toBe(true);
    expect(isValidHexInput('9')).toBe(true);
    expect(isValidHexInput('A')).toBe(true);
    expect(isValidHexInput('F')).toBe(true);
  });

  test('rejects invalid hex characters', () => {
    expect(isValidHexInput('G')).toBe(false);
    expect(isValidHexInput('z')).toBe(false);
    expect(isValidHexInput('@')).toBe(false);
    expect(isValidHexInput(' ')).toBe(false);
  });

});



describe('Arithmetic Operations', () => {


  test('adds two hex numbers correctly', () => {
    expect(hexAdd('1A', '0B')).toBe('25');  
    expect(hexAdd('FF', '01')).toBe('100');
  });

  
  test('subtracts two hex numbers correctly', () => {
    expect(hexSubtract('1A', '0A')).toBe('10'); 
  });


  test('multiplies two hex numbers correctly', () => {
    expect(hexMultiply('02', '03')).toBe('6');
  });

  
  test('divides two hex numbers correctly', () => {
    expect(hexDivide('FF', '0F')).toBe('11'); 
  });
});

describe('Error Handling', () => {


  test('returns error for negative results', () => {
    expect(hexSubtract('0A', '1A')).toBe('ERROR: Negative result');
  });

});



describe('Output Formatting', () => {

  test('result is displayed in uppercase hex', () => {
    expect(formatHexResult(255)).toBe('FF');
 
  });

});