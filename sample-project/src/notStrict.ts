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

const barValue: string = foo.bar;