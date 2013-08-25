moment-jalaali
==============

A Jalaali (Jalali, Persian, Khorshidi, Shamsi) calendar system plugin for moment.js.

About
-----

Jalali calendar is a solar calendar that was used in Persia, variants of which today are still in use in Iran as well as Afghanistan. [Read more on Wikipedia](http://en.wikipedia.org/wiki/Jalali_calendar) and see [Calendar Converter](http://www.fourmilab.ch/documents/calendar/)

This plugin adds Jalaali calendar support to [momentjs](http://momentjs.com) library.

Calendar conversion is based on the [algorithm provided by Kazimierz M. Borkowski](http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm) and has a very good performance.

Where to use it
---------------

Like `momentjs`, `moment-jalaali` works in browser and in Node.js.

### Node.js

```shell
npm install moment-jalaali
```


```js
var moment = require('moment-jalaali');
moment().format('jYYYY/jM/jD');
```

### Browser

    <script src="moment.js"></script>
    <script src="moment-jalaali.js"></script>
    <script>
      moment().format('jYYYY/jM/jD');
    </script>

### Require.js

```js
require.config({
  paths: {
    "moment": "path/to/moment",
    "moment-jalaali": "path/to/moment-jalaali"
  }
});
define(["moment-jalaali"], function (moment) {
  moment().format('jYYYY/jM/jD');
});
```

API
---

This plugin tries to mimic `momentjs` api. Basically, when you want to format or parse a string, just add a `j` to the format token like 'jYYYY' or 'jM'. For example:

```js
m = moment('1360/5/26', 'jYYYY/jM/jD'); // Parse a Jalaali date.
m.format('jYYYY/jM/jD [is] YYYY/M/D'); // 1360/5/26 is 1981/8/17

m.jYear(); // 1360
m.jMonth(); // 4
m.jDate(); // 26
m.jDayOfYear(); // 150
m.jWeek(); // 22
m.jWeekYear(); // 1360

m.add(1, 'jYear');
m.add(2, 'jMonth');
m.format('jYYYY/jM/jD'); // 1361/7/26

m.jMonth(11);
m.startOf('jMonth');
m.format('jYYYY/jM/jD'); // 1361/12/1

m.jYear(1392);
m.startOf('jYear');
m.format('jYYYY/jM/jD'); // 1392/1/1

moment('1391/12/30', 'jYYYY/jMM/jDD').isValid(); // true (leap year)
moment('1392/12/30', 'jYYYY/jMM/jDD').isValid(); // false (common year)
moment.jIsLeapYear(1391); // true
moment.jIsLeapYear(1392); // false

moment('1392/6/3 16:40', 'jYYYY/jM/jD HH:mm').format('YYYY-M-D HH:mm:ss'); // 2013-8-25 16:40:00

moment('2013-8-25 16:40:00', 'YYYY-M-D HH:mm:ss').endOf('jMonth').format('jYYYY/jM/jD HH:mm:ss'); // 1392/6/31 23:59:59

// Complex parse:
moment('1981 5 17', 'YYYY jM D').format('YYYY/MM/DD'); // 1981/07/17
```

License
-------

MIT
