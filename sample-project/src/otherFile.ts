// @ts-strict to see a strict error
interface TestType {
  bar: string;
}

const foo1: TestType | undefined = undefined;

const boo2 = foo1.bar;
