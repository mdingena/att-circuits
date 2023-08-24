# Class: `Circuit`

- [Constructors](#constructors)
  - [`new Circuit(props?)`](#new-circuitprops)
- [Properties](#properties)
  - [`context`](#context)
  - [`prefabs`](#prefabs)
- [Methods](#methods)
  - [`createWire(type)`](#createwiretype)
  - [`getIdentifier()`](#getidentifier)
  - [`setOrigin(prefab)`](#setoriginprefab)
  - [`toPrefab()`](#toprefab)

## Constructors

### `new Circuit(props?)`

Creates a circuit that can connect interactive prefabs with one another. You may optionally pass a `PrefabProps` object to this constructor that will be applied to this circuit's internal `'Logic_Context'` prefab.

- `props` (optional) `<PrefabProps>` (see [`att-string-transcoder` API documentation](https://github.com/mdingena/att-string-transcoder/blob/main/docs/Prefab.md#prefabprops))
- Returns: `<Circuit>`

```ts
import { Circuit } from 'att-circuits';
import { Prefab } from 'att-string-transcoder';

const lever = Prefab.fromSaveString<'MRK_Small_Lever'>('...');
const door = Prefab.fromSaveString<'MRK_gate_02'>('...');
const circuit = new Circuit();

circuit.createWire('boolean').connect(lever, door);
```

## Properties

### `context`

The internal Logic_Context prefab that will act as the circuit parent prefab.

- `<Prefab>` (see [`att-string-transcoder` API documentation](https://github.com/mdingena/att-string-transcoder/blob/main/docs/Prefab.md))

```ts
import { Circuit } from 'att-circuits';

const circuit = new Circuit();
const logicContext = circuit.context;
```

---

### `prefabs`

A unique set of child prefabs that are part of this circuit.

- `<Set<Prefab>>` (see [`att-string-transcoder` API documentation](https://github.com/mdingena/att-string-transcoder/blob/main/docs/Prefab.md))

```ts
import { Circuit } from 'att-circuits';
import { Prefab } from 'att-string-transcoder';

const lever = new Prefab('MRK_Small_Lever');
const door = new Prefab('MRK_gate_02');

circuit.createWire('boolean').connect(lever, door);

const children = circuit.prefabs;
```

## Methods

### `createWire(type)`

Creates a wire of a given type that lets you send signals of that type between prefabs.

- `type` [`<WireType>`](../src/types/WireType.ts) The type of signals this wire will transmit.
- Returns: [`<Wire>`](./Wire.md)

```ts
import { Circuit } from 'att-circuits';
import { Prefab } from 'att-string-transcoder';

const lever = new Prefab('MRK_Small_Lever');
const door = new Prefab('MRK_gate_02');

const circuit = new Circuit();
const wire = circuit.createWire('boolean');

wire.connect(lever, door);
```

---

### `getIdentifier()`

Returns a unique numerical identifier that is assigned to a logic sender.

- Returns: `<number>`

---

### `setOrigin(prefab)`

Sets the world position of this circuit's `LogicContext` to the given prefab's position.

- `prefab` `<Prefab>` (see [`att-string-transcoder` API documentation](https://github.com/mdingena/att-string-transcoder/blob/main/docs/Prefab.md)) The prefab whose position will be used as relative origin for all child prefabs.
- Returns: `<void>`

```ts
import { Circuit } from 'att-circuits';
import { Prefab } from 'att-string-transcoder';

const door = Prefab.fromSaveString<'MRK_gate_02'>('...');
const circuit = new Circuit();

circuit.setOrigin(door);
```

---

### `toPrefab()`

Permanently applies this circuit's configuration to the internal `LogicContext` and returns it. You can no longer make any changes to its configuration. Use this method to produce a save string for spawning the circuit in-game.

- Returns: `<Prefab>` (see [`att-string-transcoder` API documentation](https://github.com/mdingena/att-string-transcoder/blob/main/docs/Prefab.md))

```ts
import { Circuit } from 'att-circuits';
import { Prefab } from 'att-string-transcoder';

const lever = Prefab.fromSaveString<'MRK_Small_Lever'>('...');
const door = Prefab.fromSaveString<'MRK_gate_02'>('...');
const circuit = new Circuit();

circuit.createWire('boolean').connect(lever, door);
circuit.setOrigin(door);

const prefab = circuit.toPrefab();
const saveString = prefab.toSaveString();
```
