import GA from "./index";
import { Options, EvaluatedGenome } from "./interfaces";

const count = 6;
const child_process = require("child_process");
const binary = "/home/ondras/projects/arduino/tetris2/tetris2";

interface Cache {
    [index: string]: number;
}

const cache:Cache = {};

function mutateGene(value: number, index: number) {
	let diff = (Math.floor(Math.random()*31)-15)/10;
	return value + diff; 
}

const config: Partial<Options> = {
	//              10/   0/   0/  2/1.5/0.5:3576
	//              10/-0.5/  -1/  2/  1/0.5:3593
    //             9.0/ 1.0/ 0.5/0.0/1.5/1.0:3592
	//               9/   0/  -1/0.5/1.5/0.5:4080
	//             9.0/ 0.0/  -1/0.1/1.5/0.5:4177
    //            10.7/-1.0/-1.2/0.3/1.9/0.7:4231
	//             9.2/ 0.6/-1.0/0.5/1.7/0.5:4295
	//            10.7/ 0.1/-1.3/0.3/1.9/0.7:4367
    //            12.1/ 0.1/-1.1/0.6/2.3/0.6:4445
    //            11.8/ 0.1/-1.1/0.6/2.2/0.6:4547
	populationSize: 30,
	bestCount: 10,

	createGenome() { 
		return [11.8, 0.1, -1.1, 0.6, 2.2, 0.6].map(mutateGene);
//		return [9, 0, -1, 0.5, 1.5, 0.5];
		/*
		return 
		for (let i=0;i<count;i++) {
			genome.push(Math.floor(Math.random() * 10));
		}
		return genome;
		*/
	},

	async computeFitness(genome) {
		let key = genome.toString();
		if (!(key in cache)) {
			let result = child_process.spawnSync(binary, genome);
			cache[key] = Number(result.stdout);
		}
		return cache[key];
	},

	mutateGene
}
let ga = new GA(config);

function stringify(item: EvaluatedGenome) {
	return `${item.genome.map(x=>x.toFixed(1)).join("/")}:${item.fitness}`;
}

async function go() {
	let count = 0;
	while (1) {
		count++;
		let g = await ga.next();
		console.log(count);
		console.log(g.map(stringify));
		if (count > 1000) break;
	}
}

go();
