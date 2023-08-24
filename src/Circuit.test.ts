import { Prefab } from 'att-string-transcoder';

import { Circuit } from './Circuit.js';
import { Wire } from './Wire.js';

describe('new Circuit()', () => {
  describe('when given only required arguments', () => {
    it('returns an instance of the Circuit class', () => {
      const circuit = new Circuit();

      expect(circuit).toBeInstanceOf(Circuit);
      expect(circuit.context).toBeInstanceOf(Prefab);
      expect(circuit.context.position).toStrictEqual({ x: 0, y: 0, z: 0 });
      expect(circuit.prefabs.size).toStrictEqual(0);
    });
  });

  describe('when given additional arguments', () => {
    it('returns an instance of the Circuit class', () => {
      const circuit = new Circuit({ position: { x: 69, y: 420, z: 1337 } });

      expect(circuit).toBeInstanceOf(Circuit);
      expect(circuit.context).toBeInstanceOf(Prefab);
      expect(circuit.context.position).toStrictEqual({ x: 69, y: 420, z: 1337 });
      expect(circuit.prefabs.size).toStrictEqual(0);
    });
  });
});

describe('Circuit.createWire()', () => {
  it('returns an instance of the Wire class', () => {
    const circuit = new Circuit();
    const wire = circuit.createWire('boolean');

    expect(wire).toBeInstanceOf(Wire);
  });

  describe('when the circuit has already been applied', () => {
    it('throws an error', () => {
      const circuit = new Circuit();
      circuit.setOrigin(new Prefab('Anvil').setPosition({ x: 69, y: 420, z: 1337 }));
      circuit.toPrefab();

      const expectedToThrow = () => circuit.createWire('boolean');
      const expectedError = new Error('This Circuit has already been converted to a Prefab.');

      expect(expectedToThrow).toThrowError(expectedError);
    });
  });
});

describe('Circuit.getIdentifier()', () => {
  it('returns a unique numerical identifier every time it is called', () => {
    const circuit = new Circuit();
    const first = circuit.getIdentifier();
    const second = circuit.getIdentifier();
    const third = circuit.getIdentifier();
    const fourth = circuit.getIdentifier();

    expect(first).toStrictEqual(1);
    expect(second).toStrictEqual(2);
    expect(third).toStrictEqual(3);
    expect(fourth).toStrictEqual(4);
  });

  describe('when the circuit has already been applied', () => {
    it('throws an error', () => {
      const circuit = new Circuit();
      circuit.setOrigin(new Prefab('Anvil').setPosition({ x: 69, y: 420, z: 1337 }));
      circuit.toPrefab();

      const expectedToThrow = () => circuit.getIdentifier();
      const expectedError = new Error('This Circuit has already been converted to a Prefab.');

      expect(expectedToThrow).toThrowError(expectedError);
    });
  });
});

describe('Circuit.setOrigin()', () => {
  it('sets the position of the passed prefab on the context of this circuit', () => {
    const prefab = new Prefab('Anvil').setPosition({ x: 69, y: 420, z: 1337 });
    const circuit = new Circuit();
    circuit.setOrigin(prefab);

    expect(circuit.context.position).toStrictEqual(prefab.position);
  });

  describe('when the circuit has already been applied', () => {
    it('throws an error', () => {
      const prefab = new Prefab('Anvil').setPosition({ x: 69, y: 420, z: 1337 });
      const circuit = new Circuit();
      circuit.setOrigin(prefab);
      circuit.toPrefab();

      const expectedToThrow = () => circuit.setOrigin(prefab);
      const expectedError = new Error('This Circuit has already been converted to a Prefab.');

      expect(expectedToThrow).toThrowError(expectedError);
    });
  });
});

describe('Circuit.toPrefab()', () => {
  it('applies the configuration to the internal context and returns it', () => {
    const lever = new Prefab('MRK_Small_Lever');
    const door = new Prefab('MRK_gate_02').setPosition({ x: 69, y: 420, z: 1337 });
    const circuit = new Circuit();

    circuit.createWire('boolean').connect(lever, door);
    circuit.setOrigin(door);

    const prefab = circuit.toPrefab();

    expect(prefab.name).toStrictEqual('Logic_Context');
    expect(prefab.position).toStrictEqual(circuit.context.position);
    expect(prefab.children).toStrictEqual([
      {
        parentHash: 0,
        prefab: lever
      },
      {
        parentHash: 0,
        prefab: door
      }
    ]);
  });

  describe('when the origin has not been set', () => {
    it('throws an error', () => {
      const circuit = new Circuit();

      const expectedToThrow = () => circuit.toPrefab();
      const expectedError = new Error(
        'You need to set the Circuit origin first to preserve the relative positioning of prefabs. Call Circuit.setOrigin(prefab) where `prefab` acts as the origin position for this Circuit.'
      );

      expect(expectedToThrow).toThrowError(expectedError);
    });
  });

  describe('when the circuit has already been applied', () => {
    it('throws an error', () => {
      const prefab = new Prefab('Anvil').setPosition({ x: 69, y: 420, z: 1337 });
      const circuit = new Circuit();
      circuit.setOrigin(prefab);
      circuit.toPrefab();

      const expectedToThrow = () => circuit.toPrefab();
      const expectedError = new Error(
        'You can only convert a Circuit to a Prefab once. This Circuit has already been converted.'
      );

      expect(expectedToThrow).toThrowError(expectedError);
    });
  });
});
