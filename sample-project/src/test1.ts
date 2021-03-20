//@ts-strict
// here
import { EventEmitter } from 'events';

class Banana {
  callee = 1;
  caller = 2;
  getDay() {}
  thisIsTheOnlyThatWillAutoComplete = 99;
}
const banana = new Banana();

// banana.
// banana.thisIsTheOnlyThatWillAutoComplete
/*
first we show that autocomplete in banana filter some
members like callee, caller and getDay

Second, we show that when we select the class identifier
'banana' our refactor is suggested and it works, but
when we select other identifiers the suggestion is not
shown
*/

interface TestType {
  bar: string;
}

const foo: TestType | undefined = undefined;

const boo = foo.bar;
const boo = foo.bar;

function target(emitter: EventEmitter) {
  emitter.on('foo', () => {});
}
let f = function f() {};
const casted = Object.assign(f.prototype, EventEmitter.prototype) as EventEmitter;
//now we now is an EventEmitter - we cast
target(casted);
