// @ts-strict-ignore
export {}; // make this file a module to avoid global redeclaration errors

interface TestType {
  bar: string;
}

const getFoo = (): TestType | undefined => {
  // Simulate fetching or computing the value
  return Math.random() > 0.5 ? { bar: 'value from getFoo' } : undefined;
}

const foo: TestType | undefined = getFoo();

const isTestType = (obj: unknown): obj is TestType => {
  if (obj == null || typeof obj !== 'object') return false;
  if (!Object.prototype.hasOwnProperty.call(obj, 'bar')) return false;
  return typeof (obj as Record<string, unknown>).bar === 'string';
}

const barValue: string = isTestType(foo) ? foo.bar : 'some default value';