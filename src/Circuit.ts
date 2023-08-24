import type { WireType } from './types/WireType.js';

import { Prefab, type PrefabProps } from 'att-string-transcoder';

import { Wire } from './Wire.js';

/**
 * Represents a connected circuit of logic senders and receivers.
 */
export class Circuit {
  context: Prefab<'Logic_Context'>;
  private isApplied: boolean;
  private nextLogicIdentifier: number;
  prefabs: Set<Prefab>;

  /**
   * Creates a circuit that can connect interactive prefabs with one another. You may optionally
   * pass a `PrefabProps` object to this constructor that will be applied to this circuit's
   * internal `'Logic_Context'` prefab.
   *
   * @example
   * import { Circuit } from 'att-circuits';
   * import { Prefab } from 'att-string-transcoder';
   *
   * const lever = Prefab.fromSaveString<'MRK_Small_Lever'>('...');
   * const door = Prefab.fromSaveString<'MRK_gate_02'>('...');
   * const circuit = new Circuit();
   *
   * circuit.createWire('boolean').connect(lever, door);
   */
  constructor(props?: PrefabProps<'Logic_Context'>) {
    this.context = new Prefab('Logic_Context', props);
    this.isApplied = false;
    this.nextLogicIdentifier = 1;
    this.prefabs = new Set();
  }

  /**
   * Creates a wire of a given type that lets you send signals of that type between prefabs.
   *
   * @example
   * import { Circuit } from 'att-circuits';
   * import { Prefab } from 'att-string-transcoder';
   *
   * const lever = new Prefab('MRK_Small_Lever');
   * const door = new Prefab('MRK_gate_02');
   *
   * const circuit = new Circuit();
   * const wire = circuit.createWire('boolean');
   *
   * wire.connect(lever, door);
   */
  createWire<TWire extends WireType>(type: TWire): Wire<TWire> {
    if (this.isApplied) {
      throw new Error('This Circuit has already been converted to a Prefab.');
    }

    return new Wire(type, this);
  }

  /**
   * Returns a unique numerical identifier that is assigned to a logic sender.
   */
  getIdentifier(): number {
    if (this.isApplied) {
      throw new Error('This Circuit has already been converted to a Prefab.');
    }

    return this.nextLogicIdentifier++;
  }

  /**
   * Sets the world position of this circuit's `LogicContext` to the given prefab's position.
   *
   * @example
   * import { Circuit } from 'att-circuits';
   * import { Prefab } from 'att-string-transcoder';
   *
   * const door = Prefab.fromSaveString<'MRK_gate_02'>('...');
   * const circuit = new Circuit();
   *
   * circuit.setOrigin(door);
   */
  setOrigin(prefab: Prefab): Circuit {
    if (this.isApplied) {
      throw new Error('This Circuit has already been converted to a Prefab.');
    }

    const position = prefab.getPosition();

    this.context.setPosition(position);

    return this;
  }

  /**
   * Permanently applies this circuit's configuration to the internal `LogicContext` and returns it.
   * You can no longer make any changes to its configuration. Use this method to produce a save
   * string for spawning the circuit in-game.
   *
   * @example
   * import { Circuit } from 'att-circuits';
   * import { Prefab } from 'att-string-transcoder';
   *
   * const lever = Prefab.fromSaveString<'MRK_Small_Lever'>('...');
   * const door = Prefab.fromSaveString<'MRK_gate_02'>('...');
   * const circuit = new Circuit();
   *
   * circuit.createWire('boolean').connect(lever, door);
   * circuit.setOrigin(door);
   *
   * const prefab = circuit.toPrefab();
   * const saveString = prefab.toSaveString();
   */
  toPrefab(): Prefab<'Logic_Context'> {
    if (this.isApplied) {
      throw new Error('You can only convert a Circuit to a Prefab once. This Circuit has already been converted.');
    }

    const origin = this.context.getPosition();

    if (origin.x === 0 && origin.y === 0 && origin.z === 0) {
      throw new Error(
        'You need to set the Circuit origin first to preserve the relative positioning of prefabs. Call Circuit.setOrigin(prefab) where `prefab` acts as the origin position for this Circuit.'
      );
    }

    for (const prefab of this.prefabs) {
      const position = prefab.getPosition();

      prefab.setPosition({
        x: position.x - origin.x,
        y: position.y - origin.y,
        z: position.z - origin.z
      });

      this.context.addChildPrefab(null, prefab.clone({ ignoreIndeterminateComponentVersions: true }));
    }

    this.prefabs.clear();
    this.isApplied = true;

    return this.context;
  }
}
