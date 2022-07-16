// leave only: @ts-strict to see a strict error
interface TestType {
  bar: string;
}

const foo: TestType | undefined = undefined;

const boo = foo.bar;
