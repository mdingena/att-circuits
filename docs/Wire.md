# Class: `Wire`

- [Constructors](#constructors)
  - [`new Wire(type, circuit)`](#new-wiretype-circuit)
- [Methods](#methods)
  - [`connect(sender, receiver)`](#connectsender-receiver)

## Constructors

### `new Wire(type, circuit)`

Creates a wire instance that can connect two prefabs via their logic sender and receiver that match this wire's type. A wire must belong to a circuit, which must be passed as its second argument.

- `type` [`<WireType>`](../src/types/WireType.ts) The type of signals this wire will transmit.
- `circuit` [`<Circuit>`](./Circuit.md) The Circuit to which the wire belongs.
- Returns: `<Wire>`

```ts
import { Circuit, Wire } from 'att-circuits';

const circuit = new Circuit();
const wire = new Wire('boolean', circuit);
// alternatively
const wire = circuit.createWire('boolean');
```

## Methods

### `connect(sender, receiver)`

Connects a logic sender to a logic receiver. The signal transmitted by this wire must match the sender's and receiver's type.

- `sender` [`<Prefab>`](https://github.com/mdingena/att-string-transcoder/blob/main/docs/Prefab.md) The prefab that will send the signal to the receiver.
- `receiver` [`<Prefab>`](https://github.com/mdingena/att-string-transcoder/blob/main/docs/Prefab.md) The prefab that will receive the signal from the sender.
- Returns: `<void>`

```ts
import { Circuit } from 'att-circuits';
import { Prefab } from 'att-string-transcoder';

// `MRK_Small_Lever` has a `LogicBoolSender` component, letting it send boolean signals.
const sender = Prefab.fromSaveString<'MRK_Small_Lever'>('...');

// `MRK_gate_02` has a `LogicBoolReceiver` component, letting it receive boolean signals.
const receiver = Prefab.fromSaveString<'MRK_gate_02'>('...');

const circuit = new Circuit();
const wire = circuit.createWire('boolean');

wire.connect(sender, receiver);
```
