const synaptic = require('synaptic')

function roundOff(value,round) {
  return (parseInt(value * (10 ** (round + 1))) - parseInt(value * (10 ** round)) * 10) > 4 ? (((parseFloat(parseInt((value + parseFloat(1 / (10 ** round))) * (10 ** round))))) / (10 ** round)) : (parseFloat(parseInt(value * (10 ** round))) / ( 10 ** round));
}


function calculateFitness (input, output) {
  // console.log('calculating fitness for input ', input, ' and output ', roundOff(output, 5))
  let fitness = 0

  let stringifiedInput = input.join('')

  if (stringifiedInput === '00' || stringifiedInput === '11') {
    fitness = (output - 1) * -1
  }

  if (stringifiedInput === '01' || stringifiedInput === '10') {
    fitness = output
  }

  // console.log('stringifiedInput ', stringifiedInput)
  // console.log('output ', roundOff(output, 5))

  // console.log('fitness is ', roundOff(fitness, 5))

  return fitness
}


var GeneticAlgorithm = function (max_units, top_units) {
  this.max_units = max_units // max number of units in population
  this.top_units = top_units // number of top units (winners) used for evolving population

  if (this.max_units < this.top_units) this.top_units = this.max_units

  this.Population = [] // array of all units in current population
}

GeneticAlgorithm.prototype = {

  // resets genetic algorithm parameters
  reset: function () {
    this.iteration = 1	// current iteration number (it is equal to the current population number)
    this.mutateRate = 1 // initial mutation rate

    this.best_population = 0 // the population number of the best unit
    this.best_fitness = 0  // the fitness of the best unit
    this.best_score = 0	// the score of the best unit ever
  },

  // creates a new population
  createPopulation: function () {
    // clear any existing population
    this.Population.splice(0, this.Population.length)

    for (let i = 0; i < this.max_units; i++) {
      // create a new unit by generating a random Synaptic neural network
      // with 2 neurons in the input layer, 6 neurons in the hidden layer and 1 neuron in the output layer
      let newUnit = new synaptic.Architect.Perceptron(2, 3, 1)

      // set additional parameters for the new unit
      newUnit.index = i
      newUnit.fitness = 0
      newUnit.score = 0
      newUnit.isWinner = false

      // add the new unit to the population
      this.Population.push(newUnit)
    }
  },

  // activates the neural network of an unit from the population
  // to calculate an output action according to the inputs
  activateBrain : function(neuron, inputs, index){
    // console.log('activating brain for neuron index ', index)
    // calculate outputs by activating synaptic neural network of this neuron
    let ouput = this.Population[neuron.index].activate(inputs);
    // console.log('for input ', inputs.join(','), 'output is ', ouput)

    this.Population[neuron.index].fitness = calculateFitness(inputs, ouput[0])

    return ouput
  },

  // selects the best units from the current population
  selection : function(){
    // sort the units of the current population	in descending order by their fitness
    let sortedPopulation = this.Population.sort(
      function(unitA, unitB){
        return unitB.fitness - unitA.fitness;
      }
    );

    // mark the top units as the winners!
    for (let i=0; i<this.top_units; i++) this.Population[i].isWinner = true;

    // return an array of the top units from the current population
    return sortedPopulation.slice(0, this.top_units);
  },

  // performs a single point crossover between two parents
  crossOver : function(parentA, parentB) {
    // get a cross over cutting point
    let cutPoint = this.random(0, parentA.neurons.length-1);

    // swap 'bias' information between both parents:
    // 1. left side to the crossover point is copied from one parent
    // 2. right side after the crossover point is copied from the second parent
    for (let i = cutPoint; i < parentA.neurons.length; i++){
      let biasFromParentA = parentA.neurons[i]['bias'];
      parentA.neurons[i]['bias'] = parentB.neurons[i]['bias'];
      parentB.neurons[i]['bias'] = biasFromParentA;
    }

    // noinspection EqualityComparisonWithCoercionJS
    return this.random(0, 1) == 1 ? parentA : parentB;
  },

  // performs random mutations on the offspring
  mutation : function (offspring){
    // mutate some 'bias' information of the offspring neurons
    for (let i = 0; i < offspring.neurons.length; i++){
      offspring.neurons[i]['bias'] = this.mutate(offspring.neurons[i]['bias']);
    }

    // mutate some 'weights' information of the offspring connections
    for (let i = 0; i < offspring.connections.length; i++){
      offspring.connections[i]['weight'] = this.mutate(offspring.connections[i]['weight']);
    }

    return offspring;
  },

  // mutates a gene
  mutate : function (gene){
    if (Math.random() < this.mutateRate) {
      // noinspection UnnecessaryLocalVariableJS
      let mutateFactor = 1 + ((Math.random() - 0.5) * 3 + (Math.random() - 0.5));
      gene *= mutateFactor;
    }

    return gene;
  },

  random : function(min, max){
    return Math.floor(Math.random()*(max-min+1) + min);
  },

  getRandomUnit : function(array){
    return array[this.random(0, array.length-1)];
  },

  // evolves the population by performing selection, crossover and mutations on the units
  evolvePopulation : function(){
    // Average population fitness
    let fitnessSum = 0
    this.Population.forEach(genom => {
      fitnessSum += genom.fitness
    })
    console.log('AVERAGE POPULATION FITNESS IS: ', fitnessSum / this.Population.length)



    // select the top units of the current population to get an array of winners
    // (they will be copied to the next population)
    let Winners = this.selection();


    // noinspection EqualityComparisonWithCoercionJS
    if (this.mutateRate == 1 && Winners[0].fitness < 0){
      // If the best unit from the initial population has a negative fitness
      this.createPopulation();
    } else {
      this.mutateRate = 0.2; // else set the mutatation rate to the real value
    }

    // fill the rest of the next population with new units using crossover and mutation
    for (let i=this.top_units; i<this.max_units; i++){
      let parentA, parentB, offspring;

      // noinspection EqualityComparisonWithCoercionJS
      if (i == this.top_units){
        // offspring is made by a crossover of two best winners
        parentA = Winners[0].toJSON();
        parentB = Winners[1].toJSON();
        offspring = this.crossOver(parentA, parentB);

      } else if (i < this.max_units-2){
        // offspring is made by a crossover of two random winners
        parentA = this.getRandomUnit(Winners).toJSON();
        parentB = this.getRandomUnit(Winners).toJSON();
        offspring = this.crossOver(parentA, parentB);

      } else {
        // offspring is a random winner
        offspring = this.getRandomUnit(Winners).toJSON();
      }

      // mutate the offspring
      offspring = this.mutation(offspring);

      // create a new unit using the neural network from the offspring
      let newUnit = synaptic.Network.fromJSON(offspring);
      newUnit.index = this.Population[i].index;
      newUnit.fitness = 0;
      newUnit.score = 0;
      newUnit.isWinner = false;

      // update population by changing the old unit with the new one
      this.Population[i] = newUnit;
    }

    // if the top winner has the best fitness in the history, store its achievement!
    if (Winners[0].fitness > this.best_fitness){
      this.best_population = this.iteration;
      this.best_fitness = Winners[0].fitness;
      this.best_score = Winners[0].score;
    }

    // sort the units of the new population	in ascending order by their index
    this.Population.sort(function(unitA, unitB){
      return unitA.index - unitB.index;
    });
  },
}

module.exports = GeneticAlgorithm
