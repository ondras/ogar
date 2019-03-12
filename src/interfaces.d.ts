export interface Genome extends Readonly<number[]> {}

export interface Options {
	populationSize: number,
	createGenome: () => Genome,

	computeFitness: (g:Genome) => Promise<number>,
	compareFitnesses: (a:number, b:number) => number,
	bestCount: number,

	mutationChance: number,
	mutateGene: (a:number, b:number) => number
}

export interface EvaluatedGenome {
	genome: Genome,
	fitness: number
}

export interface Population extends Readonly<Genome[]> {}
export interface EvaluatedPopulation extends Readonly<EvaluatedGenome[]> {}
