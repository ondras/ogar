import GA from "./index.js";
import { IPartialOptions, IEvaluatedGenome, IGenome } from "./interfaces";

const target = "helloworld";

const config: IPartialOptions = {
	populationSize: 10,
	createGenome() { 
		let len = target.length;
		let result = [];
		for (let i=0;i<len;i++) {
			let letter = "a".charCodeAt(0) + Math.floor(Math.random()*26);
			result.push(letter);
		}
		return result; 
	},

	async computeFitness(genome) { 
		let str1 = target;
		let str2 = String.fromCharCode.apply(String, genome);
		let dist = 0;
		for (let i=0;i<str1.length;i++) {
			dist += Math.abs(str1.charCodeAt(i) - str2.charCodeAt(i));
		}
		return dist;
	},

	compareFitnesses(f1, f2) { return f1-f2; },

	mutateGene(value, index) {
		let diff = Math.floor(Math.random() * 3) - 1;
		return value + diff; 
	}
}
let ga = new GA(config);

function stringify(item: IEvaluatedGenome) {
	return `${String.fromCharCode.apply(String, item.genome)}/${item.fitness}`;
}

async function go() {
	let count = 0;
	while (1) {
		count++;
		let g = await ga.next();
		console.log(count);
		console.log(g.map(stringify));
		if (g[0].fitness == 0) break;
	}
}

go();
