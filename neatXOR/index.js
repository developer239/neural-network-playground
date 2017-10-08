const GeneticAlgorithm = require('./neat')


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const possibleXorInputs = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
]

const numberOfIterations = 100
const populationSize = 10
const topUnits = 2

const GA = new GeneticAlgorithm(populationSize, topUnits)
GA.reset()
GA.createPopulation()

for (let z = 0; z < numberOfIterations; z += 1) {
  for (let index = 0; index < populationSize; index += 1) {
    GA.activateBrain(index, possibleXorInputs[getRandomInt(0, 3)])
  }
  GA.evolvePopulation()
  GA.iteration += 1
}

console.log('exit')
