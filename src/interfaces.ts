export interface IGenome extends ReadonlyArray<any>{};

export interface IOptions {
	populationSize: number,
	createGenome: () => IGenome,

	computeFitness: (g:IGenome) => Promise<number>,
	compareFitnesses: (a:number, b:number) => number,
	bestCount: number,

	mutationChance: number,
	mutateGene: (a:number, b:number) => number
}

export interface IPartialOptions extends Partial<Options>{};

export interface IEvaluatedGenome {
	genome: IGenome,
	fitness: number
};

export interface IPopulation extends ReadonlyArray<IGenome>{};
export interface IEvaluatedPopulation extends ReadonlyArray<IEvaluatedGenome>{};
