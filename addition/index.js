const architect = require('neataptic').architect


/**
 * We want to normalize the input data:
 * https://wagenaartje.github.io/neataptic/docs/tutorials/normalization/
 *
 * @param integer
 * @returns {number}
 */
function normalize(integer) {
  return integer / 10
}

const trainingSet = []

for (let i = 0; i < 1000; i++) {
  let integer1 = Math.floor(Math.random() * 10) // integer1 is one of {0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
  let integer2 = Math.round(Math.random() * (10 - integer1)) // integer2 is 10 - integer1 this is because we cannot expect output to be greater than 10 (1)

  let output = (integer1 + integer2) / 10 // output is (0, 1)

  trainingSet.push({ input: [normalize(integer1), normalize(integer2)], output: [output] })
}

myNetwork = architect.Perceptron(2, 3, 1)

myNetwork.train(trainingSet, {
  log: 0,
  error: 0.0001,
  iterations: 1000,
  rate: 0.3,
  momentum: 0.9,
})

/**
 * Add integer1 to integer2 and console.log the result.
 *
 * @param integer1
 * @param integer2
 */
function count(integer1, integer2) {
  const result = Math.round(myNetwork.activate([integer1 / 10, integer2 / 10]) * 10)
  console.log(`${integer1} + ${integer2} = ${result}`)
}

for (let i = 0; i < 10; i++) {
  let integer1 = Math.floor(Math.random() * 10)
  let integer2 = Math.round(Math.random() * (10 - integer1))
  count(integer1, integer2)
}
