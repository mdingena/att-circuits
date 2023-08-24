import type { Circuit } from './Circuit.js';
import type { LogicReceiverName } from './types/LogicReceiverName.js';
import type { LogicSenderName } from './types/LogicSenderName.js';
import type { WireType } from './types/WireType.js';

import {
  isSavableComponent,
  LogicBoolReceiverComponent,
  LogicBoolSenderComponent,
  LogicFloatReceiverComponent,
  LogicFloatSenderComponent,
  LogicGateReceiverComponent,
  LogicIntReceiverComponent,
  LogicIntSenderComponent,
  LogicVector3ReceiverComponent,
  LogicVector3SenderComponent,
  type Prefab,
  type PrefabComponents
} from 'att-string-transcoder';

import * as constants from './constants.js';

/**
 * Represents a conduit that can be connected between two prefabs forming a logical connection of
 * the wire's type.
 */
export class Wire<TWire extends WireType> {
  private readonly circuit: Circuit;
  private readonly senderName: LogicSenderName;
  private readonly receiverName: LogicReceiverName;
  private readonly type: WireType;

  /**
   * Creates a wire instance that can connect two prefabs via their logic sender and receiver that
   * match this wire's type. A wire must belong to a circuit, which must be passed as its second
   * argument.
   *
   * @example
   * import { Circuit, Wire } from 'att-circuits';
   *
   * const circuit = new Circuit();
   * const wire = new Wire('boolean', circuit);
   * // alternatively
   * const wire = circuit.createWire('boolean');
   */
  constructor(type: TWire, circuit: Circuit) {
    const senderName = constants.WIRES.get(type);

    if (typeof senderName === 'undefined') throw new Error(`Unrecognised wire type "${type}".`);

    const receiverName = constants.RECEIVERS.get(senderName);

    if (typeof receiverName === 'undefined') {
      throw new Error(`Cannot find matching LogicReceiver for "${senderName}".`);
    }

    this.circuit = circuit;
    this.senderName = senderName;
    this.receiverName = receiverName;
    this.type = type;
  }

  /**
   * Connects a logic sender to a logic receiver. The signal transmitted by this wire must match
   * the sender's and receiver's type.
   *
   * @example
   * import { Circuit } from 'att-circuits';
   * import { Prefab } from 'att-string-transcoder';
   *
   * // `MRK_Small_Lever` has a `LogicBoolSender` component, letting it send boolean signals.
   * const sender = Prefab.fromSaveString<'MRK_Small_Lever'>('...');
   *
   * // `MRK_gate_02` has a `LogicBoolReceiver` component, letting it receive boolean signals.
   * const receiver = Prefab.fromSaveString<'MRK_gate_02'>('...');
   *
   * const circuit = new Circuit();
   * const wire = circuit.createWire('boolean');
   *
   * wire.connect(sender, receiver);
   */
  connect(sender: Prefab, receiver: Prefab): void {
    const logicSender = this.getLogicSender(sender);
    const logicReceiver = this.getLogicReceiver(receiver);

    const isConfiguredNonGateReceiver =
      !(logicReceiver instanceof LogicGateReceiverComponent) && logicReceiver.sender > 0;

    if (isConfiguredNonGateReceiver) {
      process.stdout.write(
        `Warning: The ${logicReceiver.name} on ${receiver.name} was already wired up to something else.`
      );
    }

    if (logicReceiver instanceof LogicGateReceiverComponent) {
      if (logicReceiver.senders.includes(logicSender.identifier)) {
        process.stdout.write(
          `Warning: The ${logicReceiver.name} on ${receiver.name} is already wired up to this sender.\n`
        );
      } else {
        logicReceiver.senders.push(logicSender.identifier);
      }
    } else {
      logicReceiver.sender = logicSender.identifier;
    }

    this.circuit.prefabs.add(sender);
    this.circuit.prefabs.add(receiver);
  }

  /**
   * Returns the logic receiver matching this wire's type of the given prefab.
   */
  private getLogicReceiver(prefab: Prefab): Exclude<PrefabComponents[LogicReceiverName], undefined> {
    let receiverName = this.receiverName;
    let logicReceiver = prefab.components[receiverName] ?? prefab.components[constants.LOGIC_GATE_RECEIVER_NAME];

    if (typeof logicReceiver === 'undefined') {
      if (!isSavableComponent(receiverName, prefab.name)) {
        receiverName = constants.LOGIC_GATE_RECEIVER_NAME;

        if (!isSavableComponent(receiverName, prefab.name)) {
          throw new Error(`${prefab.name} cannot receive ${this.type} signals. Did you create the correct Wire type?`);
        }
      }

      switch (receiverName) {
        case 'LogicBoolReceiver':
          logicReceiver = new LogicBoolReceiverComponent({ version: 1 });
          break;

        case 'LogicFloatReceiver':
          logicReceiver = new LogicFloatReceiverComponent({ version: 1 });
          break;

        case 'LogicGateReceiver':
          logicReceiver = new LogicGateReceiverComponent({ version: 2 });
          break;

        case 'LogicIntReceiver':
          logicReceiver = new LogicIntReceiverComponent({ version: 1 });
          break;

        case 'LogicVector3Receiver':
          logicReceiver = new LogicVector3ReceiverComponent({ version: 1 });
          break;

        default:
          throw new Error(`Unsupported LogicReceiver "${receiverName}".`);
      }

      prefab.addComponent(logicReceiver);
    }

    return logicReceiver;
  }

  /**
   * Returns the logic sender matching this wire's type of the given prefab.
   */
  private getLogicSender(prefab: Prefab): Exclude<PrefabComponents[LogicSenderName], undefined> {
    let logicSender = prefab.components[this.senderName];

    if (typeof logicSender === 'undefined') {
      if (!isSavableComponent(this.senderName, prefab.name)) {
        throw new Error(`${prefab.name} cannot send ${this.type} signals. Did you create the correct Wire type?`);
      }

      const identifier = this.circuit.getIdentifier();

      switch (this.senderName) {
        case 'LogicBoolSender':
          logicSender = new LogicBoolSenderComponent({ version: 2, identifier });
          break;

        case 'LogicFloatSender':
          logicSender = new LogicFloatSenderComponent({ version: 1, identifier });
          break;

        case 'LogicIntSender':
          logicSender = new LogicIntSenderComponent({ version: 1, identifier });
          break;

        case 'LogicVector3Sender':
          logicSender = new LogicVector3SenderComponent({ version: 1, identifier });
          break;

        default:
          throw new Error(`Unsupported LogicSender "${this.senderName}".`);
      }

      prefab.addComponent(logicSender);
    }

    return logicSender;
  }
}
