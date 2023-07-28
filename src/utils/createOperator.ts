import { LogicGateReceiverComponent, Prefab, type LogicOperator } from 'att-string-transcoder';

export function createOperator(operator: LogicOperator, isInversedOutput = true): Prefab<'Logic_Operator'> {
  return new Prefab('Logic_Operator', {
    components: {
      LogicGateReceiver: new LogicGateReceiverComponent({
        version: 2,
        operationType: operator,
        isInversedOutputSaved: isInversedOutput
      })
    }
  });
}
