
build/moment-jalaali.js: components index.js
	@$(MAKE) lint
	@component build -s moment -n moment-jalaali

publish: build/moment-jalaali.js
	npm publish

MOCHA_CMD = mocha --reporter spec --ui bdd --colors --check-leaks

test: build/moment-jalaali.js
	@$(MOCHA_CMD) test.js

dev: build/moment-jalaali.js
	@$(MOCHA_CMD) --watch test.js

lint: lint-index lint-test

lint-index: node_modules
	@eslint index.js

lint-test: node_modules
	@eslint --env mocha --rule 'no-unused-expressions: 0' test.js

components: node_modules component.json
	@component install && touch $@

node_modules: package.json
	@npm install && touch $@

clean:
	@rm -fr build

clean-all: clean
	@rm -fr components node_modules

.PHONY: publish test dev lint lint-index lint-test clean clean-all
