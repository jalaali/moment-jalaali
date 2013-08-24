'use strict'

###
  Expose Moment Jalaali.
###
((root, factory) ->
  if typeof define is 'function' and define.amd
    define ['moment'], factory
  else if typeof exports is 'object'
    module.exports = factory require 'moment'
  else
    root.moment = factory root.moment
  return
) this, (moment) ->

  throw new Error 'Cannot find moment' unless moment?

  ###
      Constants
  ###

  formattingTokens =
    ///
      (\[[^\[]*\]) | # anything between []
      (\\)? # escape formatting by an adding a \
      j( # tokens should start with j
        Mo | # month
        MM?M?M? | # month
        Do | # day of month
        DDDo | # day of year
        DD?D?D? | # day of month or year
        w[o|w]? | # week of year
        YYYYY | # year
        YYYY | # year
        YY | # year
        gg(ggg?)? | # week year
      ) |
      . # any other character
    ///g
  localFormattingTokens =
    ///
      (\[[^\[]*\]) | # anything between []
      (\\)? # escape formatting by adding a \
      (LT|LL?L?L?|l{1,4}) # local format tokens
    ///g

  parseTokenOneOrTwoDigits = /\d\d?/ # 0 - 99
  parseTokenOneToThreeDigits = /\d{1,3}/ # 0 - 999
  parseTokenThreeDigits = /\d{3}/ # 000 - 999
  parseTokenFourDigits = /\d{1,4}/ # 0 - 9999
  parseTokenSixDigits = /[+\-]?\d{1,6}/ # -999,999 - 999,999
  parseTokenWord =
    # any word (or two) characters or numbers including
    # two/three word month in arabic.
    ///
      [0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+ |
      [\u0600-\u06FF/]+(\s*?[\u0600-\u06FF]+){1,2}
    ///i


  unitAliases =
    jm: 'jmonth'
    jy: 'jyear'

  formatFunctions = {}

  ordinalizeTokens = 'DDD w M D'.split(' ')

  paddedTokens = 'M D w'.split(' ')

  formatTokenFunctions =
    jM: -> @jMonth() + 1
    jMMM: (format) -> @lang().jMonthsShort this, format
    jMMMM: (format) -> @lang().jMonths this, format
    jD: -> @jDate()
    jDDD: -> @jDayOfYear()
    jw: -> @jWeek()
    jYY: -> leftZeroFill @jYear() % 100, 2
    jYYYY: -> leftZeroFill @jYear(), 4
    jYYYYY: -> leftZeroFill @jYear(), 5
    jgg: -> leftZeroFill @jWeekYear() % 100, 2
    jgggg: -> @jWeekYear()
    jggggg: -> leftZeroFill @jWeekYear(), 5

  padToken = (func, count) ->
    (a) -> leftZeroFill func.call(this, a), count

  ordinalizeToken = (func, period) ->
    (a) -> @lang().ordinal func.call(this, a), period

  do -> # Needed to make `i` a cal variable
    while ordinalizeTokens.length
      i = ordinalizeTokens.pop()
      formatTokenFunctions['j' + i + 'o'] =
        ordinalizeToken formatTokenFunctions['j' + i], i

    while paddedTokens.length
      i = paddedTokens.pop()
      formatTokenFunctions['j' + i + i] = padToken formatTokenFunctions['j' + i], 2
    return

  formatTokenFunctions.jDDDD = padToken formatTokenFunctions.jDDD, 3

  ###
      Helpers
  ###

  leftZeroFill = (number, targetLength) ->
    output = number + ''
    output = '0' + output while output.length < targetLength
    output

  normalizeUnits = (units) ->
    if units
      unitAliases[units] or units.toLowerCase().replace /(.)s$/, '$1'
    else
      units

  setDate = (year, month, date) ->
    utc = if @_isUTC then 'UTC' else ''
    @_d['set' + utc + 'FullYear'](year)
    @_d['set' + utc + 'Month'](month)
    @_d['set' + utc + 'Date'](date)
    return

  extend = (a, b) ->
    a[key] = value for own key, value of b
    a

  isArray = (o) -> Object.prototype.toString.call(o) is '[object Array]'

  ###
      Languages
  ###

  extend moment.langData().__proto__,
    _jMonths: [
      'Farvardin'
      'Ordibehesht'
      'Khordaad'
      'Tir'
      'Amordaad'
      'Shahrivar'
      'Mehr'
      'Aabaan'
      'Aazar'
      'Dey'
      'Bahman'
      'Esfand'
    ]
    jMonths: (m) -> @_jMonths[m.jMonth()]

    _jMonthsShort: [
      'Far'
      'Ord'
      'Kho'
      'Tir'
      'Amo'
      'Sha'
      'Meh'
      'Aab'
      'Aaz'
      'Dey'
      'Bah'
      'Esf'
    ]
    jMonthsShort: (m) -> @_jMonthsShort[m.jMonth()]

    jMonthsParse: (monthName) ->
      @_jMonthsParse = [] unless @_jMonthsParse
      for i in [0...12]
        # make the regex if we don't have it already
        unless @_jMonthsParse[i]
          mom = jMoment [2000, (2 + i) % 12, 25]
          regex = '^' + @jMonths(mom, '') + '|^' + @jMonthsShort(mom, '')
          @_jMonthsParse[i] = new RegExp regex.replace('.', ''), 'i'
        # test the regex
        if @_jMonthsParse[i].test monthName
          return i


  ###
      Formatting
  ###

  makeFormatFunction = (format) ->
    array = format.match formattingTokens
    for match, i in array when formatTokenFunctions[match]
      array[i] = formatTokenFunctions[match]

    (mom) ->
      output = ''
      for match, i in array
        if match instanceof Function
          output += '[' + match.call(mom, format) + ']'
        else
          output += match
      output

  ###
      Week of Year
  ###

  jWeekOfYear = (mom, firstDayOfWeek, firstDayOfWeekOfYear) ->
    end = firstDayOfWeekOfYear - firstDayOfWeek
    daysToDayOfWeek = firstDayOfWeekOfYear - mom.day()

    daysToDayOfWeek -= 7 if daysToDayOfWeek > end

    daysToDayOfWeek += 7 if daysToDayOfWeek < end - 7

    adjustedMoment = jMoment(mom).add 'd', daysToDayOfWeek

    week: Math.ceil adjustedMoment.jDayOfYear() / 7
    year: adjustedMoment.jYear()

  ###
      Parsing
  ###

  escapeParseTokens = (format) ->
    array = format.match formattingTokens
    for match, i in array when formatTokenFunctions[match]
      array[i] = '[' + match + ']'
    array.join ''

  ###
    Get the regex to find the next token.
  ###
  getParseRegexForToken = (token, config) ->
    switch token
      when 'jDDDD' then parseTokenThreeDigits
      when 'jYYYY' then parseTokenFourDigits
      when 'jYYYYY' then parseTokenSixDigits
      when 'jDDD' then parseTokenOneToThreeDigits
      when 'jMMM', 'jMMMM' then parseTokenWord
      when 'jMM', 'jDD', 'jYY', 'jM', 'jD' then parseTokenOneOrTwoDigits
      else new RegExp token.replace '\\', ''

  ###
    Function to convert string input to date.
  ###
  addTimeToArrayFromToken = (token, input, config) ->
    datePartArray = config._a
    switch token
      when 'jM', 'jMM'
        datePartArray[1] = unless input? then 0 else ~~input - 1
      when 'jMMM', 'jMMMM'
        a = moment.langData(config._l).jMonthsParse input
        # if we didn't find a month name, mark the date as invalid.
        if a?
          datePartArray[1] = a
        else
          config._isValid = no
      when 'jD', 'jDD', 'jDDD', 'jDDDD'
        datePartArray[2] = ~~input if input?
      when 'jYY'
        datePartArray[0] = ~~input + (if ~~input > 47 then 1300 else 1400)
      when 'jYYYY', 'jYYYYY'
        datePartArray[0] = ~~input
    # if the input is null, the date is not valid
    unless input?
      config._isValid = no
    return

  dateFromArray = (config) ->
    [jy, jm, jd] = config._a
    unless jy? or jm? or jd?
      return [0, 0, 1]
    jy or= 0
    jm or= 0
    jd or= 1
    config._isValid = no unless 1 <= jd <= jMoment.jDaysInMonth jy, jm
    g = toGregorian jy, jm, jd
    [g.gy, g.gm, g.gd]

  makeDateFromStringAndFormat = (config) ->
    tokens = config._f.match formattingTokens
    string = config._i
    config._a = []
    for token in tokens
      parsedInput = (getParseRegexForToken(token, config).exec(string) or [])[0]
      if parsedInput
        string = string.slice string.indexOf(parsedInput) + parsedInput.length
      # don't parse if it's not a know token
      if formatTokenFunctions[token]
        addTimeToArrayFromToken token, parsedInput, config
    # add remaining unparsed input to the string
    if string
      config._il = string
    dateFromArray config

  makeMoment = (input, format, lang, utc) ->
    config =
      _i: input
      _f: format
      _l: lang
    if format
      if isArray format
        date = makeDateFromStringAndArray config
        format[i] = 'YYYY-MM-DD-' + escapeParseTokens(f) for f, i in format
      else
        date = makeDateFromStringAndFormat config
        format = 'YYYY-MM-DD-' + escapeParseTokens format
      input = leftZeroFill(date[0], 4) + '-' +
          leftZeroFill(date[1] + 1, 2) + '-' +
          leftZeroFill(date[2], 2) + '-' + input
    if utc
      m = moment.utc.call this, input, format, lang
    else
      m = moment.call this, input, format, lang
    m._isValid = no if config._isValid is no
    m.__proto__ = jMoment.fn
    m

  jMoment = (input, format, lang) -> makeMoment input, format, lang, no

  extend jMoment, moment
  jMoment.fn = {}
  jMoment.fn.__proto__ = moment.fn

  jMoment.utc = (input, format, lang) -> makeMoment input, format, lang, yes

  ###
      Methods
  ###

  jMoment.fn.format = (format) ->
    if format
      i = 5
      replace = (input) => @lang().longDateFormat(input) or input
      while i > 0 and localFormattingTokens.test format
        i -= 1
        format = format.replace localFormattingTokens, replace
      unless formatFunctions[format]
        formatFunctions[format] = makeFormatFunction format
      format = formatFunctions[format] this
    moment.fn.format.call this, format

  jMoment.fn.jYear = (input) ->
    if typeof input is 'number'
      {jy, jm, jd} = toJalaali @year(), @month(), @date()
      lastDay = Math.min jd, jMoment.jDaysInMonth input, jm
      {gy, gm, gd} = toGregorian input, jm, lastDay
      setDate.call this, gy, gm, gd
      moment.updateOffset this
      this
    else
      toJalaali(@year(), @month(), @date()).jy
  jMoment.fn.jYears = jMoment.fn.jYear

  jMoment.fn.jMonth = (input) ->
    if input?
      if typeof input is 'string'
        input = @lang().jMonthsParse input
        if typeof input isnt 'number' then return this
      {jy, jm, jd} = toJalaali @year(), @month(), @date()
      lastDay = Math.min jd, jMoment.jDaysInMonth jy, input
      {gy, gm, gd} = toGregorian jy, input, lastDay
      setDate.call this, gy, gm, gd
      moment.updateOffset this
      this
    else
      toJalaali(@year(), @month(), @date()).jm
  jMoment.fn.jMonths = jMoment.fn.jMonth

  jMoment.fn.jDate = (input) ->
    if typeof input is 'number'
      {jy, jm, jd} = toJalaali @year(), @month(), @date()
      {gy, gm, gd} = toGregorian jy, jm, input
      setDate.call this, gy, gm, gd
      moment.updateOffset this
      this
    else
      toJalaali(@year(), @month(), @date()).jd
  jMoment.fn.jDates = jMoment.fn.jDate

  jMoment.fn.jDayOfYear = (input) ->
    dayOfYear = Math.round(
      (jMoment(this).startOf('day') - jMoment(this).startOf('jYear')) / 864e5
    ) + 1
    unless input? then dayOfYear else @add 'd', input - dayOfYear

  jMoment.fn.jWeek = (input) ->
    week = jWeekOfYear(this, @lang()._week.dow, @lang()._week.doy).week
    unless input? then week else @add 'd', (input - week) * 7
  jMoment.fn.jWeeks = jMoment.fn.jWeek

  jMoment.fn.jWeekYear = (input) ->
    year = jWeekOfYear(this, @lang()._week.dow, @lang()._week.doy).year
    unless input? then year else @add 'y', input - year

  jMoment.fn.startOf = (units) ->
    units = normalizeUnits units
    if units in ['jyear', 'jmonth']
      if units is 'jyear'
        @jMonth 0
      @jDate 1
      @hours 0
      @minutes 0
      @seconds 0
      @milliseconds 0
      this
    else
      moment.fn.startOf.call this, units

  ###
      Statics
  ###

  jMoment.jDaysInMonth = (year, month) ->
    if month < 6 then 31
    else if month < 11 then 30
    else if jMoment.jIsLeapYear year then 30
    else 29

  jMoment.jIsLeapYear = (year) -> jalCal(year).leap is 0

  ###
      Conversion
  ###

  toJalaali = (gy, gm, gd) ->
    j = d2j g2d gy, gm + 1, gd
    j.jm -= 1
    j

  toGregorian = (jy, jm, jd) ->
    g = d2g j2d jy, jm + 1, jd
    g.gm -= 1
    g

  jMoment.jConvert =
    toJalaali: toJalaali
    toGregorian: toGregorian

  ###
    Helper functions used in conversion.
  ###
  div = (a, b) -> ~~(a / b)
  mod = (a, b) -> a - ~~(a / b) * b

  ###
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
  ###
  jalCal = (jy) ->
    # Jalaali years starting the 33-year rule.
    breaks = [
      -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
      1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
    ]

    bl = breaks.length
    gy = jy + 621
    leapJ = -14
    jp = breaks[0]
    if jy < jp or jy >= breaks[bl - 1]
      throw new Error 'Invalid Jalaali year ' + jy

    # Find the limiting years for the Jalaali year jy.
    for jm in breaks[1...bl]
      jump = jm - jp
      break if jy < jm
      leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4)
      jp = jm
    n = jy - jp

    # Find the number of leap years from AD 621 to the beginning
    # of the current Jalaali year in the Persian calendar.
    leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4)
    leapJ += 1 if mod(jump, 33) is 4 and jump - n is 4

    # And the same in the Gregorian calendar (until the year gy).
    leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150

    # Determine the Gregorian date of Farvardin the 1st.
    march = 20 + leapJ - leapG

    # Find how many years have passed since the last leap year.
    if jump - n < 6
      n = n - jump + div(jump + 4, 33) * 33
    leap = mod(mod(n + 1, 33) - 1, 4)
    leap = 4 if leap is -1

    # Return results.
    leap: leap
    gy: gy
    march: march

  ###
    Converts a date of the Jalaali calendar to the Julian Day number.

    @param jy Jalaali year (1 to 3100)
    @param jm Jalaali month (1 to 12)
    @param jd Jalaali day (1 to 29/31)
    @return Julian Day number
  ###
  j2d = (jy, jm, jd) ->
    {leap, gy, march} = jalCal jy
    g2d(gy, 3, march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1

  ###
    Converts the Julian Day number to a date in the Jalaali calendar.

    @param jdn Julian Day number
    @return
      jy: Jalaali year (1 to 3100)
      jm: Jalaali month (1 to 12)
      jd: Jalaali day (1 to 29/31)
  ###
  d2j = (jdn) ->
    # Calculate Gregorian year (gy).
    {gy} = d2g jdn
    jy = gy - 621
    {leap, march} = jalCal jy
    jdn1f = g2d gy, 3, march

    # Find number of days that passed since 1 Farvardin.
    k = jdn - jdn1f
    if k >= 0
      if k <= 185
        # The first 6 months.
        jm = 1 + div(k, 31)
        jd = mod(k, 31) + 1
        return jy: jy, jm: jm, jd: jd
      else
        # The remaining months.
        k -= 186
    else
      # Previous Jalaali year.
      jy -= 1
      k += 179
      k += 1 if leap is 1
    jm = 7 + div(k, 30)
    jd = mod(k, 30) + 1
    jy: jy
    jm: jm
    jd: jd

  ###
    Calculates the Julian Day number from Gregorian or Julian
    calendar dates. This integer number corresponds to the noon of
    the date (i.e. 12 hours of Universal Time).
    The procedure was tested to be good since 1 March, -100100 (of both
    calendars) up to a few million years into the future.

    @param gy Calendar year (years BC numbered 0, -1, -2, ...)
    @param gm Calendar month (1 to 12)
    @param gd Calendar day of the month (1 to 28/29/30/31)
    @return Julian Day number
  ###
  g2d = (gy, gm, gd) ->
    d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4) +
        div(153 * mod(gm + 9, 12) + 2, 5) + gd - 34840408
    d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752
    d

  ###
    Calculates Gregorian and Julian calendar dates from the Julian Day number
    (jdn) for the period since jdn=-34839655 (i.e. the year -100100 of both
    calendars) to some millions years ahead of the present.

    @param jdn Julian Day number
    @return
      gy: Calendar year (years BC numbered 0, -1, -2, ...)
      gm: Calendar month (1 to 12)
      gd: Calendar day of the month M (1 to 28/29/30/31)
  ###
  d2g = (jdn) ->
    j = 4 * jdn + 139361631
    j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908
    i = div(mod(j, 1461), 4) * 5 + 308
    gd = div(mod(i, 153), 5) + 1
    gm = mod(div(i, 153), 12) + 1
    gy = div(j, 1461) - 100100 + div(8 - gm, 6)
    gy: gy
    gm: gm
    gd: gd

  jMoment
