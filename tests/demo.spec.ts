import { suite, test } from 'uvu';
import * as assert from 'uvu/assert';
import * as ENV from './setup/testenv';

const TestSuite = suite('some test suite');

let _foo: number;
let _count: number;

TestSuite.before(() => {
  _count = 0;
  _foo = 10;
});

TestSuite.skip('should return a number', () => {
  assert.equal(_foo, 'x');
});

TestSuite('should return a number', () => {
  assert.equal(_foo, 10);
});

TestSuite.only('should return a number', () => {
  assert.equal(_foo + _count, 10);
  assert.is.not(_foo, 20);
});

TestSuite.run();

test.before(ENV.setup);
test.before.each(ENV.reset);

test('smoke', () => {
  assert.ok(true);
});

test('Math.sqrt()', () => {
  assert.is(Math.sqrt(4), 2);
  assert.is(Math.sqrt(144), 12);
  assert.is(Math.sqrt(2), Math.SQRT2);
});

test('JSON', () => {
  const input = {
    foo: 'hello',
    bar: 'world',
  };

  const output = JSON.stringify(input);

  assert.snapshot(output, `{"foo":"hello","bar":"world"}`);
  assert.equal(JSON.parse(output), input, 'matches original');
});

test.run();
