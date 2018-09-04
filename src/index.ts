import { IGenome, IOptions, IPartialOptions, IPopulation, IEvaluatedPopulation } from "./interfaces";

const defaultOptions: IOptions = {
	// initialization
	populationSize: 10,
	createGenome() { return []; },

	// selection
	async computeFitness(genome) { return 0; },
	compareFitnesses(a, b) { return b-a; },
	bestCount: 4,

	// breeding
	mutationChance: 0.1,
	mutateGene(value, index) { return value; }
}

export default class GA {
	_options: IOptions;
	_currentPopulation: IEvaluatedPopulation | null;

	constructor(options: IPartialOptions) {
		this._options = Object.assign({}, defaultOptions, options);
		this._currentPopulation = null;
	}

	async next(): Promise<IEvaluatedPopulation> {
		let oldPopulation = this._currentPopulation;
		if (!oldPopulation) {
			oldPopulation = await this._createInitialPopulation();
		}

		let best = this._pickBest(oldPopulation);
		let newPopulation = this._breedPopulation(best);
		let evaluatedPopulation = await this._evaluatePopulation(newPopulation)
		this._currentPopulation = evaluatedPopulation;
		return evaluatedPopulation;
	}

	_randomItem(array: IEvaluatedPopulation) {
		return array[Math.floor(Math.random() * array.length)];
	}

	_pickBest(population: IEvaluatedPopulation) {
		const o = this._options;
		return population.slice(0, o.bestCount);
	}

	_breedPopulation(best: IEvaluatedPopulation) {
		const o = this._options;
		let population = [];
		for (let i=0;i<o.populationSize;i++) {
			let g1 = this._randomItem(best).genome;
			let g2 = this._randomItem(best).genome;
			let offspring = this._breedOne(g1, g2);
			population.push(offspring);
		}
		return population;
	}

	_breedOne(g1: IGenome, g2: IGenome) {
		let genome = this._crossover(g1, g2);
		return this._mutate(genome);
	}

	_mutate(genome: IGenome) {
		const o = this._options;
		let mutated = genome.map((value, index) => {
			if (Math.random() < o.mutationChance) {
				return o.mutateGene(value, index);
			} else {
				return value;
			}
		});
		return mutated;
	}

	_crossover(g1: IGenome, g2: IGenome) {
		let genesFromFirst = Math.floor(Math.random() * (g1.length+1));

		let indices = g1.map((gene, index) => index);
		let indicesFromFirst: number[] = [];

		for (let i=0;i<genesFromFirst;i++) {
			let index = Math.floor(Math.random() * indices.length);
			index = indices.splice(index, 1)[0];
			indicesFromFirst.push(index);
		}

		return g1.map((gene, index) => {
			if (indicesFromFirst.includes(index)) {
				return g1[index];
			} else {
				return g2[index];
			}
		});
	}

	async _createInitialPopulation() {
		const o = this._options;
		let result = [];
		for (let i=0; i<o.populationSize;i++) {
			result.push(o.createGenome());
		}
		return this._evaluatePopulation(result);
	}

	async _evaluatePopulation(population: IPopulation): Promise<IEvaluatedPopulation> {
		const o = this._options;
		let promises = population.map(o.computeFitness);
		let fitnesses = await Promise.all(promises);

		let evaluatedPopulation = population.map((genome, index) => {
			return { genome, fitness:fitnesses[index] };
		});

		evaluatedPopulation.sort((a, b) => o.compareFitnesses(a.fitness, b.fitness));

		return evaluatedPopulation;
	}
}