import { Prefab } from 'att-string-transcoder';
import { vi } from 'vitest';

import { Circuit } from './Circuit.js';
import { Wire } from './Wire.js';

describe('new Wire()', () => {
  it('returns an instance of the Wire class', () => {
    const circuit = new Circuit();
    const wire = new Wire('boolean', circuit);

    expect(wire).toBeInstanceOf(Wire);
  });

  describe('when given an invalid wire type argument', () => {
    it('throws an error', () => {
      const circuit = new Circuit();

      // @ts-expect-error Invalid WireType.
      const expectedToThrow = () => new Wire('invalid', circuit);
      const expectedError = new Error('Unrecognised wire type "invalid".');

      expect(expectedToThrow).toThrowError(expectedError);
    });
  });

  describe('when given wire type argument has no matching logic receiver', () => {
    beforeEach(() => {
      vi.resetModules();
      vi.doMock('./constants.js', async () => {
        const actual = await vi.importActual<object>('./constants.js');

        return {
          ...actual,
          RECEIVERS: new Map([])
        };
      });
    });

    afterEach(() => {
      vi.doUnmock('./constants.js');
      vi.resetModules();
    });

    it('throws an error', async () => {
      const circuit = new Circuit();
      const { Wire: WireWithMockedConstants } = await import('./Wire.js');

      const expectedToThrow = () => new WireWithMockedConstants('boolean', circuit);
      const expectedError = new Error('Cannot find matching LogicReceiver for "LogicBoolSender".');

      expect(expectedToThrow).toThrowError(expectedError);
    });
  });
});

describe('Wire.connect()', () => {
  it('connects logic senders to logic receivers', () => {
    const circuit = new Circuit();
    const booleanWire = new Wire('boolean', circuit);
    const floatWire = new Wire('float', circuit);
    const intWire = new Wire('integer', circuit);
    const vector3Wire = new Wire('vector3', circuit);

    const booleanSender = new Prefab('MRK_Small_Lever');
    const booleanReceiver = new Prefab('MRK_gate_02');
    const floatSender = new Prefab('MRK_Wheel_Bridge');
    const floatReceiver = new Prefab('MRK_Wheel_Bridge');
    const intSender = new Prefab('Area_of_Influence_Sender_puzzle');
    const intReceiver = new Prefab('Logic_Int_To_Bool');
    const vector3Sender = new Prefab('Teleporter_Puzzle');
    const vector3Receiver = new Prefab('Teleporter_Puzzle');
    const gateReceiver = new Prefab('Logic_Operator');

    booleanWire.connect(booleanSender, booleanReceiver);
    floatWire.connect(floatSender, floatReceiver);
    intWire.connect(intSender, intReceiver);
    vector3Wire.connect(vector3Sender, vector3Receiver);
    booleanWire.connect(booleanSender, gateReceiver);

    expect(circuit.prefabs).toStrictEqual(
      new Set([
        booleanSender,
        booleanReceiver,
        floatSender,
        floatReceiver,
        intSender,
        intReceiver,
        vector3Sender,
        vector3Receiver,
        gateReceiver
      ])
    );

    expect(booleanSender.components.LogicBoolSender?.identifier).toStrictEqual(1);
    expect(floatSender.components.LogicFloatSender?.identifier).toStrictEqual(2);
    expect(intSender.components.LogicIntSender?.identifier).toStrictEqual(3);
    expect(vector3Sender.components.LogicVector3Sender?.identifier).toStrictEqual(4);
    expect(booleanReceiver.components.LogicBoolReceiver?.sender).toStrictEqual(1);
    expect(floatReceiver.components.LogicFloatReceiver?.sender).toStrictEqual(2);
    expect(intReceiver.components.LogicIntReceiver?.sender).toStrictEqual(3);
    expect(vector3Receiver.components.LogicVector3Receiver?.sender).toStrictEqual(4);
    expect(gateReceiver.components.LogicGateReceiver?.senders).toStrictEqual([1]);
  });

  describe('when a non-gate receiver has already been connected before', () => {
    it('displays a warning', () => {
      const spy = vi.spyOn(process.stdout, 'write');
      spy.mockImplementationOnce(() => true);

      const circuit = new Circuit();
      const wire = new Wire('boolean', circuit);

      const sender = new Prefab('MRK_Small_Lever');
      const receiver = new Prefab('MRK_gate_02');

      wire.connect(sender, receiver);
      wire.connect(sender, receiver);

      expect(spy).toHaveBeenCalledWith(
        `Warning: The LogicBoolReceiver on MRK_gate_02 was already wired up to something else.\n`
      );
    });
  });

  describe('when a gate receiver has already been connected to that sender before', () => {
    it('displays a warning', () => {
      const spy = vi.spyOn(process.stdout, 'write');
      spy.mockImplementationOnce(() => true);

      const circuit = new Circuit();
      const wire = new Wire('boolean', circuit);

      const sender = new Prefab('MRK_Small_Lever');
      const receiver = new Prefab('Logic_Operator');

      wire.connect(sender, receiver);
      wire.connect(sender, receiver);

      expect(spy).toHaveBeenCalledWith(
        `Warning: The LogicGateReceiver on Logic_Operator is already wired up to this sender.\n`
      );
    });
  });

  describe('when the given sender prefab cannot have logic senders', () => {
    it('throws an error', () => {
      const circuit = new Circuit();
      const wire = new Wire('boolean', circuit);

      const sender = new Prefab('Anvil');
      const receiver = new Prefab('MRK_gate_02');

      const expectedToThrow = () => wire.connect(sender, receiver);
      const expectedError = new Error('Anvil cannot send boolean signals. Did you create the correct Wire type?');

      expect(expectedToThrow).toThrowError(expectedError);
    });
  });

  describe('when the given receiver prefab cannot have logic receivers', () => {
    it('throws an error', () => {
      const circuit = new Circuit();
      const wire = new Wire('boolean', circuit);

      const sender = new Prefab('MRK_Small_Lever');
      const receiver = new Prefab('Anvil');

      const expectedToThrow = () => wire.connect(sender, receiver);
      const expectedError = new Error('Anvil cannot receive boolean signals. Did you create the correct Wire type?');

      expect(expectedToThrow).toThrowError(expectedError);
    });
  });
});
