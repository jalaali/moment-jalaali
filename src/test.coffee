'use strict'

chai = require 'chai'
moment = require 'moment'
require './moment-jalaali'

chai.should()

moment.lang 'en',
  week:
    dow: 6
    doy: 12
  longDateFormat:
    LT : "h:mm A",
    L : "jYYYY/jMM/jDD",
    LL : "jD jMMMM jYYYY",
    LLL : "jD jMMMM jYYYY LT",
    LLLL : "dddd, jD jMMMM jYYYY LT"

describe 'moment', ->

  describe '#format', ->

    it 'should work normally when there is no Jalaali token', ->
      m = moment '1981-08-17 07:10:20'
      m.format('YYYY-MM-DD hh:mm:ss').should.be.equal '1981-08-17 07:10:20'

    it 'should format to Jalaali with Jalaali tokens', ->
      m = moment '1981-08-17 07:10:20'
      m.format('jYYYY-jMM-jDD hh:mm:ss').should.be.equal '1360-05-26 07:10:20'

    it 'should format with mixed tokens', ->
      m = moment '1981-08-17'
      m.format('jYYYY/jMM/jDD = YYYY-MM-DD')
          .should.be.equal '1360/05/26 = 1981-08-17'

    it 'should format with jMo', ->
      m = moment '1981-08-17'
      m.format('jMo').should.be.equal '5th'

    it 'should format with jM', ->
      m = moment '1981-08-17'
      m.format('jM').should.be.equal '5'

    it 'should format with jMM', ->
      m = moment '1981-08-17'
      m.format('jMM').should.be.equal '05'

    it 'should format with jMMM', ->
      m = moment '1981-08-17'
      m.format('jMMM').should.be.equal 'Amo'

    it 'should format with jMMMM', ->
      m = moment '1981-08-17'
      m.format('jMMMM').should.be.equal 'Amordad'

    it 'should format with jDo', ->
      m = moment '1981-08-17'
      m.format('jDo').should.be.equal '26th'

    it 'should format with jD', ->
      m = moment '1981-08-17'
      m.format('jD').should.be.equal '26'

    it 'should format with jDD', ->
      m = moment '1981-08-17'
      m.format('jDD').should.be.equal '26'
      m = moment '1981-08-23'
      m.format('jDD').should.be.equal '01'

    it 'should format with jDDD', ->
      m = moment '1981-08-17'
      m.format('jDDD').should.be.equal '150'

    it 'should format with jDDDo', ->
      m = moment '1981-08-17'
      m.format('jDDDo').should.be.equal '150th'

    it 'should format with jDDDD', ->
      m = moment '1981-08-17'
      m.format('jDDDD').should.be.equal '150'
      m = moment '1981-03-21'
      m.format('jDDDD').should.be.equal '001'

    it 'should format with jwo', ->
      m = moment '1981-08-17'
      m.format('jwo').should.be.equal '22nd'

    it 'should format with jw', ->
      m = moment '1981-08-17'
      m.format('jw').should.be.equal '22'

    it 'should format with jww', ->
      m = moment '1981-08-17'
      m.format('jww').should.be.equal '22'
      m = moment '1981-04-23'
      m.format('jww').should.be.equal '05'

    it 'should format with jYY', ->
      m = moment '1981-08-17'
      m.format('jYY').should.be.equal '60'

    it 'should format with jYYYY', ->
      m = moment '1981-08-17'
      m.format('jYYYY').should.be.equal '1360'

    it 'should format with jYYYYY', ->
      m = moment '1981-08-17'
      m.format('jYYYYY').should.be.equal '01360'

    it 'should format with jgg', ->
      m = moment '1981-08-17'
      m.format('jgg').should.be.equal '60'

    it 'should format with jgggg', ->
      m = moment '1981-08-17'
      m.format('jgggg').should.be.equal '1360'

    it 'should format with jggggg', ->
      m = moment '1981-08-17'
      m.format('jggggg').should.be.equal '01360'

    it 'should work with long date formats too', ->
      m = moment '1981-08-17'
      m.format('LT').should.be.equal '12:00 AM'
      m.format('L').should.be.equal '1360/05/26'
      m.format('l').should.be.equal '1360/5/26'
      m.format('LL').should.be.equal '26 Amordad 1360'
      m.format('ll').should.be.equal '26 Amo 1360'
      m.format('LLL').should.be.equal '26 Amordad 1360 12:00 AM'
      m.format('lll').should.be.equal '26 Amo 1360 12:00 AM'
      m.format('LLLL').should.be.equal 'Monday, 26 Amordad 1360 12:00 AM'
      m.format('llll').should.be.equal 'Mon, 26 Amo 1360 12:00 AM'

  describe '#jYear', ->

    it 'should return Jalaali year', ->
      m = moment '1981-08-17'
      m.jYear().should.be.equal 1360

    it 'should set Jalaali year', ->
      m = moment '1981-08-17'
      m.jYear 1392
      m.format('jYYYY/jM/jD').should.be.equal '1392/5/26'
      m = moment '2013-03-20'
      m.format('jYY/jM/jD').should.be.equal '91/12/30'
      m.jYear 1392
      m.format('jYY/jM/jD').should.be.equal '92/12/29'

    it 'should also has jYears alias', ->
      moment.fn.jYear.should.be.equal moment.fn.jYears

  describe '#jMonth', ->

    it 'should return Jalaali month', ->
      m = moment '1981-08-17'
      m.jMonth().should.be.equal 4

    it 'should set Jalaali month', ->
      m = moment '1981-08-17'
      m.jMonth 7
      m.format('jYYYY/jM/jD').should.be.equal '1360/8/26'
      m = moment '2012-08-21'
      m.format('jYY/jM/jD').should.be.equal '91/5/31'
      m.jMonth 11
      m.format('jYY/jM/jD').should.be.equal '91/12/30'
      m = moment '2013-08-22'
      m.format('jYY/jM/jD').should.be.equal '92/5/31'
      m.jMonth 11
      m.format('jYY/jM/jD').should.be.equal '92/12/29'

    it 'should also has jMonths alias', ->
      moment.fn.jMonth.should.be.equal moment.fn.jMonths

  describe '#jDate', ->

    it 'should return Jalaali date', ->
      m = moment '1981-08-17'
      m.jDate().should.be.equal 26

    it 'should set Jalaali date', ->
      m = moment '1981-08-17'
      m.jDate 30
      m.format('jYYYY/jM/jD').should.be.equal '1360/5/30'
      m = moment '2013-03-01'
      m.format('jYY/jM/jD').should.be.equal '91/12/11'
      m.jDate 29
      m.format('jYY/jM/jD').should.be.equal '91/12/29'
      m.jDate 30
      m.format('jYY/jM/jD').should.be.equal '91/12/30'
      m.jDate 30
      m.format('jYY/jM/jD').should.be.equal '91/12/30'
      m.jDate 31
      m.format('jYY/jM/jD').should.be.equal '92/1/1'
      m.jDate 90
      m.format('jYY/jM/jD').should.be.equal '92/3/28'

    it 'should also has jDates alias', ->
      moment.fn.jDate.should.be.equal moment.fn.jDates

  describe '#jDayOfYear', ->

    it 'should return Jalaali date of year', ->
      m = moment '1981-08-17'
      m.jDayOfYear().should.be.equal 150
      m = moment '1981-03-21'
      m.jDayOfYear().should.be.equal 1
      m = moment '1982-03-20'
      m.jDayOfYear().should.be.equal 365
      m = moment '1984-03-20'
      m.jDayOfYear().should.be.equal 366

    it 'should set Jalaali date of year', ->
      m = moment '1981-08-17'
      m.jDayOfYear 30
      m.format('jYYYY/jM/jD').should.be.equal '1360/1/30'
      m.jDayOfYear 364
      m.format('jYY/jM/jD').should.be.equal '60/12/28'
      m.jDayOfYear 365
      m.format('jYY/jM/jD').should.be.equal '60/12/29'
      m.jDayOfYear 366
      m.format('jYY/jM/jD').should.be.equal '61/1/1'
      m.jDayOfYear 1
      m.format('jYY/jM/jD').should.be.equal '61/1/1'
      m.jDayOfYear 90
      m.format('jYY/jM/jD').should.be.equal '61/3/28'
      m.jDayOfYear 365 + 366
      m.format('jYY/jM/jD').should.be.equal '62/12/30'

  describe '#jWeek', ->

    it 'should return Jalaali week of year', ->
      m = moment '1981-08-17'
      m.jWeek().should.be.equal 22
      m.jDayOfYear 1
      m.format('jYY/jM/jD').should.be.equal '60/1/1'
      m.jWeek().should.be.equal 1
      m.jDayOfYear 8
      m.format('jYY/jM/jD').should.be.equal '60/1/8'
      m.jWeek().should.be.equal 2
      m.jDayOfYear 14
      m.format('jYY/jM/jD').should.be.equal '60/1/14'
      m.jWeek().should.be.equal 2
      m.jDayOfYear 364
      m.format('jYY/jM/jD').should.be.equal '60/12/28'
      m.jWeek().should.be.equal 52
      m.jDayOfYear 365
      m.format('jYY/jM/jD').should.be.equal '60/12/29'
      m.jWeek().should.be.equal 1
      m.jDayOfYear 366
      m.format('jYY/jM/jD').should.be.equal '61/1/1'
      m.jWeek().should.be.equal 1
      m.jDayOfYear 363
      m.format('jYY/jM/jD').should.be.equal '61/12/27'
      m.jWeek().should.be.equal 52
      m.jDayOfYear 365
      m.format('jYY/jM/jD').should.be.equal '61/12/29'
      m.jWeek().should.be.equal 1
      m.jDayOfYear 366
      m.format('jYY/jM/jD').should.be.equal '62/1/1'
      m.jWeek().should.be.equal 1
      m.jDayOfYear 365
      m.format('jYY/jM/jD').should.be.equal '62/12/29'
      m.jWeek().should.be.equal 1
      m.jDayOfYear 366
      m.format('jYY/jM/jD').should.be.equal '62/12/30'
      m.jWeek().should.be.equal 1
      m.jDayOfYear 367
      m.format('jYY/jM/jD').should.be.equal '63/1/1'
      m.jWeek().should.be.equal 1
      m.jDayOfYear 365
      m.format('jYY/jM/jD').should.be.equal '63/12/29'
      m.jWeek().should.be.equal 1
      m.jDayOfYear 366
      m.format('jYY/jM/jD').should.be.equal '64/1/1'
      m.jWeek().should.be.equal 1
      m.jDayOfYear 365
      m.format('jYY/jM/jD').should.be.equal '64/12/29'
      m.jWeek().should.be.equal 1
      m.jDayOfYear 366
      m.format('jYY/jM/jD').should.be.equal '65/1/1'
      m.jWeek().should.be.equal 1
      m.jDayOfYear 358
      m.format('jYY/jM/jD').should.be.equal '65/12/22'
      m.jWeek().should.be.equal 52
      m.jDayOfYear 359
      m.format('jYY/jM/jD').should.be.equal '65/12/23'
      m.jWeek().should.be.equal 53
      m.jDayOfYear 360
      m.format('jYY/jM/jD').should.be.equal '65/12/24'
      m.jWeek().should.be.equal 53
      m.jDayOfYear 361
      m.format('jYY/jM/jD').should.be.equal '65/12/25'
      m.jWeek().should.be.equal 53
      m.jDayOfYear 362
      m.format('jYY/jM/jD').should.be.equal '65/12/26'
      m.jWeek().should.be.equal 53
      m.jDayOfYear 363
      m.format('jYY/jM/jD').should.be.equal '65/12/27'
      m.jWeek().should.be.equal 53
      m.jDayOfYear 364
      m.format('jYY/jM/jD').should.be.equal '65/12/28'
      m.jWeek().should.be.equal 53
      m.jDayOfYear 365
      m.format('jYY/jM/jD').should.be.equal '65/12/29'
      m.jWeek().should.be.equal 53

    it 'should set Jalaali week of year', ->
      m = moment '1981-08-17'
      m.jWeek 1
      m.format('jYY/jM/jD').should.be.equal '60/1/3'
      m.jWeek 22
      m.format('jYY/jM/jD').should.be.equal '60/5/26'
      m.jWeek 52
      m.format('jYY/jM/jD').should.be.equal '60/12/24'
      m.jWeek 53
      m.format('jYY/jM/jD').should.be.equal '61/1/2'
      m.jWeek 1
      m.format('jYY/jM/jD').should.be.equal '61/1/2'
      m.jWeek 0
      m.format('jYY/jM/jD').should.be.equal '60/12/24'
      m.jWeek -1
      m.format('jYY/jM/jD').should.be.equal '59/12/18'

  describe '#jWeekYear', ->

    it 'should return Jalaali week year', ->
      m = moment '1981-08-17'
      m.jWeekYear().should.be.equal 1360
      m.jDayOfYear 1
      m.format('jYY/jM/jD').should.be.equal '60/1/1'
      m.jWeekYear().should.be.equal 1360
      m.jDayOfYear 364
      m.format('jYY/jM/jD').should.be.equal '60/12/28'
      m.jWeekYear().should.be.equal 1360
      m.jDayOfYear 365
      m.format('jYY/jM/jD').should.be.equal '60/12/29'
      m.jWeekYear().should.be.equal 1361
      m.jDayOfYear 366
      m.format('jYY/jM/jD').should.be.equal '61/1/1'
      m.jWeekYear().should.be.equal 1361
      m.jDayOfYear 363
      m.format('jYY/jM/jD').should.be.equal '61/12/27'
      m.jWeekYear().should.be.equal 1361
      m.jDayOfYear 365
      m.format('jYY/jM/jD').should.be.equal '61/12/29'
      m.jWeekYear().should.be.equal 1362
      m.jDayOfYear 366
      m.format('jYY/jM/jD').should.be.equal '62/1/1'
      m.jWeekYear().should.be.equal 1362
      m.jDayOfYear 365
      m.format('jYY/jM/jD').should.be.equal '62/12/29'
      m.jWeekYear().should.be.equal 1363
      m.jDayOfYear 366
      m.format('jYY/jM/jD').should.be.equal '62/12/30'
      m.jWeekYear().should.be.equal 1363
      m.jDayOfYear 367
      m.format('jYY/jM/jD').should.be.equal '63/1/1'
      m.jWeekYear().should.be.equal 1363
      m.jDayOfYear 365
      m.format('jYY/jM/jD').should.be.equal '63/12/29'
      m.jWeekYear().should.be.equal 1364
      m.jDayOfYear 366
      m.format('jYY/jM/jD').should.be.equal '64/1/1'
      m.jWeekYear().should.be.equal 1364
      m.jDayOfYear 365
      m.format('jYY/jM/jD').should.be.equal '64/12/29'
      m.jWeekYear().should.be.equal 1365
      m.jDayOfYear 366
      m.format('jYY/jM/jD').should.be.equal '65/1/1'
      m.jWeekYear().should.be.equal 1365
      m.jDayOfYear 358
      m.format('jYY/jM/jD').should.be.equal '65/12/22'
      m.jWeekYear().should.be.equal 1365
      m.jDayOfYear 359
      m.format('jYY/jM/jD').should.be.equal '65/12/23'
      m.jWeekYear().should.be.equal 1365
      m.jDayOfYear 365
      m.format('jYY/jM/jD').should.be.equal '65/12/29'
      m.jWeekYear().should.be.equal 1365
      m.jDayOfYear 366
      m.format('jYY/jM/jD').should.be.equal '66/1/1'
      m.jWeekYear().should.be.equal 1366

    it 'should set Jalaali week year', ->
      m = moment '1981-08-17'
      m.jWeekYear 1361
      m.format('jYY/jM/jD').should.be.equal '61/5/26'
      m.jWeekYear 1364
      m.format('jYY/jM/jD').should.be.equal '64/5/26'
      m.jDayOfYear 365
      m.format('jYY/jM/jD').should.be.equal '64/12/29'
      m.jWeekYear 1364
      m.format('jYY/jM/jD').should.be.equal '63/12/29'
      m.jWeekYear 1365
      m.format('jYY/jM/jD').should.be.equal '64/12/29'

  describe '#startOf', ->

    it 'should work as default without jYear and jMonth', ->
      m = moment '1981-08-17 07:10:20'
      m.startOf('year').format('YYYY-MM-DD HH:mm:ss')
          .should.be.equal '1981-01-01 00:00:00'
      m = moment '1981-08-17 07:10:20'
      m.startOf('month').format('YYYY-MM-DD HH:mm:ss')
          .should.be.equal '1981-08-01 00:00:00'
      m = moment '1981-08-17 07:10:20'
      m.startOf('day').format('YYYY-MM-DD HH:mm:ss')
          .should.be.equal '1981-08-17 00:00:00'
      m = moment '1981-08-17 07:10:20'
      m.startOf('week').format('YYYY-MM-DD HH:mm:ss')
          .should.be.equal '1981-08-15 00:00:00'

    it 'should return start of Jalaali year', ->
      m = moment '1981-08-17 07:10:20'
      m.startOf('jYear').format('jYYYY-jMM-jDD HH:mm:ss')
          .should.be.equal '1360-01-01 00:00:00'

  describe '#jIsLeapYear', ->

    it 'should return true for Jalaali leap years and false otherwise', ->
      moment.jIsLeapYear(1391).should.be.true
      moment.jIsLeapYear(1392).should.be.false
      moment.jIsLeapYear(1393).should.be.false
      moment.jIsLeapYear(1394).should.be.false
      moment.jIsLeapYear(1395).should.be.true
      moment.jIsLeapYear(1396).should.be.false
      moment.jIsLeapYear(1397).should.be.false
      moment.jIsLeapYear(1398).should.be.false
      moment.jIsLeapYear(1399).should.be.true
      moment.jIsLeapYear(1400).should.be.false
      moment.jIsLeapYear(1401).should.be.false
      moment.jIsLeapYear(1402).should.be.false
      moment.jIsLeapYear(1403).should.be.true
      moment.jIsLeapYear(1404).should.be.false

  describe 'constructing with string + format', ->

    it.skip 'should work normally when there is no Jalaali token', ->
      m = moment '12-25-1995', 'MM-DD-YYYY'
      m.format('YYYY-MM-DD').should.be.equal '1995-12-25'

    it.skip 'should parse Jalaali when there are Jalaali tokens', ->
      m = moment '1392/5/26', 'jYYYY-jMM-jDD'
