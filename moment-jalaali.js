(function() {
  'use strict';
  /*
    Expose Moment Jalaali.
  */

  var __hasProp = {}.hasOwnProperty;

  (function(root, factory) {
    if (typeof define === 'function' && define.amd) {
      define(['moment'], factory);
    } else if (typeof exports === 'object') {
      module.exports = factory(require('moment'));
    } else {
      root.moment = factory(root.moment);
    }
  })(this, function(moment) {
    var addTimeToArrayFromToken, compareArrays, d2g, d2j, dateFromArray, div, extend, formatFunctions, formatTokenFunctions, formattingTokens, g2d, getParseRegexForToken, isArray, j2d, jMoment, jWeekOfYear, jalCal, leftZeroFill, localFormattingTokens, makeDateFromStringAndArray, makeDateFromStringAndFormat, makeFormatFunction, makeMoment, mod, normalizeUnits, ordinalizeToken, ordinalizeTokens, padToken, paddedTokens, parseTokenFourDigits, parseTokenOneOrTwoDigits, parseTokenOneToThreeDigits, parseTokenSixDigits, parseTokenThreeDigits, parseTokenWord, removeParsedTokens, setDate, toGregorian, toJalaali, unitAliases;
    if (moment == null) {
      throw new Error('Cannot find moment');
    }
    /*
        Constants
    */

    formattingTokens = /(\[[^\[]*\])|(\\)?j(Mo|MM?M?M?|Do|DDDo|DD?D?D?|w[o|w]?|YYYYY|YYYY|YY|gg(ggg?)?|)|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g;
    localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g;
    parseTokenOneOrTwoDigits = /\d\d?/;
    parseTokenOneToThreeDigits = /\d{1,3}/;
    parseTokenThreeDigits = /\d{3}/;
    parseTokenFourDigits = /\d{1,4}/;
    parseTokenSixDigits = /[+\-]?\d{1,6}/;
    parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
    unitAliases = {
      jm: 'jmonth',
      jy: 'jyear'
    };
    formatFunctions = {};
    ordinalizeTokens = 'DDD w M D'.split(' ');
    paddedTokens = 'M D w'.split(' ');
    formatTokenFunctions = {
      jM: function() {
        return this.jMonth() + 1;
      },
      jMMM: function(format) {
        return this.lang().jMonthsShort(this, format);
      },
      jMMMM: function(format) {
        return this.lang().jMonths(this, format);
      },
      jD: function() {
        return this.jDate();
      },
      jDDD: function() {
        return this.jDayOfYear();
      },
      jw: function() {
        return this.jWeek();
      },
      jYY: function() {
        return leftZeroFill(this.jYear() % 100, 2);
      },
      jYYYY: function() {
        return leftZeroFill(this.jYear(), 4);
      },
      jYYYYY: function() {
        return leftZeroFill(this.jYear(), 5);
      },
      jgg: function() {
        return leftZeroFill(this.jWeekYear() % 100, 2);
      },
      jgggg: function() {
        return this.jWeekYear();
      },
      jggggg: function() {
        return leftZeroFill(this.jWeekYear(), 5);
      }
    };
    padToken = function(func, count) {
      return function(a) {
        return leftZeroFill(func.call(this, a), count);
      };
    };
    ordinalizeToken = function(func, period) {
      return function(a) {
        return this.lang().ordinal(func.call(this, a), period);
      };
    };
    (function() {
      var i;
      while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions['j' + i + 'o'] = ordinalizeToken(formatTokenFunctions['j' + i], i);
      }
      while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions['j' + i + i] = padToken(formatTokenFunctions['j' + i], 2);
      }
    })();
    formatTokenFunctions.jDDDD = padToken(formatTokenFunctions.jDDD, 3);
    /*
        Helpers
    */

    leftZeroFill = function(number, targetLength) {
      var output;
      output = number + '';
      while (output.length < targetLength) {
        output = '0' + output;
      }
      return output;
    };
    normalizeUnits = function(units) {
      if (units) {
        return unitAliases[units] || units.toLowerCase().replace(/(.)s$/, '$1');
      } else {
        return units;
      }
    };
    setDate = function(year, month, date) {
      var utc;
      utc = this._isUTC ? 'UTC' : '';
      this._d['set' + utc + 'FullYear'](year);
      this._d['set' + utc + 'Month'](month);
      this._d['set' + utc + 'Date'](date);
    };
    extend = function(a, b) {
      var key, value;
      for (key in b) {
        if (!__hasProp.call(b, key)) continue;
        value = b[key];
        a[key] = value;
      }
      return a;
    };
    isArray = function(o) {
      return Object.prototype.toString.call(o) === '[object Array]';
    };
    /*
      Compare two arrays, return the number of differences.
    */

    compareArrays = function(array1, array2) {
      var diffs, i, len, lengthDiff, _i;
      len = Math.min(array1.length, array2.length);
      lengthDiff = Math.abs(array1.length - array2.length);
      diffs = 0;
      for (i = _i = 0; _i < len; i = _i += 1) {
        if (~~array1[i] !== ~~array2[i]) {
          diffs += 1;
        }
      }
      return diffs + lengthDiff;
    };
    /*
        Languages
    */

    extend(moment.langData().__proto__, {
      _jMonths: ['Farvardin', 'Ordibehesht', 'Khordaad', 'Tir', 'Amordaad', 'Shahrivar', 'Mehr', 'Aabaan', 'Aazar', 'Dey', 'Bahman', 'Esfand'],
      jMonths: function(m) {
        return this._jMonths[m.jMonth()];
      },
      _jMonthsShort: ['Far', 'Ord', 'Kho', 'Tir', 'Amo', 'Sha', 'Meh', 'Aab', 'Aaz', 'Dey', 'Bah', 'Esf'],
      jMonthsShort: function(m) {
        return this._jMonthsShort[m.jMonth()];
      },
      jMonthsParse: function(monthName) {
        var i, mom, regex, _i;
        if (!this._jMonthsParse) {
          this._jMonthsParse = [];
        }
        for (i = _i = 0; _i < 12; i = ++_i) {
          if (!this._jMonthsParse[i]) {
            mom = jMoment([2000, (2 + i) % 12, 25]);
            regex = '^' + this.jMonths(mom, '') + '|^' + this.jMonthsShort(mom, '');
            this._jMonthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
          }
          if (this._jMonthsParse[i].test(monthName)) {
            return i;
          }
        }
      }
    });
    /*
        Formatting
    */

    makeFormatFunction = function(format) {
      var array, i, match, _i, _len;
      array = format.match(formattingTokens);
      for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
        match = array[i];
        if (formatTokenFunctions[match]) {
          array[i] = formatTokenFunctions[match];
        }
      }
      return function(mom) {
        var output, _j, _len1;
        output = '';
        for (_j = 0, _len1 = array.length; _j < _len1; _j++) {
          match = array[_j];
          if (match instanceof Function) {
            output += '[' + match.call(mom, format) + ']';
          } else {
            output += match;
          }
        }
        return output;
      };
    };
    /*
        Week of Year
    */

    jWeekOfYear = function(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
      var adjustedMoment, daysToDayOfWeek, end;
      end = firstDayOfWeekOfYear - firstDayOfWeek;
      daysToDayOfWeek = firstDayOfWeekOfYear - mom.day();
      if (daysToDayOfWeek > end) {
        daysToDayOfWeek -= 7;
      }
      if (daysToDayOfWeek < end - 7) {
        daysToDayOfWeek += 7;
      }
      adjustedMoment = jMoment(mom).add('d', daysToDayOfWeek);
      return {
        week: Math.ceil(adjustedMoment.jDayOfYear() / 7),
        year: adjustedMoment.jYear()
      };
    };
    /*
        Parsing
    */

    removeParsedTokens = function(config) {
      var array, format, input, match, parsed, string, _i, _len;
      string = config._i;
      input = '';
      format = '';
      array = config._f.match(formattingTokens);
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        match = array[_i];
        parsed = (getParseRegexForToken(match, config).exec(string) || [])[0];
        if (parsed) {
          string = string.slice(string.indexOf(parsed) + parsed.length);
        }
        if (!(formatTokenFunctions[match] instanceof Function)) {
          format += match;
          if (parsed) {
            input += parsed;
          }
        }
      }
      config._i = input;
      config._f = format;
    };
    /*
      Get the regex to find the next token.
    */

    getParseRegexForToken = function(token, config) {
      switch (token) {
        case 'jDDDD':
          return parseTokenThreeDigits;
        case 'jYYYY':
          return parseTokenFourDigits;
        case 'jYYYYY':
          return parseTokenSixDigits;
        case 'jDDD':
          return parseTokenOneToThreeDigits;
        case 'jMMM':
        case 'jMMMM':
          return parseTokenWord;
        case 'jMM':
        case 'jDD':
        case 'jYY':
        case 'jM':
        case 'jD':
          return parseTokenOneOrTwoDigits;
        case 'DDDD':
          return parseTokenThreeDigits;
        case 'YYYY':
          return parseTokenFourDigits;
        case 'YYYYY':
          return parseTokenSixDigits;
        case 'S':
        case 'SS':
        case 'SSS':
        case 'DDD':
          return parseTokenOneToThreeDigits;
        case 'MMM':
        case 'MMMM':
        case 'dd':
        case 'ddd':
        case 'dddd':
          return parseTokenWord;
        case 'a':
        case 'A':
          return moment.langData(config._l)._meridiemParse;
        case 'X':
          return parseTokenTimestampMs;
        case 'Z':
        case 'ZZ':
          return parseTokenTimezone;
        case 'T':
          return parseTokenT;
        case 'MM':
        case 'DD':
        case 'YY':
        case 'HH':
        case 'hh':
        case 'mm':
        case 'ss':
        case 'M':
        case 'D':
        case 'd':
        case 'H':
        case 'h':
        case 'm':
        case 's':
          return parseTokenOneOrTwoDigits;
        default:
          return new RegExp(token.replace('\\', ''));
      }
    };
    /*
      Function to convert string input to date.
    */

    addTimeToArrayFromToken = function(token, input, config) {
      var a, datePartArray;
      datePartArray = config._a;
      switch (token) {
        case 'jM':
        case 'jMM':
          datePartArray[1] = input == null ? 0 : ~~input - 1;
          break;
        case 'jMMM':
        case 'jMMMM':
          a = moment.langData(config._l).jMonthsParse(input);
          if (a != null) {
            datePartArray[1] = a;
          } else {
            config._isValid = false;
          }
          break;
        case 'jD':
        case 'jDD':
        case 'jDDD':
        case 'jDDDD':
          if (input != null) {
            datePartArray[2] = ~~input;
          }
          break;
        case 'jYY':
          datePartArray[0] = ~~input + (~~input > 47 ? 1300 : 1400);
          break;
        case 'jYYYY':
        case 'jYYYYY':
          datePartArray[0] = ~~input;
      }
      if (input == null) {
        config._isValid = false;
      }
    };
    dateFromArray = function(config) {
      var g, j, jd, jm, jy, _ref;
      _ref = config._a, jy = _ref[0], jm = _ref[1], jd = _ref[2];
      if (!((jy != null) || (jm != null) || (jd != null))) {
        return [0, 0, 1];
      }
      jy || (jy = 0);
      jm || (jm = 0);
      jd || (jd = 1);
      if (!((1 <= jd && jd <= jMoment.jDaysInMonth(jy, jm)))) {
        config._isValid = false;
      }
      g = toGregorian(jy, jm, jd);
      j = toJalaali(g.gy, g.gm, g.gd);
      config._jDiff = 0;
      if (~~j.jy !== jy) {
        config._jDiff += 1;
      }
      if (~~j.jm !== jm) {
        config._jDiff += 1;
      }
      if (~~j.jd !== jd) {
        config._jDiff += 1;
      }
      return [g.gy, g.gm, g.gd];
    };
    makeDateFromStringAndFormat = function(config) {
      var parsedInput, string, token, tokens, _i, _len;
      tokens = config._f.match(formattingTokens);
      string = config._i;
      config._a = [];
      for (_i = 0, _len = tokens.length; _i < _len; _i++) {
        token = tokens[_i];
        parsedInput = (getParseRegexForToken(token, config).exec(string) || [])[0];
        if (parsedInput) {
          string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
        }
        if (formatTokenFunctions[token]) {
          addTimeToArrayFromToken(token, parsedInput, config);
        }
      }
      if (string) {
        config._il = string;
      }
      return dateFromArray(config);
    };
    makeDateFromStringAndArray = function(config, utc) {
      var bestMoment, currentScore, format, scoreToBeat, tempConfig, tempMoment, _i, _len, _ref;
      scoreToBeat = 99;
      _ref = config._f;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        format = _ref[_i];
        tempConfig = extend({}, config);
        tempConfig._f = format;
        tempMoment = makeMoment(config._i, format, config._l, utc);
        currentScore = compareArrays(tempMoment._a, tempMoment.toArray());
        currentScore += tempMoment._jDiff;
        if (tempMoment._il) {
          currentScore += tempMoment._il.length;
        }
        if (currentScore < scoreToBeat) {
          scoreToBeat = currentScore;
          bestMoment = tempMoment;
        }
      }
      return bestMoment;
    };
    makeMoment = function(input, format, lang, utc) {
      var config, date, m;
      config = {
        _i: input,
        _f: format,
        _l: lang
      };
      if (format) {
        if (isArray(format)) {
          return makeDateFromStringAndArray(config, utc);
        } else {
          date = makeDateFromStringAndFormat(config);
          removeParsedTokens(config);
          format = 'YYYY-MM-DD-' + config._f;
          input = leftZeroFill(date[0], 4) + '-' + leftZeroFill(date[1] + 1, 2) + '-' + leftZeroFill(date[2], 2) + '-' + config._i;
        }
      }
      if (utc) {
        m = moment.utc.call(this, input, format, lang);
      } else {
        m = moment.call(this, input, format, lang);
      }
      if (config._isValid === false) {
        m._isValid = false;
      }
      m._jDiff = config._jDiff || 0;
      m.__proto__ = jMoment.fn;
      return m;
    };
    jMoment = function(input, format, lang) {
      return makeMoment(input, format, lang, false);
    };
    extend(jMoment, moment);
    jMoment.fn = {};
    jMoment.fn.__proto__ = moment.fn;
    jMoment.utc = function(input, format, lang) {
      return makeMoment(input, format, lang, true);
    };
    /*
        Methods
    */

    jMoment.fn.format = function(format) {
      var i, replace,
        _this = this;
      if (format) {
        i = 5;
        replace = function(input) {
          return _this.lang().longDateFormat(input) || input;
        };
        while (i > 0 && localFormattingTokens.test(format)) {
          i -= 1;
          format = format.replace(localFormattingTokens, replace);
        }
        if (!formatFunctions[format]) {
          formatFunctions[format] = makeFormatFunction(format);
        }
        format = formatFunctions[format](this);
      }
      return moment.fn.format.call(this, format);
    };
    jMoment.fn.jYear = function(input) {
      var gd, gm, gy, jd, jm, jy, lastDay, _ref, _ref1;
      if (typeof input === 'number') {
        _ref = toJalaali(this.year(), this.month(), this.date()), jy = _ref.jy, jm = _ref.jm, jd = _ref.jd;
        lastDay = Math.min(jd, jMoment.jDaysInMonth(input, jm));
        _ref1 = toGregorian(input, jm, lastDay), gy = _ref1.gy, gm = _ref1.gm, gd = _ref1.gd;
        setDate.call(this, gy, gm, gd);
        moment.updateOffset(this);
        return this;
      } else {
        return toJalaali(this.year(), this.month(), this.date()).jy;
      }
    };
    jMoment.fn.jYears = jMoment.fn.jYear;
    jMoment.fn.jMonth = function(input) {
      var gd, gm, gy, jd, jm, jy, lastDay, _ref, _ref1;
      if (input != null) {
        if (typeof input === 'string') {
          input = this.lang().jMonthsParse(input);
          if (typeof input !== 'number') {
            return this;
          }
        }
        _ref = toJalaali(this.year(), this.month(), this.date()), jy = _ref.jy, jm = _ref.jm, jd = _ref.jd;
        lastDay = Math.min(jd, jMoment.jDaysInMonth(jy, input));
        _ref1 = toGregorian(jy, input, lastDay), gy = _ref1.gy, gm = _ref1.gm, gd = _ref1.gd;
        setDate.call(this, gy, gm, gd);
        moment.updateOffset(this);
        return this;
      } else {
        return toJalaali(this.year(), this.month(), this.date()).jm;
      }
    };
    jMoment.fn.jMonths = jMoment.fn.jMonth;
    jMoment.fn.jDate = function(input) {
      var gd, gm, gy, jd, jm, jy, _ref, _ref1;
      if (typeof input === 'number') {
        _ref = toJalaali(this.year(), this.month(), this.date()), jy = _ref.jy, jm = _ref.jm, jd = _ref.jd;
        _ref1 = toGregorian(jy, jm, input), gy = _ref1.gy, gm = _ref1.gm, gd = _ref1.gd;
        setDate.call(this, gy, gm, gd);
        moment.updateOffset(this);
        return this;
      } else {
        return toJalaali(this.year(), this.month(), this.date()).jd;
      }
    };
    jMoment.fn.jDates = jMoment.fn.jDate;
    jMoment.fn.jDayOfYear = function(input) {
      var dayOfYear;
      dayOfYear = Math.round((jMoment(this).startOf('day') - jMoment(this).startOf('jYear')) / 864e5) + 1;
      if (input == null) {
        return dayOfYear;
      } else {
        return this.add('d', input - dayOfYear);
      }
    };
    jMoment.fn.jWeek = function(input) {
      var week;
      week = jWeekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).week;
      if (input == null) {
        return week;
      } else {
        return this.add('d', (input - week) * 7);
      }
    };
    jMoment.fn.jWeeks = jMoment.fn.jWeek;
    jMoment.fn.jWeekYear = function(input) {
      var year;
      year = jWeekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year;
      if (input == null) {
        return year;
      } else {
        return this.add('y', input - year);
      }
    };
    jMoment.fn.add = function(val, units) {
      var _ref;
      if (typeof val === 'string') {
        _ref = [units, val], val = _ref[0], units = _ref[1];
      }
      units = normalizeUnits(units);
      if (units === 'jyear') {
        this.jYear(this.jYear() + val);
      } else if (units === 'jmonth') {
        this.jMonth(this.jMonth() + val);
      } else {
        moment.fn.add.call(this, units, val);
      }
      return this;
    };
    jMoment.fn.startOf = function(units) {
      units = normalizeUnits(units);
      if (units === 'jyear' || units === 'jmonth') {
        if (units === 'jyear') {
          this.jMonth(0);
        }
        this.jDate(1);
        this.hours(0);
        this.minutes(0);
        this.seconds(0);
        this.milliseconds(0);
        return this;
      } else {
        return moment.fn.startOf.call(this, units);
      }
    };
    jMoment.fn.clone = function() {
      return jMoment(this);
    };
    /*
        Statics
    */

    jMoment.jDaysInMonth = function(year, month) {
      if (month < 6) {
        return 31;
      } else if (month < 11) {
        return 30;
      } else if (jMoment.jIsLeapYear(year)) {
        return 30;
      } else {
        return 29;
      }
    };
    jMoment.jIsLeapYear = function(year) {
      return jalCal(year).leap === 0;
    };
    jMoment.loadPersian = function() {
      return moment.lang('fa', {
        months: ('ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_' + 'نوامبر_دسامبر').split('_'),
        monthsShort: ('ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_' + 'اکتبر_نوامبر_دسامبر').split('_'),
        weekdays: ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_' + 'پنج\u200cشنبه_آدینه_شنبه').split('_'),
        weekdaysShort: ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_' + 'پنج\u200cشنبه_آدینه_شنبه').split('_'),
        weekdaysMin: 'ی_د_س_چ_پ_آ_ش'.split('_'),
        longDateFormat: {
          LT: 'HH:mm',
          L: 'jYYYY/jMM/jDD',
          LL: 'jD jMMMM jYYYY',
          LLL: 'jD jMMMM jYYYY LT',
          LLLL: 'dddd، jD jMMMM jYYYY LT'
        },
        calendar: {
          sameDay: '[امروز ساعت] LT',
          nextDay: '[فردا ساعت] LT',
          nextWeek: 'dddd [ساعت] LT',
          lastDay: '[دیروز ساعت] LT',
          lastWeek: 'dddd [ی پیش ساعت] LT',
          sameElse: 'L'
        },
        relativeTime: {
          future: 'در %s',
          past: '%s پیش',
          s: 'چند ثانیه',
          m: '1 دقیقه',
          mm: '%d دقیقه',
          h: '1 ساعت',
          hh: '%d ساعت',
          d: '1 روز',
          dd: '%d روز',
          M: '1 ماه',
          MM: '%d ماه',
          y: '1 سال',
          yy: '%d سال'
        },
        ordinal: '%dم',
        week: {
          dow: 6,
          doy: 12
        },
        meridiem: function(hour, minute, isLowercase) {
          if (hour < 12) {
            return 'ق.ظ';
          } else {
            return 'ب.ظ';
          }
        },
        jMonths: ('فروردین_اردیبهشت_خرداد_تیر_امرداد_شهریور_مهر_آبان_آذر_' + 'دی_بهمن_اسفند').split('_'),
        jMonthsShort: 'فرو_ارد_خرد_تیر_امر_شهر_مهر_آبا_آذر_دی_بهم_اسف'.split('_')
      });
    };
    /*
        Conversion
    */

    toJalaali = function(gy, gm, gd) {
      var j;
      j = d2j(g2d(gy, gm + 1, gd));
      j.jm -= 1;
      return j;
    };
    toGregorian = function(jy, jm, jd) {
      var g;
      g = d2g(j2d(jy, jm + 1, jd));
      g.gm -= 1;
      return g;
    };
    jMoment.jConvert = {
      toJalaali: toJalaali,
      toGregorian: toGregorian
    };
    /*
      Helper functions used in conversion.
    */

    div = function(a, b) {
      return ~~(a / b);
    };
    mod = function(a, b) {
      return a - ~~(a / b) * b;
    };
    /*
      This function determines if the Jalaali (Persian) year is
      leap (366-day long) or is the common year (365 days), and
      finds the day in March (Gregorian calendar) of the first
      day of the Jalaali year (jy).
    
      @param jy Jalaali calendar year (-61 to 3177)
      @return
        leap: number of years since the last leap year (0 to 4)
        gy: Gregorian year of the beginning of Jalaali year
        march: the March day of Farvardin the 1st (1st day of jy)
      @see: http://www.astro.uni.torun.pl/~kb/Papers/EMP/PersianC-EMP.htm
      @see: http://www.fourmilab.ch/documents/calendar/
    */

    jalCal = function(jy) {
      var bl, breaks, gy, jm, jp, jump, leap, leapG, leapJ, march, n, _i, _len, _ref;
      breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
      bl = breaks.length;
      gy = jy + 621;
      leapJ = -14;
      jp = breaks[0];
      if (jy < jp || jy >= breaks[bl - 1]) {
        throw new Error('Invalid Jalaali year ' + jy);
      }
      _ref = breaks.slice(1, bl);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        jm = _ref[_i];
        jump = jm - jp;
        if (jy < jm) {
          break;
        }
        leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
        jp = jm;
      }
      n = jy - jp;
      leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
      if (mod(jump, 33) === 4 && jump - n === 4) {
        leapJ += 1;
      }
      leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
      march = 20 + leapJ - leapG;
      if (jump - n < 6) {
        n = n - jump + div(jump + 4, 33) * 33;
      }
      leap = mod(mod(n + 1, 33) - 1, 4);
      if (leap === -1) {
        leap = 4;
      }
      return {
        leap: leap,
        gy: gy,
        march: march
      };
    };
    /*
      Converts a date of the Jalaali calendar to the Julian Day number.
    
      @param jy Jalaali year (1 to 3100)
      @param jm Jalaali month (1 to 12)
      @param jd Jalaali day (1 to 29/31)
      @return Julian Day number
    */

    j2d = function(jy, jm, jd) {
      var gy, leap, march, _ref;
      _ref = jalCal(jy), leap = _ref.leap, gy = _ref.gy, march = _ref.march;
      return g2d(gy, 3, march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
    };
    /*
      Converts the Julian Day number to a date in the Jalaali calendar.
    
      @param jdn Julian Day number
      @return
        jy: Jalaali year (1 to 3100)
        jm: Jalaali month (1 to 12)
        jd: Jalaali day (1 to 29/31)
    */

    d2j = function(jdn) {
      var gy, jd, jdn1f, jm, jy, k, leap, march, _ref;
      gy = d2g(jdn).gy;
      jy = gy - 621;
      _ref = jalCal(jy), leap = _ref.leap, march = _ref.march;
      jdn1f = g2d(gy, 3, march);
      k = jdn - jdn1f;
      if (k >= 0) {
        if (k <= 185) {
          jm = 1 + div(k, 31);
          jd = mod(k, 31) + 1;
          return {
            jy: jy,
            jm: jm,
            jd: jd
          };
        } else {
          k -= 186;
        }
      } else {
        jy -= 1;
        k += 179;
        if (leap === 1) {
          k += 1;
        }
      }
      jm = 7 + div(k, 30);
      jd = mod(k, 30) + 1;
      return {
        jy: jy,
        jm: jm,
        jd: jd
      };
    };
    /*
      Calculates the Julian Day number from Gregorian or Julian
      calendar dates. This integer number corresponds to the noon of
      the date (i.e. 12 hours of Universal Time).
      The procedure was tested to be good since 1 March, -100100 (of both
      calendars) up to a few million years into the future.
    
      @param gy Calendar year (years BC numbered 0, -1, -2, ...)
      @param gm Calendar month (1 to 12)
      @param gd Calendar day of the month (1 to 28/29/30/31)
      @return Julian Day number
    */

    g2d = function(gy, gm, gd) {
      var d;
      d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) + div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408;
      d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
      return d;
    };
    /*
      Calculates Gregorian and Julian calendar dates from the Julian Day number
      (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
      calendars) to some millions years ahead of the present.
    
      @param jdn Julian Day number
      @return
        gy: Calendar year (years BC numbered 0, -1, -2, ...)
        gm: Calendar month (1 to 12)
        gd: Calendar day of the month M (1 to 28/29/30/31)
    */

    d2g = function(jdn) {
      var gd, gm, gy, i, j;
      j = 4 * jdn + 139361631;
      j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
      i = div(mod(j, 1461), 4) * 5 + 308;
      gd = div(mod(i, 153), 5) + 1;
      gm = mod(div(i, 153), 12) + 1;
      gy = div(j, 1461) - 100100 + div(8 - gm, 6);
      return {
        gy: gy,
        gm: gm,
        gd: gd
      };
    };
    return jMoment;
  });

}).call(this);
