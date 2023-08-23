import { LogicOperator } from 'att-string-transcoder';

import { createOperator } from './createOperator.js';

describe('createOperator', () => {
  describe('when given only required arguments', () => {
    it('returns a Logic_Operator prefab', () => {
      const prefab = createOperator('And');

      expect(prefab.name).toStrictEqual('Logic_Operator');
      expect(prefab.components.LogicGateReceiver?.operationType).toStrictEqual(LogicOperator.And);
      expect(prefab.components.LogicGateReceiver?.isInversedOutputSaved).toStrictEqual(false);
    });
  });

  describe('when given additional arguments', () => {
    it('returns a Logic_Operator prefab', () => {
      const prefab = createOperator('Xor', true);

      expect(prefab.name).toStrictEqual('Logic_Operator');
      expect(prefab.components.LogicGateReceiver?.operationType).toStrictEqual(LogicOperator.Xor);
      expect(prefab.components.LogicGateReceiver?.isInversedOutputSaved).toStrictEqual(true);
    });
  });
});
