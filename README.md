# Neural Network Playground

#### Addition

Simple [neataptic.js](https://github.com/wagenaartje/neataptic) script that knows how to add up to ten.

More information can be found here: https://wagenaartje.github.io/neataptic/docs/tutorials/training/

```
$ node addition
```

#### NEAT XOR

Advanced example of neural evolution genetic algorithm that learns how to solve basic XOR inputs.

Simple [neataptic.js](https://github.com/wagenaartje/neataptic) solution would look like this:

```
// this network learns the XOR gate (through neuro-evolution)
var network = new Network(2,1);

var trainingSet = [
  { input: [0,0], output: [0] },
  { input: [0,1], output: [1] },
  { input: [1,0], output: [1] },
  { input: [1,1], output: [0] }
];

await network.evolve(trainingSet, {
  equal: true,
  error: 0.03
 });
```

More complicated solution implemented in `neatXOR/genetic.js` lets us take advantage of dynamic neural network programming.

In order to run the example paste following command into console

```
$ node neatXOR
```
