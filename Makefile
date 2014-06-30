
build: lint

test: build
	@mocha --reporter spec --ui bdd --colors --check-leaks test.js

dev: build
	@mocha --reporter spec --ui bdd --colors --check-leaks --watch test.js

lint: lint-index lint-test

lint-index: index.js
	@eslint index.js

lint-test: test.js
	@eslint --env mocha --rule 'no-unused-expressions: 0' test.js

clean:

.PHONY: build test dev lint lint-index lint-test clean
