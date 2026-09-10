export const calculateExpression = (expression: string): number => {
  const normalizedExpression = expression.replace(/\s+/g, '');
  const tokens = normalizedExpression.match(/^(?:\d+(?:\.\d+)?)(?:[+\-*/](?:\d+(?:\.\d+)?))*$/);
  if (!tokens) throw new Error('Invalid expression');

  const values = normalizedExpression.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const operators = normalizedExpression.match(/[+\-*/]/g) ?? [];
  const collapsedValues: number[] = [values[0]];
  const collapsedOperators: string[] = [];

  operators.forEach((operator, index) => {
    const nextValue = values[index + 1];
    if (operator === '*' || operator === '/') {
      const previous = collapsedValues.pop() ?? 0;
      collapsedValues.push(operator === '*' ? previous * nextValue : previous / nextValue);
    } else {
      collapsedValues.push(nextValue);
      collapsedOperators.push(operator);
    }
  });

  return collapsedValues.slice(1).reduce(
    (result, value, index) => collapsedOperators[index] === '+' ? result + value : result - value,
    collapsedValues[0]
  );
};
