import typescript from "rollup-plugin-typescript2";

let options = {
	check: true
}

export default {
	output: {
		format: "cjs"
	},
	plugins: [ typescript(options) ]
}
