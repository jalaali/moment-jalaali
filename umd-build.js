var path = require('path')
var fs = require('fs')

var beforeJalaali = fs.readFileSync(path.resolve(__dirname, 'builder', 'before-jalaali.js'), 'utf-8')
var beforeMomentFa = fs.readFileSync(path.resolve(__dirname, 'builder', 'before-moment-fa.js'), 'utf-8')
var beforeMomentJalaali = fs.readFileSync(path.resolve(__dirname, 'builder', 'before-moment-jalaali.js'), 'utf-8')
var after = fs.readFileSync(path.resolve(__dirname, 'builder', 'after.js'), 'utf-8')

var jalaali = fs.readFileSync(require.resolve('jalaali-js'), 'utf-8')
var momentFa = fs.readFileSync(require.resolve('moment/locale/fa'), 'utf-8')
var momentJalaali = fs.readFileSync(path.resolve(__dirname, 'index.js'), 'utf-8')

if (!fs.existsSync(path.resolve(__dirname, 'build'))) {
    fs.mkdirSync(path.resolve(__dirname, 'build'))
}

var result = beforeJalaali + jalaali + beforeMomentFa + momentFa + beforeMomentJalaali + momentJalaali + after

fs.writeFileSync(path.resolve(__dirname, 'build', 'moment-jalaali.js'), result)
