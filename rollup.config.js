import typescript from "rollup-plugin-typescript2";

let options = {
	check: true
}

export default {
	input: "src/test.ts",
	output: {
		file: "test.js",
		format: "cjs"
	},
	plugins: [ typescript(options) ]
}
