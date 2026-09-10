import { describe, expect, it } from 'vitest';
import { calculateExpression } from '../src/lib/calculator';

describe('calculateExpression', () => {
  it('respects multiplication precedence', () => {
    expect(calculateExpression('2 + 3 * 4')).toBe(14);
  });

  it('rejects executable or malformed input', () => {
    expect(() => calculateExpression('alert(1)')).toThrow('Invalid expression');
  });
});
