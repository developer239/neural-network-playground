const synaptic = require('synaptic')


const GeneticAlgorithm = function (max_units, top_units) {
  this.max_units = max_units
  this.top_units = top_units

  if (this.max_units < this.top_units) this.top_units = this.max_units

  this.population = []
}

GeneticAlgorithm.prototype = {

  reset: function () {
    this.iteration = 1
    this.mutateRate = 1

    this.best_population = 0
    this.best_fitness = 0
    this.best_score = 0
  },


  createPopulation: function () {
    this.population.splice(0, this.population.length)

    for (let i = 0; i < this.max_units; i++) {
      let newUnit = new synaptic.Architect.Perceptron(2, 3, 1)

      newUnit.index = i
      newUnit.fitness = 0
      newUnit.score = 0
      newUnit.isWinner = false

      this.population.push(newUnit)
    }
  },

  calculateFitness: function (input, output) {
    let fitness = 0

    let stringifiedInput = input.join('')

    if (stringifiedInput === '00' || stringifiedInput === '11') {
      fitness = (output - 1) * -1
    }

    if (stringifiedInput === '01' || stringifiedInput === '10') {
      fitness = output
    }

    return fitness
  },

  activateBrain: function (index, inputs) {
    let ouput = this.population[index].activate(inputs)

    this.population[index].fitness = this.calculateFitness(inputs, ouput[0])

    return ouput
  },


  selection: function () {
    let sortedPopulation = this.population.sort(
      function (unitA, unitB) {
        return unitB.fitness - unitA.fitness
      }
    )

    for (let i = 0; i < this.top_units; i++) this.population[i].isWinner = true;

    return sortedPopulation.slice(0, this.top_units)
  },

  crossOver: function (parentA, parentB) {
    let cutPoint = this.random(0, parentA.neurons.length - 1)

    for (let i = cutPoint; i < parentA.neurons.length; i++) {
      let biasFromParentA = parentA.neurons[i]['bias']
      parentA.neurons[i]['bias'] = parentB.neurons[i]['bias']
      parentB.neurons[i]['bias'] = biasFromParentA
    }

    return this.random(0, 1) == 1 ? parentA : parentB
  },

  mutation: function (offspring) {

    for (let i = 0; i < offspring.neurons.length; i++) {
      offspring.neurons[i]['bias'] = this.mutate(offspring.neurons[i]['bias'])
    }

    for (let i = 0; i < offspring.connections.length; i++) {
      offspring.connections[i]['weight'] = this.mutate(offspring.connections[i]['weight'])
    }

    return offspring
  },

  mutate: function (gene) {
    if (Math.random() < this.mutateRate) {
      let mutateFactor = 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5))
      gene *= mutateFactor
    }

    return gene
  },

  random: function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  },

  getRandomUnit: function (array) {
    return array[this.random(0, array.length - 1)]
  },

  evolvePopulation: function () {
    let fitnessSum = 0
    this.population.forEach(genom => {
      fitnessSum += genom.fitness
    })
    let avgFitness = fitnessSum / this.population.length
    console.log('AVERAGE POPULATION FITNESS IS: ', avgFitness)

    let Winners = this.selection()

    if (avgFitness < 0.5) {
      console.log('RESETING POPULATION')
      this.createPopulation()
    } else {
      this.mutateRate = 0.2
    }

    for (let i = this.top_units; i < this.max_units; i++) {
      let parentA, parentB, offspring

      if (i == this.top_units) {
        parentA = Winners[0].toJSON()
        parentB = Winners[1].toJSON()
        offspring = this.crossOver(parentA, parentB)

      } else if (i < this.max_units - 2) {
        parentA = this.getRandomUnit(Winners).toJSON()
        parentB = this.getRandomUnit(Winners).toJSON()
        offspring = this.crossOver(parentA, parentB)

      } else {
        offspring = this.getRandomUnit(Winners).toJSON()
      }

      offspring = this.mutation(offspring)

      let newUnit = synaptic.Network.fromJSON(offspring)
      newUnit.index = this.population[i].index
      newUnit.fitness = 0
      newUnit.score = 0
      newUnit.isWinner = false

      this.population[i] = newUnit
    }

    if (Winners[0].fitness > this.best_fitness) {
      this.best_population = this.iteration
      this.best_fitness = Winners[0].fitness
      this.best_score = Winners[0].score
    }

    this.population.sort(function (unitA, unitB) {
      return unitA.index - unitB.index
    })
  },
}

module.exports = GeneticAlgorithm
