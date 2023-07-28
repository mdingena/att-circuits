import type { LogicReceiverName } from './types/LogicReceiverName.js';
import type { LogicSenderName } from './types/LogicSenderName.js';
import type { WireType } from './types/WireType.js';

import { ATTPrefabs } from 'att-string-transcoder';

export const LOGIC_GATE_RECEIVER_NAME =
  ATTPrefabs.Logic_Operator.embedded.Logic_Operator_13344.savables.LogicGateReceiver.name;

export const RECEIVERS = new Map<LogicSenderName, LogicReceiverName>([
  ['LogicBoolSender', 'LogicBoolReceiver'],
  ['LogicFloatSender', 'LogicFloatReceiver'],
  ['LogicIntSender', 'LogicIntReceiver'],
  ['LogicVector3Sender', 'LogicVector3Receiver']
]);

export const WIRES = new Map<WireType, LogicSenderName>([
  ['boolean', 'LogicBoolSender'],
  ['float', 'LogicFloatSender'],
  ['integer', 'LogicIntSender'],
  ['vector3', 'LogicVector3Sender']
]);
