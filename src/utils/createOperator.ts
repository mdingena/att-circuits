import { LogicGateReceiverComponent, Prefab, LogicOperator } from 'att-string-transcoder';

export function createOperator(
  operator: keyof typeof LogicOperator,
  isInversedOutput = false
): Prefab<'Logic_Operator'> {
  const operationType = LogicOperator[operator];

  return new Prefab('Logic_Operator', {
    components: {
      LogicGateReceiver: new LogicGateReceiverComponent({
        version: 2,
        operationType,
        isInversedOutputSaved: isInversedOutput
      })
    }
  });
}
