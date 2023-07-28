import type { WireType } from './types/WireType.js';

import { Prefab, type PrefabProps } from 'att-string-transcoder';

import { Wire } from './Wire.js';

export class Circuit {
  context: Prefab<'Logic_Context'>;
  private isApplied: boolean;
  private nextLogicIdentifier: number;
  prefabs: Set<Prefab>;

  constructor(props?: PrefabProps<'Logic_Context'>) {
    this.context = new Prefab('Logic_Context', props);
    this.isApplied = false;
    this.nextLogicIdentifier = 1;
    this.prefabs = new Set();
  }

  apply(): Prefab<'Logic_Context'> {
    if (this.isApplied) {
      throw new Error('You can only apply a Circuit once. This Circuit has already been applied to all its prefabs.');
    }

    const origin = this.context.getPosition();

    if (origin.x === 0 && origin.y === 0 && origin.z === 0) {
      throw new Error(
        'You need to set the Circuit origin first to preserve relative positioning of prefabs. Call Circuit.setOrigin(prefab) where `prefab` acts as the origin position for this Circuit.'
      );
    }

    for (const prefab of this.prefabs) {
      const position = prefab.getPosition();

      prefab.setPosition({
        x: position.x - origin.x,
        y: position.y - origin.y,
        z: position.z - origin.z
      });

      this.context.addChildPrefab(null, prefab);
    }

    this.prefabs.clear();
    this.isApplied = true;

    return this.context;
  }

  createWire<TWire extends WireType>(type: TWire): Wire<TWire> {
    return new Wire(type, this);
  }

  getIdentifier(): number {
    return this.nextLogicIdentifier++;
  }

  setOrigin(prefab: Prefab): Circuit {
    const position = prefab.getPosition();

    this.context.setPosition(position);

    return this;
  }
}
