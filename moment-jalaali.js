// moment-jalaali.js
// author: Behrang Noruzi Niya
// license: MIT

'use strict';

/************************************
 Expose Moment Jalaali
 ************************************/
(function (root, factory) {
    /* global define */
    if (typeof define === 'function' && define.amd) {
        define(['moment'], function (moment) {
            root.moment = factory(moment)
            return root.moment
        })
    } else if (typeof exports === 'object') {
        module.exports = factory(require('moment'))
    } else {
        root.moment = factory(root.moment)
    }
})(this, function (moment) { // jshint ignore:line

    if (moment == null) {
        throw new Error('Cannot find moment')
    }

    /************************************
     Constants
     ************************************/

    var formattingTokens = /(\[[^\[]*\])|(\\)?j(Mo|MM?M?M?|Do|DDDo|DD?D?D?|w[o|w]?|YYYYY|YYYY|YY|gg(ggg?)?|)|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g
        , localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g

        , parseTokenOneOrTwoDigits = /\d\d?/
        , parseTokenOneToThreeDigits = /\d{1,3}/
        , parseTokenThreeDigits = /\d{3}/
        , parseTokenFourDigits = /\d{1,4}/
        , parseTokenSixDigits = /[+\-]?\d{1,6}/
        , parseTokenWord = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i
        , parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i
        , parseTokenT = /T/i
        , parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/

        , unitAliases =
        { jm: 'jmonth'
            , jy: 'jyear'
        }

        , formatFunctions = {}

        , ordinalizeTokens = 'DDD w M D'.split(' ')
        , paddedTokens = 'M D w'.split(' ')

        , formatTokenFunctions =
        { jM: function () {
            return this.jMonth() + 1
        }
            , jMMM: function (format) {
            return this.lang().jMonthsShort(this, format)
        }
            , jMMMM: function (format) {
            return this.lang().jMonths(this, format)
        }
            , jD: function () {
            return this.jDate()
        }
            , jDDD: function () {
            return this.jDayOfYear()
        }
            , jw: function () {
            return this.jWeek()
        }
            , jYY: function () {
            return leftZeroFill(this.jYear() % 100, 2)
        }
            , jYYYY: function () {
            return leftZeroFill(this.jYear(), 4)
        }
            , jYYYYY: function () {
            return leftZeroFill(this.jYear(), 5)
        }
            , jgg: function () {
            return leftZeroFill(this.jWeekYear() % 100, 2)
        }
            , jgggg: function () {
            return this.jWeekYear()
        }
            , jggggg: function () {
            return leftZeroFill(this.jWeekYear(), 5)
        }
        }
        , i

    function padToken(func, count) {
        return function (a) {
            return leftZeroFill(func.call(this, a), count)
        }
    }
    function ordinalizeToken(func, period) {
        return function (a) {
            return this.lang().ordinal(func.call(this, a), period)
        }
    }

    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop()
        formatTokenFunctions['j' + i + 'o'] = ordinalizeToken(formatTokenFunctions['j' + i], i)
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop()
        formatTokenFunctions['j' + i + i] = padToken(formatTokenFunctions['j' + i], 2)
    }
    formatTokenFunctions.jDDDD = padToken(formatTokenFunctions.jDDD, 3)

    /************************************
     Helpers
     ************************************/

    function extend(a, b) {
        var key
        for (key in b)
            if (b.hasOwnProperty(key))
                a[key] = b[key]
        return a
    }

    function leftZeroFill(number, targetLength) {
        var output = number + ''
        while (output.length < targetLength)
            output = '0' + output
        return output
    }

    function isArray(input) {
        return Object.prototype.toString.call(input) === '[object Array]'
    }

    function compareArrays(array1, array2) {
        var len = Math.min(array1.length, array2.length)
            , lengthDiff = Math.abs(array1.length - array2.length)
            , diffs = 0
            , i
        for (i = 0; i < len; i += 1)
            if (~~array1[i] !== ~~array2[i])
                diffs += 1
        return diffs + lengthDiff
    }

    function normalizeUnits(units) {
        return units ? unitAliases[units] || units.toLowerCase().replace(/(.)s$/, '$1') : units
    }

    function setDate(moment, year, month, date) {
        var utc = moment._isUTC ? 'UTC' : ''
        moment._d['set' + utc + 'FullYear'](year)
        moment._d['set' + utc + 'Month'](month)
        moment._d['set' + utc + 'Date'](date)
    }

    function objectCreate(parent) {
        function F() {}
        F.prototype = parent
        return new F()
    }

    function getPrototypeOf(object) {
        if (Object.getPrototypeOf)
            return Object.getPrototypeOf(object)
        else if (''.__proto__) // jshint ignore:line
            return object.__proto__ // jshint ignore:line
        else
            return object.constructor.prototype
    }

    /************************************
     Languages
     ************************************/
    extend(getPrototypeOf(moment.langData()),
        { _jMonths: [ 'Farvardin'
            , 'Ordibehesht'
            , 'Khordaad'
            , 'Tir'
            , 'Amordaad'
            , 'Shahrivar'
            , 'Mehr'
            , 'Aabaan'
            , 'Aazar'
            , 'Dey'
            , 'Bahman'
            , 'Esfand'
        ]
            , jMonths: function (m) {
            return this._jMonths[m.jMonth()]
        }

            , _jMonthsShort:  [ 'Far'
            , 'Ord'
            , 'Kho'
            , 'Tir'
            , 'Amo'
            , 'Sha'
            , 'Meh'
            , 'Aab'
            , 'Aaz'
            , 'Dey'
            , 'Bah'
            , 'Esf'
        ]
            , jMonthsShort: function (m) {
            return this._jMonthsShort[m.jMonth()]
        }

            , jMonthsParse: function (monthName) {
            var i
                , mom
                , regex
            if (!this._jMonthsParse)
                this._jMonthsParse = []
            for (i = 0; i < 12; i += 1) {
                // Make the regex if we don't have it already.
                if (!this._jMonthsParse[i]) {
                    mom = jMoment([2000, (2 + i) % 12, 25])
                    regex = '^' + this.jMonths(mom, '') + '|^' + this.jMonthsShort(mom, '')
                    this._jMonthsParse[i] = new RegExp(regex.replace('.', ''), 'i')
                }
                // Test the regex.
                if (this._jMonthsParse[i].test(monthName))
                    return i
            }
        }
        }
    )

    /************************************
     Formatting
     ************************************/

    function makeFormatFunction(format) {
        var array = format.match(formattingTokens)
            , length = array.length
            , i

        for (i = 0; i < length; i += 1)
            if (formatTokenFunctions[array[i]])
                array[i] = formatTokenFunctions[array[i]]

        return function (mom) {
            var output = ''
            for (i = 0; i < length; i += 1)
                output += array[i] instanceof Function ? '[' + array[i].call(mom, format) + ']' : array[i]
            return output
        }
    }

    /************************************
     Parsing
     ************************************/

    function getParseRegexForToken(token, config) {
        switch (token) {
            case 'jDDDD':
                return parseTokenThreeDigits
            case 'jYYYY':
                return parseTokenFourDigits
            case 'jYYYYY':
                return parseTokenSixDigits
            case 'jDDD':
                return parseTokenOneToThreeDigits
            case 'jMMM':
            case 'jMMMM':
                return parseTokenWord
            case 'jMM':
            case 'jDD':
            case 'jYY':
            case 'jM':
            case 'jD':
                return parseTokenOneOrTwoDigits
            case 'DDDD':
                return parseTokenThreeDigits
            case 'YYYY':
                return parseTokenFourDigits
            case 'YYYYY':
                return parseTokenSixDigits
            case 'S':
            case 'SS':
            case 'SSS':
            case 'DDD':
                return parseTokenOneToThreeDigits
            case 'MMM':
            case 'MMMM':
            case 'dd':
            case 'ddd':
            case 'dddd':
                return parseTokenWord
            case 'a':
            case 'A':
                return moment.langData(config._l)._meridiemParse
            case 'X':
                return parseTokenTimestampMs
            case 'Z':
            case 'ZZ':
                return parseTokenTimezone
            case 'T':
                return parseTokenT
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
                return parseTokenOneOrTwoDigits
            default:
                return new RegExp(token.replace('\\', ''))
        }
    }

    function addTimeToArrayFromToken(token, input, config) {
        var a
            , datePartArray = config._a

        switch (token) {
            case 'jM':
            case 'jMM':
                datePartArray[1] = input == null ? 0 : ~~input - 1
                break
            case 'jMMM':
            case 'jMMMM':
                a = moment.langData(config._l).jMonthsParse(input)
                if (a != null)
                    datePartArray[1] = a
                else
                    config._isValid = false
                break
            case 'jD':
            case 'jDD':
            case 'jDDD':
            case 'jDDDD':
                if (input != null)
                    datePartArray[2] = ~~input
                break
            case 'jYY':
                datePartArray[0] = ~~input + (~~input > 47 ? 1300 : 1400)
                break
            case 'jYYYY':
            case 'jYYYYY':
                datePartArray[0] = ~~input
        }
        if (input == null)
            config._isValid = false
    }

    function dateFromArray(config) {
        var g
            , j
            , jy = config._a[0]
            , jm = config._a[1]
            , jd = config._a[2]

        if ((jy == null) && (jm == null) && (jd == null))
            return [0, 0, 1]
        jy = jy || 0
        jm = jm || 0
        jd = jd || 1
        if (jd < 1 || jd > jMoment.jDaysInMonth(jy, jm))
            config._isValid = false
        g = toGregorian(jy, jm, jd)
        j = toJalaali(g.gy, g.gm, g.gd)
        config._jDiff = 0
        if (~~j.jy !== jy)
            config._jDiff += 1
        if (~~j.jm !== jm)
            config._jDiff += 1
        if (~~j.jd !== jd)
            config._jDiff += 1
        return [g.gy, g.gm, g.gd]
    }

    function makeDateFromStringAndFormat(config) {
        var tokens = config._f.match(formattingTokens)
            , string = config._i
            , len = tokens.length
            , i
            , token
            , parsedInput

        config._a = []

        for (i = 0; i < len; i += 1) {
            token = tokens[i]
            parsedInput = (getParseRegexForToken(token, config).exec(string) || [])[0]
            if (parsedInput)
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length)
            if (formatTokenFunctions[token])
                addTimeToArrayFromToken(token, parsedInput, config)
        }
        if (string)
            config._il = string
        return dateFromArray(config)
    }

    function makeDateFromStringAndArray(config, utc) {
        var tempConfig
            , tempMoment
            , bestMoment
            , scoreToBeat = 99
            , len = config._f.length
            , i
            , currentScore
            , format
        // TODO: Check this function.
        for (i = 0; i < len; i += 1) {
            format = config._f[i]
            tempConfig = extend({}, config)
            tempConfig._f = format
            tempMoment = makeMoment(config._i, format, config._l, utc)

            currentScore = compareArrays(tempMoment._a, tempMoment.toArray())
            currentScore += tempMoment._jDiff
            if (tempMoment._il)
                currentScore += tempMoment._il.length
            if (currentScore < scoreToBeat) {
                scoreToBeat = currentScore
                bestMoment = tempMoment
            }
        }
        return bestMoment
    }

    function removeParsedTokens(config) {
        var string = config._i
            , input = ''
            , format = ''
            , array = config._f.match(formattingTokens)
            , len = array.length
            , i
            , match
            , parsed

        for (i = 0; i < len; i += 1) {
            match = array[i]
            parsed = (getParseRegexForToken(match, config).exec(string) || [])[0]
            if (parsed)
                string = string.slice(string.indexOf(parsed) + parsed.length)
            if (!(formatTokenFunctions[match] instanceof Function)) {
                format += match
                if (parsed)
                    input += parsed
            }
        }
        config._i = input
        config._f = format
    }

    /************************************
     Week of Year
     ************************************/

    function jWeekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek
            , daysToDayOfWeek = firstDayOfWeekOfYear - mom.day()
            , adjustedMoment

        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7
        }
        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7
        }
        adjustedMoment = jMoment(mom).add('d', daysToDayOfWeek)
        return  { week: Math.ceil(adjustedMoment.jDayOfYear() / 7)
            , year: adjustedMoment.jYear()
        }
    }

    /************************************
     Top Level Functions
     ************************************/

    function makeMoment(input, format, lang, utc) {
        var config =
            { _i: input
                , _f: format
                , _l: lang
            }
            , date
            , m
            , jm
        if (format) {
            if (isArray(format)) {
                return makeDateFromStringAndArray(config, utc)
            } else {
                date = makeDateFromStringAndFormat(config)
                removeParsedTokens(config)
                format = 'YYYY-MM-DD-' + config._f
                input = leftZeroFill(date[0], 4) + '-'
                    + leftZeroFill(date[1] + 1, 2) + '-'
                    + leftZeroFill(date[2], 2) + '-'
                    + config._i
            }
        }
        if (utc)
            m = moment.utc(input, format, lang)
        else
            m = moment(input, format, lang)
        if (config._isValid === false)
            m._isValid = false
        m._jDiff = config._jDiff || 0
        jm = objectCreate(jMoment.fn)
        extend(jm, m)
        return jm
    }

    function jMoment(input, format, lang) {
        return makeMoment(input, format, lang, false)
    }

    extend(jMoment, moment)
    jMoment.fn = objectCreate(moment.fn)

    jMoment.utc = function (input, format, lang) {
        return makeMoment(input, format, lang, true)
    }

    /************************************
     jMoment Prototype
     ************************************/

    jMoment.fn.format = function (format) {
        var i
            , replace
            , me = this

        if (format) {
            i = 5
            replace = function (input) {
                return me.lang().longDateFormat(input) || input
            }
            while (i > 0 && localFormattingTokens.test(format)) {
                i -= 1
                format = format.replace(localFormattingTokens, replace)
            }
            if (!formatFunctions[format]) {
                formatFunctions[format] = makeFormatFunction(format)
            }
            format = formatFunctions[format](this)
        }
        return moment.fn.format.call(this, format)
    }

    jMoment.fn.jYear = function (input) {
        var lastDay
            , j
            , g
        if (typeof input === 'number') {
            j = toJalaali(this.year(), this.month(), this.date())
            lastDay = Math.min(j.jd, jMoment.jDaysInMonth(input, j.jm))
            g = toGregorian(input, j.jm, lastDay)
            setDate(this, g.gy, g.gm, g.gd)
            moment.updateOffset(this)
            return this
        } else {
            return toJalaali(this.year(), this.month(), this.date()).jy
        }
    }

    jMoment.fn.jMonth = function (input) {
        var lastDay
            , j
            , g
        if (input != null) {
            if (typeof input === 'string') {
                input = this.lang().jMonthsParse(input)
                if (typeof input !== 'number')
                    return this
            }
            j = toJalaali(this.year(), this.month(), this.date())
            lastDay = Math.min(j.jd, jMoment.jDaysInMonth(j.jy, input))
            g = toGregorian(j.jy, input, lastDay)
            setDate(this, g.gy, g.gm, g.gd)
            moment.updateOffset(this)
            return this
        } else {
            return toJalaali(this.year(), this.month(), this.date()).jm
        }
    }

    jMoment.fn.jDate = function (input) {
        var j
            , g
        if (typeof input === 'number') {
            j = toJalaali(this.year(), this.month(), this.date())
            g = toGregorian(j.jy, j.jm, input)
            setDate(this, g.gy, g.gm, g.gd)
            moment.updateOffset(this)
            return this
        } else {
            return toJalaali(this.year(), this.month(), this.date()).jd
        }
    }

    jMoment.fn.jDayOfYear = function (input) {
        var dayOfYear = Math.round((jMoment(this).startOf('day') - jMoment(this).startOf('jYear')) / 864e5) + 1
        return input == null ? dayOfYear : this.add('d', input - dayOfYear)
    }

    jMoment.fn.jWeek = function (input) {
        var week = jWeekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).week
        return input == null ? week : this.add('d', (input - week) * 7)
    }

    jMoment.fn.jWeekYear = function (input) {
        var year = jWeekOfYear(this, this.lang()._week.dow, this.lang()._week.doy).year
        return input == null ? year : this.add('y', input - year)
    }

    jMoment.fn.add = function (val, units) {
        var temp
        if (typeof val === 'string') {
            temp = val
            val = units
            units = temp
        }
        units = normalizeUnits(units)
        if (units === 'jyear') {
            this.jYear(this.jYear() + val)
        } else if (units === 'jmonth') {
            this.jMonth(this.jMonth() + val)
        } else {
            moment.fn.add.call(this, units, val)
        }
        return this
    }

    jMoment.fn.startOf = function (units) {
        units = normalizeUnits(units)
        if (units === 'jyear' || units === 'jmonth') {
            if (units === 'jyear') {
                this.jMonth(0)
            }
            this.jDate(1)
            this.hours(0)
            this.minutes(0)
            this.seconds(0)
            this.milliseconds(0)
            return this
        } else {
            return moment.fn.startOf.call(this, units)
        }
    }

    jMoment.fn.clone = function () {
        return jMoment(this)
    }

    jMoment.fn.jYears = jMoment.fn.jYear
    jMoment.fn.jMonths = jMoment.fn.jMonth
    jMoment.fn.jDates = jMoment.fn.jDate
    jMoment.fn.jWeeks = jMoment.fn.jWeek

    /************************************
     jMoment Statics
     ************************************/

    jMoment.jDaysInMonth = function (year, month) {
        if (month < 6) {
            return 31
        } else if (month < 11) {
            return 30
        } else if (jMoment.jIsLeapYear(year)) {
            return 30
        } else {
            return 29
        }
    }

    jMoment.jIsLeapYear = function (year) {
        return jalCal(year).leap === 0
    }

    jMoment.loadPersian = function () {
        moment.lang('fa'
            , { months: ('ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر').split('_')
                , monthsShort: ('ژانویه_فوریه_مارس_آوریل_مه_ژوئن_ژوئیه_اوت_سپتامبر_اکتبر_نوامبر_دسامبر').split('_')
                , weekdays: ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_آدینه_شنبه').split('_')
                , weekdaysShort: ('یک\u200cشنبه_دوشنبه_سه\u200cشنبه_چهارشنبه_پنج\u200cشنبه_آدینه_شنبه').split('_')
                , weekdaysMin: 'ی_د_س_چ_پ_آ_ش'.split('_')
                , longDateFormat:
                { LT: 'HH:mm'
                    , L: 'jYYYY/jMM/jDD'
                    , LL: 'jD jMMMM jYYYY'
                    , LLL: 'jD jMMMM jYYYY LT'
                    , LLLL: 'dddd، jD jMMMM jYYYY LT'
                }
                , calendar:
                { sameDay: '[امروز ساعت] LT'
                    , nextDay: '[فردا ساعت] LT'
                    , nextWeek: 'dddd [ساعت] LT'
                    , lastDay: '[دیروز ساعت] LT'
                    , lastWeek: 'dddd [ی پیش ساعت] LT'
                    , sameElse: 'L'
                }
                , relativeTime:
                { future: 'در %s'
                    , past: '%s پیش'
                    , s: 'چند ثانیه'
                    , m: '1 دقیقه'
                    , mm: '%d دقیقه'
                    , h: '1 ساعت'
                    , hh: '%d ساعت'
                    , d: '1 روز'
                    , dd: '%d روز'
                    , M: '1 ماه'
                    , MM: '%d ماه'
                    , y: '1 سال'
                    , yy: '%d سال'
                }
                , ordinal: '%dم'
                , week:
                { dow: 6 // Saturday is the first day of the week.
                    , doy: 12 // The week that contains Jan 1st is the first week of the year.
                }
                , meridiem: function (hour) {
                    return hour < 12 ? 'ق.ظ' : 'ب.ظ'
                }
                , jMonths: ('فروردین_اردیبهشت_خرداد_تیر_امرداد_شهریور_مهر_آبان_آذر_دی_بهمن_اسفند').split('_')
                , jMonthsShort: 'فرو_ارد_خرد_تیر_امر_شهر_مهر_آبا_آذر_دی_بهم_اسف'.split('_')
            }
        )
    }

    function toJalaali(gy, gm, gd) {
        var j = d2j(g2d(gy, gm + 1, gd))
        j.jm -= 1
        return j
    }

    function toGregorian(jy, jm, jd) {
        var g = d2g(j2d(jy, jm + 1, jd))
        g.gm -= 1
        return g
    }

    jMoment.jConvert =  { toJalaali: toJalaali
        , toGregorian: toGregorian
    }

    return jMoment

    /************************************
     Jalaali Conversion
     ************************************/

    /*
     Utility helper functions.
     */

    function div(a, b) {
        return ~~(a / b)
    }

    function mod(a, b) {
        return a - ~~(a / b) * b
    }

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

    function jalCal(jy) {
        // Jalaali years starting the 33-year rule.
        var breaks =  [ -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210
                , 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
            ]
            , bl = breaks.length
            , gy = jy + 621
            , leapJ = -14
            , jp = breaks[0]
            , jm
            , jump
            , leap
            , leapG
            , march
            , n
            , i

        if (jy < jp || jy >= breaks[bl - 1])
            throw new Error('Invalid Jalaali year ' + jy)

        // Find the limiting years for the Jalaali year jy.
        for (i = 1; i < bl; i += 1) {
            jm = breaks[i]
            jump = jm - jp
            if (jy < jm)
                break
            leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4)
            jp = jm
        }
        n = jy - jp

        // Find the number of leap years from AD 621 to the beginning
        // of the current Jalaali year in the Persian calendar.
        leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4)
        if (mod(jump, 33) === 4 && jump - n === 4)
            leapJ += 1

        // And the same in the Gregorian calendar (until the year gy).
        leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150

        // Determine the Gregorian date of Farvardin the 1st.
        march = 20 + leapJ - leapG

        // Find how many years have passed since the last leap year.
        if (jump - n < 6)
            n = n - jump + div(jump + 4, 33) * 33
        leap = mod(mod(n + 1, 33) - 1, 4)
        if (leap === -1) {
            leap = 4
        }

        return  { leap: leap
            , gy: gy
            , march: march
        }
    }

    /*
     Converts a date of the Jalaali calendar to the Julian Day number.

     @param jy Jalaali year (1 to 3100)
     @param jm Jalaali month (1 to 12)
     @param jd Jalaali day (1 to 29/31)
     @return Julian Day number
     */

    function j2d(jy, jm, jd) {
        var r = jalCal(jy)
        return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1
    }

    /*
     Converts the Julian Day number to a date in the Jalaali calendar.

     @param jdn Julian Day number
     @return
     jy: Jalaali year (1 to 3100)
     jm: Jalaali month (1 to 12)
     jd: Jalaali day (1 to 29/31)
     */

    function d2j(jdn) {
        var gy = d2g(jdn).gy // Calculate Gregorian year (gy).
            , jy = gy - 621
            , r = jalCal(jy)
            , jdn1f = g2d(gy, 3, r.march)
            , jd
            , jm
            , k

        // Find number of days that passed since 1 Farvardin.
        k = jdn - jdn1f
        if (k >= 0) {
            if (k <= 185) {
                // The first 6 months.
                jm = 1 + div(k, 31)
                jd = mod(k, 31) + 1
                return  { jy: jy
                    , jm: jm
                    , jd: jd
                }
            } else {
                // The remaining months.
                k -= 186
            }
        } else {
            // Previous Jalaali year.
            jy -= 1
            k += 179
            if (r.leap === 1)
                k += 1
        }
        jm = 7 + div(k, 30)
        jd = mod(k, 30) + 1
        return  { jy: jy
            , jm: jm
            , jd: jd
        }
    }

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

    function g2d(gy, gm, gd) {
        var d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
            + div(153 * mod(gm + 9, 12) + 2, 5)
            + gd - 34840408
        d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
        return d
    }

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

    function d2g(jdn) {
        var j
            , i
            , gd
            , gm
            , gy
        j = 4 * jdn + 139361631
        j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
        i = div(mod(j, 1461), 4) * 5 + 308
        gd = div(mod(i, 153), 5) + 1
        gm = mod(div(i, 153), 12) + 1
        gy = div(j, 1461) - 100100 + div(8 - gm, 6)
        return  { gy: gy
            , gm: gm
            , gd: gd
        }
    }

})
