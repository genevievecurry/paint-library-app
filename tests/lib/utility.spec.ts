import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as ENV from '../setup/testenv';
import { pigmentCode } from '../../src/lib/utility';

const Utility = suite('/lib/utility');

let pigmentType: string, pigmentNumber: number, colorCode: string;

Utility.before(ENV.setup);
Utility.before.each(ENV.reset);

Utility.before(() => {
  pigmentType = 'CIPIGMENT';
  pigmentNumber = 62;
  colorCode = 'Br';
});

Utility('should return a converted pigment ci code', () => {
  assert.is(pigmentCode(pigmentType, pigmentNumber, colorCode, {html: false}), 'PBr62');
});

Utility.run();
