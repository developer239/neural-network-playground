const genetic = require('./genetic')


genetic.generateRandomPopulation()

for (let iteration = 0; iteration < 1000; iteration += 1) {
  genetic.live()
  genetic.evolve()
}

const genom = genetic.neat.population[0]

console.log(`
  Result for genom with index 0 in the newest population. Note that selection / mutation happened
  after we called last evolve function so this is not necessarily the best genome in the population.
  
  [0, 0] = ${genom.activate([0, 0])} (should be 0) 
  [1, 1] = ${genom.activate([1, 1])} (should be 0) 
  [0, 1] = ${genom.activate([0, 1])} (should be 1) 
  [1, 0] = ${genom.activate([1, 0])} (should be 1) 
`)
