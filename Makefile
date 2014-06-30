
build/moment-jalaali.js:
	@component build -s moment -n moment-jalaali

test: build/moment-jalaali.js
	@mocha --reporter spec --ui bdd --colors --check-leaks test.js

dev: build/moment-jalaali.js
	@mocha --reporter spec --ui bdd --colors --check-leaks --watch test.js

lint: lint-index lint-test

lint-index: index.js
	@eslint index.js

lint-test: test.js
	@eslint --env mocha --rule 'no-unused-expressions: 0' test.js

clean:
	@rm -fr build

.PHONY: build test dev lint lint-index lint-test clean
