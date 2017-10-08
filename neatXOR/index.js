const GeneticAlgorithm = require('./neat')


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

var possibleXorInputs = [
  [0, 0],
  [0, 1],
  [1, 0],
  [1, 1],
]

let populationSize = 10
// console.log('initializing genetic algorithm with populationSize ', populationSize)
let GA = new GeneticAlgorithm(populationSize, 2)
GA.reset()
GA.createPopulation()

for (let i = 0; i < 10; i += 1) {
  // console.log('starting iteration over population generation ', GA.iteration)
  for (let i = 0; i < populationSize; i += 1) {
    let genome = GA.Population[i]
    GA.activateBrain(genome, possibleXorInputs[getRandomInt(0, 3)], i)
  }

  console.log('evolving population')

  GA.evolvePopulation()
  GA.iteration++
}
console.log('ende')
