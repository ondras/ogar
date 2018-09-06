BIN := node_modules/.bin
ROLLUP := $(BIN)/rollup
ALL := test.js tetris.js

all: $(ALL)

%.js: src/%.ts src/*.ts
	$(ROLLUP) -c -i $< -o $@

clean:
	rm -rf $(ALL)

.PHONY: all clean
