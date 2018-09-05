import GA from "./index";
import { IPartialOptions, IEvaluatedGenome, IGenome } from "./interfaces";

const count = 6;
const child_process = require("child_process");
const binary = "/home/ondras/projects/arduino/tetris2/tetris2";

const config: IPartialOptions = {
	// best so far: 10/   0/0 /2  /1.5/0.5:3576
	//              10/-0.5/-1/2  /  1/0.5:3593
	//               9/   0/-1/0.5/1.5/0.5:4080
	createGenome() { 
		let genome = [];
		for (let i=0;i<count;i++) {
			genome.push(Math.floor(Math.random() * 10));
		}
		return genome;
	},

	async computeFitness(genome) {
		let result = child_process.spawnSync(binary, genome);
		return Number(result.stdout);
	},

	mutateGene(value, index) {
		let diff = (Math.floor(Math.random()*5)-2)/2;
		return value + diff; 
	}
}
let ga = new GA(config);

function stringify(item: IEvaluatedGenome) {
	return `${item.genome.join("/")}:${item.fitness}`;
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
