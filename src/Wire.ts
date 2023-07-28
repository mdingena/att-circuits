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

export class Wire<TWire extends WireType> {
  private readonly circuit: Circuit;
  private readonly senderName: LogicSenderName;
  private readonly receiverName: LogicReceiverName;
  private readonly type: WireType;

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

  connect(sender: Prefab, receiver: Prefab) {
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
      logicReceiver.senders.push(logicSender.identifier);
    } else {
      logicReceiver.sender = logicSender.identifier;
    }

    this.circuit.prefabs.add(sender);
    this.circuit.prefabs.add(receiver);
  }

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
