interface TestType {
  bar: string;
}

const foo: TestType | undefined = undefined;

const boo = foo.bar;
