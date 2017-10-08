const { Neat, architect } = require('neataptic')


module.exports = {
  neat: null, // https://wagenaartje.github.io/neataptic/docs/neat/
  possibleInputs: [
    [0, 0], // expected output 0
    [1, 1], // expected output 0
    [0, 1], // expected output 1
    [1, 0], // expected output 1
  ],
  generateRandomPopulation: function () {
    this.neat = new Neat(
      2, // number of inputs
      1, // number of outputs
      null, // fitnessFunction - in this example we are calculating fitness inside startEvaluation method
      {
        elitism: 5, // this value is quite important 0.4 should be a sweet spot https://www.researchgate.net/post/What_is_meant_by_the_term_Elitism_in_the_Genetic_Algorithm
        mutationRate: 0.3, // Sets the mutation rate. If set to 0.3, 30% of the new population will be mutated. Default is 0.3
        network: // https://wagenaartje.github.io/neataptic/docs/architecture/network/
          new architect.Random(
            2,
            3,
            1,
          ),
      },
    )
  },
  // the closer the output gets to expectedOutput the better
  // note that optimal fitness in this example is 0 neural network seems to work fine though
  calculateFitness: function (expectedOutput, output) {
    let closeCount = Math.abs(expectedOutput - output)
    let fitness = closeCount * -1
    return fitness
  },
  live: function () {
    // loop through each genome
    for (let genomeIndex in this.neat.population) {
      const possibleInputs = this.possibleInputs
      const genome = this.neat.population[genomeIndex]
      genome.score = 0

      // loop through each input
      for (let i = 0; i < possibleInputs.length; i += 1) {
        let input = possibleInputs[i]
        // test each input
        let output = genome.activate(input)[0]

        // calculate fitness for each output
        // we have 4 different inputs so the total score is sum of 4 different fitness values
        if (i <= 1) {
          genome.score += this.calculateFitness(0, output)
        } else {
          genome.score += this.calculateFitness(1, output)
        }
      }
    }
  },
  evolve: function () {
    const neat = this.neat
    console.log(`[generation ${neat.generation}] Average score: ${neat.getAverage()} (the closer to zero the better)`)

    // sort by genome.score in descending order
    neat.sort()

    // our new population will be here
    let newPopulation = []

    // we want to push neat.elitism% best into the new population automatically
    for (let i = 0; i < neat.elitism; i++) {
      newPopulation.push(neat.population[i])
    }

    // we want to get offspring from the current population and push it into the new population
    for (let i = 0; i < neat.popsize - neat.elitism; i++) {
      newPopulation.push(neat.getOffspring())
    }

    // set new population
    neat.population = newPopulation
    // mutate the population
    neat.mutate()

    // update generation index
    this.neat.generation += 1

    // run another evaluation
    this.live()
  },
}
