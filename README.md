# moment-jalaali

A Jalaali (Jalali, Persian, Khorshidi, Shamsi) calendar system plugin for moment.js.

[![Build Status](https://travis-ci.org/jalaali/moment-jalaali.png?branch=master)](https://travis-ci.org/jalaali/moment-jalaali)

Jalali calendar is a solar calendar that was used in Persia, variants of which today are still in use in Iran as well as Afghanistan. [Read more on Wikipedia](http://en.wikipedia.org/wiki/Jalali_calendar) or see [Calendar Converter](http://www.fourmilab.ch/documents/calendar/).

This plugin adds Jalaali calendar support to [momentjs](http://momentjs.com) library.

Calendar conversion is based on the [algorithm provided by Kazimierz M. Borkowski](http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm) and has a very good performance.

## Where to use it

Like `momentjs`, `moment-jalaali` works in browser and in Node.js.

### Node.js

```shell
npm install moment-jalaali
```


```js
var moment = require('moment-jalaali')
moment().format('jYYYY/jM/jD')
```

### Browser

You may use the `node_modules/build/moment-jalaali.js` file.

    <script src="node_modules/moment/moment.min.js"></script>
    <script src="node_modules/moment-jalaali/build/moment-jalaali.js"></script>
    <script>
      moment().format('jYYYY/jM/jD')
    </script>

## API

This plugin tries to mimic `momentjs` api. Basically, when you want to format or parse a string, just add a `j` to the format token like 'jYYYY' or 'jM'. For example:

```js
m = moment('1360/5/26', 'jYYYY/jM/jD') // Parse a Jalaali date
m.format('jYYYY/jM/jD [is] YYYY/M/D') // 1360/5/26 is 1981/8/17

m.jYear() // 1360
m.jMonth() // 4
m.jDate() // 26
m.jDayOfYear() // 150
m.jWeek() // 22
m.jWeekYear() // 1360

m.add(1, 'jYear')
m.add(2, 'jMonth')
m.add(3, 'day')
m.format('jYYYY/jM/jD') // 1361/7/29

m.jMonth(11)
m.startOf('jMonth')
m.format('jYYYY/jM/jD') // 1361/12/1

m.jYear(1392)
m.startOf('jYear')
m.format('jYYYY/jM/jD') // 1392/1/1

m.subtract(1, 'jYear')
m.subtract(1, 'jMonth')
m.format('jYYYY/jM/jD') // 1390/12/1

moment('1391/12/30', 'jYYYY/jMM/jDD').isValid() // true (leap year)
moment('1392/12/30', 'jYYYY/jMM/jDD').isValid() // false (common year)
moment.jIsLeapYear(1391) // true
moment.jIsLeapYear(1392) // false

moment.jDaysInMonth(1395, 11) // 30
moment.jDaysInMonth(1394, 11) // 29

moment('1392/6/3 16:40', 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss') // 2013-8-25 16:40:00

moment('2013-8-25 16:40:00', 'YYYY-M-D HH:mm:ss').endOf('jMonth').format('jYYYY/jM/jD HH:mm:ss') // 1392/6/31 23:59:59

// Complex parse:
moment('1981 5 17', 'YYYY jM D').format('YYYY/MM/DD') // 1981/07/17
```

To add Persian language, use loadPersian method:

```js
moment.loadPersian([options])
```

### Options

| Param            | Type    | Default   | Description                               | Example                                      |
| ---------------- | ------- | -------   | ----------------------------------------  | -------------------------------------------- |
| usePersianDigits | Boolean | `false`   | Use persian digits (Use at your own risk) | `moment.loadPersian({usePersianDigits: true})` |
| dialect *        | String  | `persian` | Available values = `persian`, `persian-modern` | `moment.loadPersian({dialect: 'persian-modern'})` |

*use dialect option to change `usePersian` dialect, available options are:
* persian: default dialect(امرداد، آدینه، ...)
* persian-modern: modern dialect(مرداد، جمعه، ...)

## Related Projects

### ng-jalali-flat-datepicker

A lightweight angular.js date picker using `moment-jalaali` is [thg303/ng-jalali-flat-datepicker](https://github.com/thg303/ng-jalali-flat-datepicker) created by [@thg303](https://github.com/thg303).

### pholiday

A library based on `moment-jalaali` for calculating holidays in Persian calendar is [shkarimpour/pholiday](https://github.com/shkarimpour/pholiday) created by [@shkarimpour](https://github.com/shkarimpour).

### moment-hijri

Another calendar system plugin for `momentjs` is [moment-hijri](https://github.com/xsoh/moment-hijri) created by [@xsoh](https://github.com/xsoh).

## License

MIT
