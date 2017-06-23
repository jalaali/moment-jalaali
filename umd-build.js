var path = require('path')
var fs = require('fs')

var before = fs.readFileSync(path.resolve(__dirname, 'builder', 'before.js'), 'utf-8')
var middle = fs.readFileSync(path.resolve(__dirname, 'builder', 'middle.js'), 'utf-8')
var after = fs.readFileSync(path.resolve(__dirname, 'builder', 'after.js'), 'utf-8')

var jalaali = fs.readFileSync(require.resolve('jalaali-js'), 'utf-8')
var momentJalaali = fs.readFileSync(path.resolve(__dirname, 'index.js'), 'utf-8')

if (!fs.existsSync(path.resolve(__dirname, 'build'))) {
    fs.mkdirSync(path.resolve(__dirname, 'build'))
}

var result = before + jalaali + middle + momentJalaali + after

fs.writeFileSync(path.resolve(__dirname, 'build', 'moment-jalaali.js'), result)
