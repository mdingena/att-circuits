<h1 align="center">ATT Circuits</h1>

<p align="center">
  <img alt="build status" src="https://img.shields.io/github/actions/workflow/status/mdingena/att-circuits/lint-compile-test.yml?style=for-the-badge" />
  <img alt="npm version" src="https://img.shields.io/npm/v/att-circuits?style=for-the-badge" />
  <img alt="peer dependency" src="https://img.shields.io/npm/dependency-version/att-circuits/peer/att-string-transcoder?style=for-the-badge" />
  <img alt="node version" src="https://img.shields.io/node/v/att-circuits?style=for-the-badge" />
  <img alt="typescript version" src="https://img.shields.io/npm/dependency-version/att-circuits/dev/typescript?style=for-the-badge" />
  <img alt="license" src="https://img.shields.io/npm/l/att-circuits?style=for-the-badge" />
  <a href="CODE-OF-CONDUCT.md"><img alt="contributor covenant v2.0 adopted" src="https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=for-the-badge" /></a>
</p>

---

Allows you to create logic gate circuits in _A Township Tale_, letting you create custom puzzles and logic contraptions.

⚠️ This library has a **peer dependency** on [`att-string-transcoder`](https://github.com/mdingena/att-string-transcoder). You must manually install this peer dependency in your project in order to use `att-circuits`.

⚠️ This library is meant for advanced users who already have a good understanding of ATT save strings. **Check out our [ATT String Workshop](https://github.com/mdingena/att-string-workshop) project to learn the basics.**

## :sparkles: Quickstart

### Installation

Add this library to your project's dependencies:

```shell
npm install --save att-circuits
```

### Usage

```ts
import { Circuit } from 'att-circuits';
import { Prefab } from 'att-string-transcoder';

const lever = Prefab.fromSaveString<'MRK_Small_Lever'>('...');
const door = Prefab.fromSaveString<'MRK_gate_02'>('...');
const circuit = new Circuit();

circuit.createWire('boolean').connect(lever, door);
circuit.setOrigin(door);

const prefab = circuit.toPrefab();
prefab.print();
```

Read the [API Reference Documentation](docs/README.md) for more options.

## :bow: Attribution

This project would not be possible without the knowledge revealed and shared by [poi](https://github.com/officialpoiuytrewq4645). :blue_heart:
