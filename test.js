
var chai = require('chai')
  , moment = require('./index')

chai.should()

moment.updateLocale('en'
, { week:
    { dow: 6
    , doy: 12
    }
  , longDateFormat:
    { LT: 'h:mm A'
    , LTS: 'h:mm:ss A'
    , L: 'jYYYY/jMM/jDD'
    , LL: 'jD jMMMM jYYYY'
    , LLL: 'jD jMMMM jYYYY LT'
    , LLLL: 'dddd, jD jMMMM jYYYY LT'
    }
  }
)

describe('moment', function() {
  describe('#parse', function() {
    it('should parse gregorian dates', function() {
      var m = moment('1980/5/15 07:10:20', 'YYYY/M/D hh:mm:ss')
      m.format('YYYY-MM-DD hh:mm:ss').should.be.equal('1980-05-15 07:10:20')
      m.milliseconds().should.be.equal(0)
    })

    it('should parse correctly when input is only time', function() {
      var m = moment('07:10:20', 'hh:mm:ss')
      m.format('YYYY-MM-DD hh:mm:ss').should.be.equal('0000-01-01 07:10:20')
    })

    it('should parse when only Jalaali year is in the format', function() {
      var m = moment('05 1359 15', 'MM jYYYY DD')
      m.format('YYYY-MM-DD').should.be.equal('1980-05-15')
      m = moment('05 59 15', 'MM jYY DD')
      m.format('YYYY-MM-DD').should.be.equal('1980-05-15')
    })

    it('should parse when only Jalaali month is in the format', function() {
      var m = moment('1980 2 15', 'YYYY jM D')
      m.format('YYYY-MM-DD').should.be.equal('1980-04-15')
    })

    it('should parse when only Jalaali month string is in the format', function() {
      var m = moment('1980 Ord 15', 'YYYY jMMM D')
      m.format('YYYY-MM-DD').should.be.equal('1980-04-15')
      m = moment('1980 Ordibehesht 15', 'YYYY jMMMM D')
      m.format('YYYY-MM-DD').should.be.equal('1980-04-15')
    })

    it('should parse when only Jalaali date is in the format', function() {
      var m = moment('1980 24 5', 'YYYY jD M')
      m.format('YYYY-MM-DD').should.be.equal('1980-05-13')
    })

    it('should parse when Jalaali year and month are in the format', function() {
      var m = moment('15 1359 2', 'D jYYYY jM')
      m.format('YYYY-MM-DD').should.be.equal('1980-04-15')
      m = moment('1392 7', 'jYYYY jM')
      m.format('YYYY-MM-DD').should.be.equal('2013-09-23')
    })

    it('should parse when Jalaali year and date are in the format', function() {
      var m = moment('24 1359 5', 'jD jYYYY M')
      m.format('YYYY-MM-DD').should.be.equal('1980-05-13')
    })

    it('should parse when Jalaali month and date are in the format', function() {
      var m = moment('24 1980 2', 'jD YYYY jM')
      m.format('YYYY-MM-DD').should.be.equal('1980-05-14')
    })

    it('should parse when Jalaali year, month and date are in the format', function() {
      var m = moment('24 1359 2', 'jD jYYYY jM')
      m.format('YYYY-MM-DD').should.be.equal('1980-05-14')
    })

    it('should parse with complex format', function() {
      var m = moment('15 24 50 1980 50 5 12', 'D jD jYYYY YYYY M M jM')
      m.format('YYYY-MM-DD').should.be.equal('1980-05-15')
    })

    it('should parse format result', function() {
      var f = 'jYYYY/jM/jD hh:mm:ss.SSS a'
        , m = moment()
      moment(m.format(f), f).isSame(m).should.be.true
    })

    it('should be able to parse in utc', function() {
      var m = moment.utc('1359/2/24 07:10:20', 'jYYYY/jM/jD hh:mm:ss')
      m.format('YYYY-MM-DD hh:mm:ss Z').should.be.equal('1980-05-14 07:10:20 +00:00')
    })

    it('should parse with a format array', function() {
      var p1 = 'jYY jM jD'
        , p2 = 'jM jD jYY'
        , p3 = 'jD jYY jM'
        , m
      m = moment('60 11 12', ['D YY M', 'M D YY', 'YY M D'])
      m.format('YY-MM-DD').should.be.equal('60-11-12')
      m = moment('10 11 12', [p1, p2, p3])
      m.format('jYY-jMM-jDD').should.be.equal('10-11-12')
      m = moment('10 11 12', [p2, p3, p1])
      m.format('jYY-jMM-jDD').should.be.equal('12-10-11')
      m = moment('10 11 12', [p3, p1, p2])
      m.format('jYY-jMM-jDD').should.be.equal('11-12-10')
      m = moment('10 11 12', [p3, p2, p1])
      m.format('jYY-jMM-jDD').should.be.equal('11-12-10')
      m = moment('60-11-12', [p3, p2, p1])
      m.format('jYY-jMM-jDD').should.be.equal('60-11-12')
      m = moment('60 11 12', [p3, p2, p1])
      m.format('jYY-jMM-jDD').should.be.equal('60-11-12')
      m = moment('60 8 31', ['YY M D', 'jYY jM jD'])
      m.format('YY-MM-DD').should.be.equal('60-08-31')
      m = moment('60 8 31', ['jYY jM jD', 'YY M D'])
      m.format('YY-MM-DD').should.be.equal('60-08-31')
      m = moment('60 5 31', ['YY M D', 'jYY jM jD'])
      m.format('YY-MM-DD').should.be.equal('60-05-31')
      m = moment('60 5 31', ['jYY jM jD', 'YY M D'])
      m.format('jYY-jMM-jDD').should.be.equal('60-05-31')
    })


    it('should return valid moment instance if years is less than 3178', function () {
      var m = moment('3177-01-01', 'jYYYY-jMM-jDD')
      m.format('jYYYY-jMM-jDD').should.be.equal('3177-01-01')
    })

      it('should return invalid moment instance if years is larger than 3177 (Jalali)', function () {
      var m = moment('3178-01-01', 'jYYYY-jMM-jDD')

      m.isValid().should.be.false
      m.jYear().should.be.NaN
      m.jMonth().should.be.NaN
      m.jDate().should.be.NaN
    })

    it('should return invalid moment instance if years is larger than 3177 (Gregorian)', function () {
      var m = moment('9999-01-01','YYYY-MM-DD')

      m.isValid().should.be.false
      m.jYear().should.be.NaN
      m.jMonth().should.be.NaN
      m.jDate().should.be.NaN
    })


    it('should return invalid moment instance if years is larger than 3177 (timestamp)', function () {
      var m = moment(64060576200000)

      m.isValid().should.be.false
      m.jYear().should.be.NaN
      m.jMonth().should.be.NaN
      m.jDate().should.be.NaN
    })

    it('should return invalid moment instance if years is larger than 3177 (timestamp)', function () {
      var m = moment(new Date(64060576200000))

      m.isValid().should.be.false
      m.jYear().should.be.NaN
      m.jMonth().should.be.NaN
      m.jDate().should.be.NaN
    })

})

  describe('#format', function() {
    it('should work normally when there is no Jalaali token', function() {
      var m = moment('1980-05-15 07:10:20')
      m.format('YYYY-MM-DD hh:mm:ss').should.be.equal('1980-05-15 07:10:20')
    })

    it('should format to Jalaali with Jalaali tokens', function() {
      var m = moment('1980-05-15 07:10:20')
      m.format('jYYYY-jMM-jDD hh:mm:ss').should.be.equal('1359-02-25 07:10:20')
    })

    it('should format with escaped and unescaped tokens', function() {
      var m = moment('1980-05-15')
      m.format('[My] birt\\h \\y[ea]r [is] jYYYY or YYYY').should.be.equal('My birth year is 1359 or 1980')
    })

    it('should format with mixed tokens', function() {
      var m = moment('1980-05-15')
      m.format('jYYYY/jMM/jDD = YYYY-MM-DD').should.be.equal('1359/02/25 = 1980-05-15')
    })

    it('should format with jMo', function() {
      var m = moment('1980-05-15')
      m.format('jMo').should.be.equal('2nd')
    })

    it('should format with jM', function() {
      var m = moment('1980-05-15')
      m.format('jM').should.be.equal('2')
    })

    it('should format with jMM', function() {
      var m = moment('1980-05-15')
      m.format('jMM').should.be.equal('02')
    })

    it('should format with jMMM', function() {
      var m = moment('1980-05-15')
      m.format('jMMM').should.be.equal('Ord')
    })

    it('should format with jMMMM', function() {
      var m = moment('1980-05-15')
      m.format('jMMMM').should.be.equal('Ordibehesht')
    })

    it('should format with jDo', function() {
      var m = moment('1980-05-15')
      m.format('jDo').should.be.equal('25th')
    })

    it('should format with jD', function() {
      var m = moment('1980-05-15')
      m.format('jD').should.be.equal('25')
    })

    it('should format with jDD', function() {
      var m = moment('1980-05-15')
      m.format('jDD').should.be.equal('25')
      m = moment('1980-05-22')
      m.format('jDD').should.be.equal('01')
    })

    it('should format with jDDD', function() {
      var m = moment('1980-05-15')
      m.format('jDDD').should.be.equal('56')
    })

    it('should format with jDDDo', function() {
      var m = moment('1980-05-15')
      m.format('jDDDo').should.be.equal('56th')
    })

    it('should format with jDDDD', function() {
      var m = moment('1980-05-15')
      m.format('jDDDD').should.be.equal('056')
      m = moment('1980-03-21')
      m.format('jDDDD').should.be.equal('001')
    })

    it('should format with jwo', function() {
      var m = moment('1980-05-15')
      m.format('jwo').should.be.equal('9th')
    })

    it('should format with jw', function() {
      var m = moment('1980-05-15')
      m.format('jw').should.be.equal('9')
    })

    it('should format with jww', function() {
      var m = moment('1980-05-15')
      m.format('jww').should.be.equal('09')
      m = moment('1980-04-23')
      m.format('jww').should.be.equal('06')
    })

    it('should format with jYY', function() {
      var m = moment('1980-05-15')
      m.format('jYY').should.be.equal('59')
    })

    it('should format with jYYYY', function() {
      var m = moment('1980-05-15')
      m.format('jYYYY').should.be.equal('1359')
    })

    it('should format with jYYYYY', function() {
      var m = moment('1980-05-15')
      m.format('jYYYYY').should.be.equal('01359')
    })

    it('should format with jgg', function() {
      var m = moment('1980-05-15')
      m.format('jgg').should.be.equal('59')
    })

    it('should format with jgggg', function() {
      var m = moment('1980-05-15')
      m.format('jgggg').should.be.equal('1359')
    })

    it('should format with jggggg', function() {
      var m = moment('1980-05-15')
      m.format('jggggg').should.be.equal('01359')
    })

    it('should work with long date formats too', function() {
      var m = moment('1980-05-15')
      m.format('LT').should.be.equal('12:00 AM')
      m.format('LTS').should.be.equal('12:00:00 AM')
      m.format('L').should.be.equal('1359/02/25')
      m.format('l').should.be.equal('1359/2/25')
      m.format('LL').should.be.equal('25 Ordibehesht 1359')
      m.format('ll').should.be.equal('25 Ord 1359')
      m.format('LLL').should.be.equal('25 Ordibehesht 1359 12:00 AM')
      m.format('lll').should.be.equal('25 Ord 1359 12:00 AM')
      m.format('LLLL').should.be.equal('Thursday, 25 Ordibehesht 1359 12:00 AM')
      m.format('llll').should.be.equal('Thu, 25 Ord 1359 12:00 AM')
    })

    it('should work with long date formats too if we have time', function() {
      var m = moment('1980-05-15 12:15:45')
      m.format('LT').should.be.equal('12:15 PM')
      m.format('LTS').should.be.equal('12:15:45 PM')
      m.format('L').should.be.equal('1359/02/25')
      m.format('l').should.be.equal('1359/2/25')
      m.format('LL').should.be.equal('25 Ordibehesht 1359')
      m.format('ll').should.be.equal('25 Ord 1359')
      m.format('LLL').should.be.equal('25 Ordibehesht 1359 12:15 PM')
      m.format('lll').should.be.equal('25 Ord 1359 12:15 PM')
      m.format('LLLL').should.be.equal('Thursday, 25 Ordibehesht 1359 12:15 PM')
      m.format('llll').should.be.equal('Thu, 25 Ord 1359 12:15 PM')
    })
  })

  describe('#jYear', function() {
    it('should return Jalaali year', function() {
      var m = moment('1980-05-15')
      m.jYear().should.be.equal(1359)
    })

    it('should set Jalaali year', function() {
      var m = moment('1980-05-15')
      m.jYear(1392)
      m.format('jYYYY/jM/jD').should.be.equal('1392/2/25')
      m = moment('2013-03-20')
      m.format('jYY/jM/jD').should.be.equal('91/12/30')
      m.jYear(1392)
      m.format('jYY/jM/jD').should.be.equal('92/12/29')
    })

    it('should also has jYears alias', function() {
      moment.fn.jYear.should.be.equal(moment.fn.jYears)
    })

    it('should return invalid moment instance if years is larger than 31778', function () {
      var m = moment('3177-01-01', 'jYYYY-jMM-jDD')
      m.jYear(3178)

      m.isValid().should.be.false
      m.jYear().should.be.NaN
      m.jMonth().should.be.NaN
      m.jDate().should.be.NaN
    })
  })

  describe('#jMonth', function() {
    it('should return Jalaali month', function() {
      var m = moment('1980-05-15')
      m.jMonth().should.be.equal(1)
    })

    it('should set Jalaali month', function() {
      var m = moment('1980-05-15')
      m.jMonth(4)
      m.format('jYYYY/jM/jD').should.be.equal('1359/5/25')
      m = moment('2012-05-20')
      m.format('jYY/jM/jD').should.be.equal('91/2/31')
      m.jMonth(11)
      m.format('jYY/jM/jD').should.be.equal('91/12/30')
      m = moment('2013-05-21')
      m.format('jYY/jM/jD').should.be.equal('92/2/31')
      m.jMonth(11)
      m.format('jYY/jM/jD').should.be.equal('92/12/29')
    })

    it('should also has jMonths alias', function() {
      moment.fn.jMonth.should.be.equal(moment.fn.jMonths)
    })
  })

  describe('#jDate', function() {
    it('should return Jalaali date', function() {
      var m = moment('1980-05-15')
      m.jDate().should.be.equal(25)
    })

    it('should set Jalaali date', function() {
      var m = moment('1980-05-15')
      m.jDate(30)
      m.format('jYYYY/jM/jD').should.be.equal('1359/2/30')
      m = moment('2013-03-01')
      m.format('jYY/jM/jD').should.be.equal('91/12/11')
      m.jDate(29)
      m.format('jYY/jM/jD').should.be.equal('91/12/29')
      m.jDate(30)
      m.format('jYY/jM/jD').should.be.equal('91/12/30')
      m.jDate(30)
      m.format('jYY/jM/jD').should.be.equal('91/12/30')
      m.jDate(31)
      m.format('jYY/jM/jD').should.be.equal('92/1/1')
      m.jDate(90)
      m.format('jYY/jM/jD').should.be.equal('92/3/28')
    })

    it('should also has jDates alias', function() {
      moment.fn.jDate.should.be.equal(moment.fn.jDates)
    })
  })

  describe('#jDayOfYear', function() {
    it('should return Jalaali date of year', function() {
      var m = moment('1980-05-15')
      m.jDayOfYear().should.be.equal(56)
      m = moment('1981-03-21')
      m.jDayOfYear().should.be.equal(1)
      m = moment('1982-03-20')
      m.jDayOfYear().should.be.equal(365)
      m = moment('1984-03-20')
      m.jDayOfYear().should.be.equal(366)
    })

    it('should set Jalaali date of year', function() {
      var m = moment('1980-05-15')
      m.jDayOfYear(30)
      m.format('jYYYY/jM/jD').should.be.equal('1359/1/30')
      m.jDayOfYear(364)
      m.format('jYY/jM/jD').should.be.equal('59/12/28')
      m.jDayOfYear(365)
      m.format('jYY/jM/jD').should.be.equal('59/12/29')
      m.jDayOfYear(366)
      m.format('jYY/jM/jD').should.be.equal('60/1/1')
      m.jDayOfYear(1)
      m.format('jYY/jM/jD').should.be.equal('60/1/1')
      m.jDayOfYear(90)
      m.format('jYY/jM/jD').should.be.equal('60/3/28')
      m.jDayOfYear(365 + 365)
      m.format('jYY/jM/jD').should.be.equal('61/12/29')
    })
  })

  describe('#jWeek', function() {
    it('should return Jalaali week of year', function() {
      var m = moment('1980-05-15')
      m.jWeek().should.be.equal(9)
      m.jDayOfYear(1)
      m.format('jYY/jM/jD').should.be.equal('59/1/1')
      m.jWeek().should.be.equal(1)
      m.jDayOfYear(8)
      m.format('jYY/jM/jD').should.be.equal('59/1/8')
      m.jWeek().should.be.equal(2)
      m.jDayOfYear(14)
      m.format('jYY/jM/jD').should.be.equal('59/1/14')
      m.jWeek().should.be.equal(3)
      m.jDayOfYear(364)
      m.format('jYY/jM/jD').should.be.equal('59/12/28')
      m.jWeek().should.be.equal(53)
      m.jDayOfYear(365)
      m.format('jYY/jM/jD').should.be.equal('59/12/29')
      m.jWeek().should.be.equal(53)
      m.jDayOfYear(366)
      m.format('jYY/jM/jD').should.be.equal('60/1/1')
      m.jWeek().should.be.equal(1)
      m.jDayOfYear(363)
      m.format('jYY/jM/jD').should.be.equal('60/12/27')
      m.jWeek().should.be.equal(52)
      m.jDayOfYear(365)
      m.format('jYY/jM/jD').should.be.equal('60/12/29')
      m.jWeek().should.be.equal(1)
      m.jDayOfYear(366)
      m.format('jYY/jM/jD').should.be.equal('61/1/1')
      m.jWeek().should.be.equal(1)
      m.jDayOfYear(365)
      m.format('jYY/jM/jD').should.be.equal('61/12/29')
      m.jWeek().should.be.equal(1)
      m.jDayOfYear(365)
      m.format('jYY/jM/jD').should.be.equal('61/12/29')
      m.jWeek().should.be.equal(1)
      m.jDayOfYear(366)
      m.format('jYY/jM/jD').should.be.equal('62/1/1')
      m.jWeek().should.be.equal(1)
      m.jDayOfYear(365)
      m.format('jYY/jM/jD').should.be.equal('62/12/29')
      m.jWeek().should.be.equal(1)
      m.jDayOfYear(366)
      m.format('jYY/jM/jD').should.be.equal('62/12/30')
      m.jWeek().should.be.equal(1)
      m.jDayOfYear(365)
      m.format('jYY/jM/jD').should.be.equal('62/12/29')
      m.jWeek().should.be.equal(1)
      m.jDayOfYear(366)
      m.format('jYY/jM/jD').should.be.equal('62/12/30')
      m.jWeek().should.be.equal(1)
      m.jDayOfYear(358)
      m.format('jYY/jM/jD').should.be.equal('62/12/22')
      m.jWeek().should.be.equal(52)
      m.jDayOfYear(359)
      m.format('jYY/jM/jD').should.be.equal('62/12/23')
      m.jWeek().should.be.equal(52)
      m.jDayOfYear(360)
      m.format('jYY/jM/jD').should.be.equal('62/12/24')
      m.jWeek().should.be.equal(52)
      m.jDayOfYear(361)
      m.format('jYY/jM/jD').should.be.equal('62/12/25')
      m.jWeek().should.be.equal(52)
      m.jDayOfYear(362)
      m.format('jYY/jM/jD').should.be.equal('62/12/26')
      m.jWeek().should.be.equal(52)
      m.jDayOfYear(363)
      m.format('jYY/jM/jD').should.be.equal('62/12/27')
      m.jWeek().should.be.equal(1)
      m.jDayOfYear(364)
      m.format('jYY/jM/jD').should.be.equal('62/12/28')
      m.jWeek().should.be.equal(1)
      m.jDayOfYear(365)
      m.format('jYY/jM/jD').should.be.equal('62/12/29')
      m.jWeek().should.be.equal(1)
    })

    it('should set Jalaali week of year', function() {
      var m = moment('1980-05-15')
      m.jWeek(1)
      m.format('jYY/jM/jD').should.be.equal('58/12/30')
      m.jWeek(9)
      m.format('jYY/jM/jD').should.be.equal('59/2/25')
      m.jWeek(52)
      m.format('jYY/jM/jD').should.be.equal('59/12/21')
      m.jWeek(53)
      m.format('jYY/jM/jD').should.be.equal('59/12/28')
      m.jWeek(1)
      m.format('jYY/jM/jD').should.be.equal('58/12/30')
      m.jWeek(0)
      m.format('jYY/jM/jD').should.be.equal('58/12/23')
      m.jWeek(-1)
      m.format('jYY/jM/jD').should.be.equal('57/12/17')
    })
  })

  describe('#jWeekYear', function() {
    it('should return Jalaali week year', function() {
      var m = moment('1980-05-15')
      m.jWeekYear().should.be.equal(1359)
      m.jDayOfYear(1)
      m.format('jYY/jM/jD').should.be.equal('59/1/1')
      m.jWeekYear().should.be.equal(1359)
      m.jDayOfYear(364)
      m.format('jYY/jM/jD').should.be.equal('59/12/28')
      m.jWeekYear().should.be.equal(1359)
      m.jDayOfYear(365)
      m.format('jYY/jM/jD').should.be.equal('59/12/29')
      m.jWeekYear().should.be.equal(1359)
      m.jDayOfYear(366)
      m.format('jYY/jM/jD').should.be.equal('60/1/1')
      m.jWeekYear().should.be.equal(1360)
      m.jDayOfYear(363)
      m.format('jYY/jM/jD').should.be.equal('60/12/27')
      m.jWeekYear().should.be.equal(1360)
      m.jDayOfYear(365)
      m.format('jYY/jM/jD').should.be.equal('60/12/29')
      m.jWeekYear().should.be.equal(1361)
      m.jDayOfYear(366)
      m.format('jYY/jM/jD').should.be.equal('61/1/1')
      m.jWeekYear().should.be.equal(1361)
      m.jDayOfYear(365)
      m.format('jYY/jM/jD').should.be.equal('61/12/29')
      m.jWeekYear().should.be.equal(1362)
      m.jDayOfYear(366)
      m.format('jYY/jM/jD').should.be.equal('62/1/1')
      m.jWeekYear().should.be.equal(1362)
      m.jDayOfYear(367)
      m.format('jYY/jM/jD').should.be.equal('63/1/1')
      m.jWeekYear().should.be.equal(1363)
      m.jDayOfYear(365)
      m.format('jYY/jM/jD').should.be.equal('63/12/29')
      m.jWeekYear().should.be.equal(1364)
      m.jDayOfYear(366)
      m.format('jYY/jM/jD').should.be.equal('64/1/1')
      m.jWeekYear().should.be.equal(1364)
      m.jDayOfYear(365)
      m.format('jYY/jM/jD').should.be.equal('64/12/29')
      m.jWeekYear().should.be.equal(1365)
      m.jDayOfYear(366)
      m.format('jYY/jM/jD').should.be.equal('65/1/1')
      m.jWeekYear().should.be.equal(1365)
      m.jDayOfYear(358)
      m.format('jYY/jM/jD').should.be.equal('65/12/22')
      m.jWeekYear().should.be.equal(1365)
      m.jDayOfYear(359)
      m.format('jYY/jM/jD').should.be.equal('65/12/23')
      m.jWeekYear().should.be.equal(1365)
      m.jDayOfYear(365)
      m.format('jYY/jM/jD').should.be.equal('65/12/29')
      m.jWeekYear().should.be.equal(1365)
      m.jDayOfYear(366)
      m.format('jYY/jM/jD').should.be.equal('66/1/1')
      m.jWeekYear().should.be.equal(1366)
    })

    it('should set Jalaali week year', function() {
      var m = moment('1980-05-15')
      m.jWeekYear(1360)
      m.format('jYY/jM/jD').should.be.equal('60/2/25')
      m.jWeekYear(1364)
      m.format('jYY/jM/jD').should.be.equal('64/2/25')
      m.jDayOfYear(365)
      m.format('jYY/jM/jD').should.be.equal('64/12/29')
      m.jWeekYear(1364)
      m.format('jYY/jM/jD').should.be.equal('63/12/29')
      m.jWeekYear(1365)
      m.format('jYY/jM/jD').should.be.equal('64/12/29')
    })
  })

  describe('#startOf', function() {
    it('should work as expected without jYear and jMonth', function() {
      var m = moment('1980-05-15 07:10:20')
      m.startOf('year').format('YYYY-MM-DD HH:mm:ss').should.be.equal('1980-01-01 00:00:00')
      m = moment('1980-05-15 07:10:20')
      m.startOf('month').format('YYYY-MM-DD HH:mm:ss').should.be.equal('1980-05-01 00:00:00')
      m = moment('1980-05-15 07:10:20')
      m.startOf('day').format('YYYY-MM-DD HH:mm:ss').should.be.equal('1980-05-15 00:00:00')
      m = moment('1980-05-15 07:10:20')
      m.startOf('week').format('YYYY-MM-DD HH:mm:ss').should.be.equal('1980-05-10 00:00:00')
    })

    it('should return start of Jalaali year, month and date', function() {
      var m = moment('1985-05-15 07:10:20')
      m.startOf('jYear').format('jYYYY-jMM-jDD HH:mm:ss').should.be.equal('1364-01-01 00:00:00')
      m = moment('1980-05-15 07:10:20')
      m.startOf('jMonth').format('jYYYY-jMM-jDD HH:mm:ss').should.be.equal('1359-02-01 00:00:00')
      m = moment('1980-05-15 07:10:20')
      m.startOf('day').format('jYYYY-jMM-jDD HH:mm:ss').should.be.equal('1359-02-25 00:00:00')
      m = moment('1980-05-15 07:10:20')
      m.startOf('week').format('jYYYY-jMM-jDD HH:mm:ss').should.be.equal('1359-02-20 00:00:00')
    })
  })

  describe('#endOf', function() {
    it('should work as expected without jYear and jMonth', function() {
      var m = moment('1980-05-15 07:10:20')
      m.endOf('year').format('YYYY-MM-DD HH:mm:ss').should.be.equal('1980-12-31 23:59:59')
      m = moment('1980-05-15 07:10:20')
      m.endOf('month').format('YYYY-MM-DD HH:mm:ss').should.be.equal('1980-05-31 23:59:59')
      m = moment('1980-05-15 07:10:20')
      m.endOf('day').format('YYYY-MM-DD HH:mm:ss').should.be.equal('1980-05-15 23:59:59')
      m = moment('1980-05-15 07:10:20')
      m.endOf('week').format('YYYY-MM-DD HH:mm:ss').should.be.equal('1980-05-16 23:59:59')
    })

    it('should return end of Jalaali year, month and date', function() {
      var m = moment('1985-05-15 07:10:20')
      m.endOf('jYear').format('jYYYY-jMM-jDD HH:mm:ss').should.be.equal('1364-12-29 23:59:59')
      m = moment('1980-05-15 07:10:20')
      m.endOf('jMonth').format('jYYYY-jMM-jDD HH:mm:ss').should.be.equal('1359-02-31 23:59:59')
      m = moment('1980-05-15 07:10:20')
      m.endOf('day').format('jYYYY-jMM-jDD HH:mm:ss').should.be.equal('1359-02-25 23:59:59')
      m = moment('1980-05-15 07:10:20')
      m.endOf('week').format('jYYYY-jMM-jDD HH:mm:ss').should.be.equal('1359-02-26 23:59:59')
    })
  })

  describe('#isValid', function() {
    it('should return true when a valid date is parsed and false otherwise', function() {
      var jf = 'jYYYY/jMM/jDD'
        , gf = 'YYYY-MM-DD'
      moment('1980-05-15', gf).isValid().should.be.true
      moment('1980-05-29', gf).isValid().should.be.true
      moment('1980-06-31', gf).isValid().should.be.false
      moment('1359 xordibehesht 25', 'jYYYY jMMMM jD').isValid().should.be.false
      moment('1359/02/25', jf).isValid().should.be.true
      moment('1359/02/31', jf).isValid().should.be.true
      moment('1359/04/30', jf).isValid().should.be.true
      moment('1359/04/32', jf).isValid().should.be.false
      moment('1359/12/29', jf).isValid().should.be.true
      moment('1359/12/30', jf).isValid().should.be.false
      moment('1359/12/31', jf).isValid().should.be.false
      moment('1359/13/01', jf).isValid().should.be.false
      moment('1393/11/00', jf).isValid().should.be.false
    })
  })

  describe('#isValid-strict', function () {
    it('should return false when gregorian date is not strictly valid', function () {
      var gf = 'YYYY-MM-DD'
      moment('1980-05-15', gf).isValid().should.be.true
      moment('1980-05-31', gf).isValid().should.be.true
      moment('1980-05-311', gf).isValid().should.be.true
      moment('1980-05-311', gf, true).isValid().should.be.false
    })

    it('should return false when jalaali date is not strictly valid', function () {
      var jf = 'jYYYY/jMM/jDD'
      moment('1359/02/25', jf).isValid().should.be.true
      moment('1359/02/31', jf).isValid().should.be.true
      moment('1359/02/311', jf, true).isValid().should.be.false
    })
  })

  describe('#clone', function() {
    it('should return a cloned instance', function() {
      var m = moment('1359/2/25', 'jYYYY/jM/jD')
        , c = m.clone()
      m.add(1, 'jYear')
      m.add(5, 'day')
      m.format('jYY/jM/jD').should.be.equal('60/2/30')
      c.format('jYY/jM/jD').should.be.equal('59/2/25')
    })
  })

  describe('#add', function () {
    it('should add gregorian dates correctly', function () {
      var gf = 'YYYY-M-D'
        , m = moment('1980-5-15', 'YYYY-M-D')
      moment(m).add(1, 'day').format(gf).should.be.equal('1980-5-16')
      moment(m).add(10, 'days').format(gf).should.be.equal('1980-5-25')
      moment(m).add(30, 'days').format(gf).should.be.equal('1980-6-14')
      moment(m).add(60, 'days').format(gf).should.be.equal('1980-7-14')

      moment(m).add(1, 'month').format(gf).should.be.equal('1980-6-15')
      moment(m).add(2, 'months').format(gf).should.be.equal('1980-7-15')
      moment(m).add(10, 'months').format(gf).should.be.equal('1981-3-15')
      moment(m).add(20, 'months').format(gf).should.be.equal('1982-1-15')

      moment(m).add(1, 'year').format(gf).should.be.equal('1981-5-15')
      moment(m).add(2, 'years').format(gf).should.be.equal('1982-5-15')
      moment(m).add(10, 'years').format(gf).should.be.equal('1990-5-15')
      moment(m).add(20, 'years').format(gf).should.be.equal('2000-5-15')
    })

    it('should add jalaali dates correctly', function () {
      var jf = 'jYYYY/jM/jD'
        , m = moment('1359/2/25', 'jYYYY/jM/jD')
      moment(m).add(1, 'day').format(jf).should.be.equal('1359/2/26')
      moment(m).add(4, 'days').format(jf).should.be.equal('1359/2/29')
      moment(m).add(10, 'days').format(jf).should.be.equal('1359/3/4')
      moment(m).add(30, 'days').format(jf).should.be.equal('1359/3/24')
      moment(m).add(60, 'days').format(jf).should.be.equal('1359/4/23')
      moment(m).add(365, 'days').format(jf).should.be.equal('1360/2/25')

      moment(m).add(1, 'jmonth').format(jf).should.be.equal('1359/3/25')
      moment(m).add(2, 'jmonths').format(jf).should.be.equal('1359/4/25')
      moment(m).add(10, 'jmonths').format(jf).should.be.equal('1359/12/25')
      moment(m).add(20, 'jmonths').format(jf).should.be.equal('1360/10/25')

      moment(m).add(1, 'jyear').format(jf).should.be.equal('1360/2/25')
      moment(m).add(2, 'jyears').format(jf).should.be.equal('1361/2/25')
      moment(m).add(3, 'jyears').format(jf).should.be.equal('1362/2/25')
      moment(m).add(4, 'jyears').format(jf).should.be.equal('1363/2/25')
      moment(m).add(10, 'jyears').format(jf).should.be.equal('1369/2/25')
      moment(m).add(20, 'jyears').format(jf).should.be.equal('1379/2/25')
    })

    it('should retain last day of month when adding months or years', function () {
      var jf = 'jYYYY/jM/jD'
        , m = moment('1393/6/31', jf)
      moment(m).add(1, 'jmonth').format(jf).should.be.equal('1393/7/30')
      moment(m).add(5, 'jmonth').format(jf).should.be.equal('1393/11/30')
      moment(m).add(6, 'jmonth').format(jf).should.be.equal('1393/12/29')

      m = moment('1391/12/30', jf)
      moment(m).add(1, 'jyear').format(jf).should.be.equal('1392/12/29')
      moment(m).add(2, 'jyear').format(jf).should.be.equal('1393/12/29')
      moment(m).add(3, 'jyear').format(jf).should.be.equal('1394/12/29')
      moment(m).add(4, 'jyear').format(jf).should.be.equal('1395/12/30')
    })

    it('should return invalid moment instance if years is larger than 3177 (add year)', function () {
      var m = moment('3177-01-01', 'jYYYY-jMM-jDD')
      m.add(1, 'jyear')

      m.isValid().should.be.false
      m.jYear().should.be.NaN
      m.jMonth().should.be.NaN
      m.jDate().should.be.NaN
    })

    it('should return invalid moment instance if years is larger than 3177 (add month)', function () {
      var m = moment('3177-01-01', 'jYYYY-jMM-jDD')
      m.add(12, 'jmonth')

      m.isValid().should.be.false
      m.jYear().should.be.NaN
      m.jMonth().should.be.NaN
      m.jDate().should.be.NaN
    })

    it('should return invalid moment instance if years is larger than 3177 (add day)', function () {
      var m = moment('3177-01-01', 'jYYYY-jMM-jDD')
      m.add(365, 'day')

      m.isValid().should.be.false
      m.jYear().should.be.NaN
      m.jMonth().should.be.NaN
      m.jDate().should.be.NaN
    })

    it('should return invalid moment instance if years is larger than 3177 (add seconds)', function () {
      var m = moment('3177-01-01', 'jYYYY-jMM-jDD')
      m.add(365 * 3600 * 24, 'seconds') // 365 days

      m.isValid().should.be.false
      m.jYear().should.be.NaN
      m.jMonth().should.be.NaN
      m.jDate().should.be.NaN
    })
  })

  describe('#subtract', function () {
    it('should subtract gregorian dates correctly', function () {
      var gf = 'YYYY-M-D'
        , m = moment('1980-5-15', 'YYYY-M-D')
      moment(m).subtract(1, 'day').format(gf).should.be.equal('1980-5-14')
      moment(m).subtract(10, 'days').format(gf).should.be.equal('1980-5-5')
      moment(m).subtract(30, 'days').format(gf).should.be.equal('1980-4-15')
      moment(m).subtract(60, 'days').format(gf).should.be.equal('1980-3-16')

      moment(m).subtract(1, 'month').format(gf).should.be.equal('1980-4-15')
      moment(m).subtract(2, 'months').format(gf).should.be.equal('1980-3-15')
      moment(m).subtract(10, 'months').format(gf).should.be.equal('1979-7-15')
      moment(m).subtract(20, 'months').format(gf).should.be.equal('1978-9-15')

      moment(m).subtract(1, 'year').format(gf).should.be.equal('1979-5-15')
      moment(m).subtract(2, 'years').format(gf).should.be.equal('1978-5-15')
      moment(m).subtract(10, 'years').format(gf).should.be.equal('1970-5-15')
      moment(m).subtract(20, 'years').format(gf).should.be.equal('1960-5-15')
    })

    it('should subtract jalaali dates correctly', function () {
      var jf = 'jYYYY/jM/jD'
        , m = moment('1359/2/25', 'jYYYY/jM/jD')
      moment(m).subtract(1, 'day').format(jf).should.be.equal('1359/2/24')
      moment(m).subtract(4, 'days').format(jf).should.be.equal('1359/2/21')
      moment(m).subtract(10, 'days').format(jf).should.be.equal('1359/2/15')
      moment(m).subtract(30, 'days').format(jf).should.be.equal('1359/1/26')
      moment(m).subtract(60, 'days').format(jf).should.be.equal('1358/12/26')
      moment(m).subtract(365, 'days').format(jf).should.be.equal('1358/2/26')

      moment(m).subtract(1, 'jmonth').format(jf).should.be.equal('1359/1/25')
      moment(m).subtract(2, 'jmonths').format(jf).should.be.equal('1358/12/25')
      moment(m).subtract(10, 'jmonths').format(jf).should.be.equal('1358/4/25')
      moment(m).subtract(20, 'jmonths').format(jf).should.be.equal('1357/6/25')

      moment(m).subtract(1, 'jyear').format(jf).should.be.equal('1358/2/25')
      moment(m).subtract(2, 'jyears').format(jf).should.be.equal('1357/2/25')
      moment(m).subtract(3, 'jyears').format(jf).should.be.equal('1356/2/25')
      moment(m).subtract(4, 'jyears').format(jf).should.be.equal('1355/2/25')
      moment(m).subtract(10, 'jyears').format(jf).should.be.equal('1349/2/25')
      moment(m).subtract(20, 'jyears').format(jf).should.be.equal('1339/2/25')
    })

    it('should retain last day of month when subtracting months or years', function () {
      var jf = 'jYYYY/jM/jD'
        , m = moment('1393/1/31', jf)
      moment(m).subtract(1, 'jmonth').format(jf).should.be.equal('1392/12/29')
      moment(m).subtract(6, 'jmonth').format(jf).should.be.equal('1392/7/30')
      moment(m).subtract(7, 'jmonth').format(jf).should.be.equal('1392/6/31')

      m = moment('1391/12/30', jf)
      moment(m).subtract(1, 'jyear').format(jf).should.be.equal('1390/12/29')
      moment(m).subtract(2, 'jyear').format(jf).should.be.equal('1389/12/29')
      moment(m).subtract(3, 'jyear').format(jf).should.be.equal('1388/12/29')
      moment(m).subtract(4, 'jyear').format(jf).should.be.equal('1387/12/30')
    })

    it('should subtract months correctly', function () {
      var jf = 'jYYYY/jM/jD'
        , m = moment('1393/1/31', jf)
      moment(m).subtract(1, 'jmonth').format(jf).should.be.equal('1392/12/29')
      moment(m).subtract(2, 'jmonth').format(jf).should.be.equal('1392/11/30')
      moment(m).subtract(7, 'jmonth').format(jf).should.be.equal('1392/6/31')
      moment(m).subtract(12, 'jmonth').format(jf).should.be.equal('1392/1/31')
      moment(m).subtract(13, 'jmonth').format(jf).should.be.equal('1391/12/30')
      moment(m).subtract(25, 'jmonth').format(jf).should.be.equal('1390/12/29')

      m = moment('1393/1/1', jf)
      moment(m).subtract(1, 'jmonth').format(jf).should.be.equal('1392/12/1')
      moment(m).subtract(2, 'jmonth').format(jf).should.be.equal('1392/11/1')
      moment(m).subtract(7, 'jmonth').format(jf).should.be.equal('1392/6/1')
      moment(m).subtract(12, 'jmonth').format(jf).should.be.equal('1392/1/1')
      moment(m).subtract(13, 'jmonth').format(jf).should.be.equal('1391/12/1')
      moment(m).subtract(25, 'jmonth').format(jf).should.be.equal('1390/12/1')

      m = moment('1393/1/10', jf)
      moment(m).subtract(1, 'jmonth').format(jf).should.be.equal('1392/12/10')
      moment(m).subtract(2, 'jmonth').format(jf).should.be.equal('1392/11/10')
      moment(m).subtract(7, 'jmonth').format(jf).should.be.equal('1392/6/10')
      moment(m).subtract(12, 'jmonth').format(jf).should.be.equal('1392/1/10')
      moment(m).subtract(13, 'jmonth').format(jf).should.be.equal('1391/12/10')
      moment(m).subtract(25, 'jmonth').format(jf).should.be.equal('1390/12/10')
    })
  })

  describe('.jIsLeapYear', function() {
    it('should return true for Jalaali leap years and false otherwise', function() {
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
    })
  })

  describe('.loadPersian', function() {
    it('should load Persian lang', function() {
      var ol = moment.locale()
        , m
      moment.loadPersian()
      m = moment('1980-05-15')
      m.format('D MMMM YYYY').should.be.equal('15 مه 1980')
      m.format('jD jMMMM jYYYY').should.be.equal('25 اردیبهشت 1359')
      m.calendar().should.be.equal('1359/02/25')
      m.format('LLLL').should.be.equal('پنج‌شنبه، 25 اردیبهشت 1359 00:00')
      m.format('llll').should.be.equal('پنج‌شنبه، 25 ارد 1359 00:00')
      moment.locale(ol)
    })
  })

  describe('.loadPersian({usePersianDigits: true})', function() {
    it('should load Persian lang with usePersianDigits = true', function() {
      var ol = moment.locale()
        , m
      moment.loadPersian({usePersianDigits: true})
      m = moment('1980-05-15')
      m.format('D MMMM YYYY').should.be.equal('۱۵ مه ۱۹۸۰')
      m.format('jD jMMMM jYYYY').should.be.equal('۲۵ اردیبهشت ۱۳۵۹')
      m.calendar().should.be.equal('۱۳۵۹/۰۲/۲۵')
      m.format('LLLL').should.be.equal('پنج‌شنبه، ۲۵ اردیبهشت ۱۳۵۹ ۰۰:۰۰')
      m.format('llll').should.be.equal('پنج‌شنبه، ۲۵ ارد ۱۳۵۹ ۰۰:۰۰')
      moment.locale(ol)
    })
  })

  describe('.loadPersian({dialect: persian-modern})', function() {
    it('should load Persian lang with dialect = persian-modern', function() {
      var ol = moment.locale()
        , m
      moment.loadPersian({dialect: 'persian-modern'})
      m = moment('1980-05-19')
      m.format('D MMMM YYYY').should.be.equal('19 مه 1980')
      m.format('jD jMMMM jYYYY').should.be.equal('29 اردیبهشت 1359')
      m.calendar().should.be.equal('1359/02/29')
      m.format('LLLL').should.be.equal('دوشنبه، 29 اردیبهشت 1359 00:00')
      m.format('llll').should.be.equal('دوشنبه، 29 ارد 1359 00:00')
      m.format('dd lll').should.be.equal('د 29 ارد 1359 00:00')
      moment.locale(ol)
    })
  })

  describe('.unix', function () {
    it('should create a moment with unix epoch', function () {
      var unix = moment('1359/2/25', 'jYYYY/jM/jD').unix()
      moment.unix(unix).format('jYYYY/jM/jD').should.be.equal('1359/2/25')
    })
  })

  describe('#isSame', function () {
    it('should work correctly for same year', function () {
      var m1 = moment('2016-02-04')
      var m2 = moment('2016-01-01')
      var m3 = moment('2015-12-31')
      var m4 = moment('2017-01-01')
      m1.isSame(m2, 'year').should.be.true
      m1.isSame(m3, 'year').should.be.false
      m1.isSame(m4, 'year').should.be.false
      m2.isSame(m3, 'year').should.be.false
      m2.isSame(m4, 'year').should.be.false
      m3.isSame(m4, 'year').should.be.false
    })

    it('should work correctly for same month', function () {
      var m1 = moment('2016-02-04')
      var m2 = moment('2016-02-01')
      var m3 = moment('2016-01-01')
      var m4 = moment('2016-03-01')
      m1.isSame(m2, 'month').should.be.true
      m1.isSame(m3, 'month').should.be.false
      m1.isSame(m4, 'month').should.be.false
      m2.isSame(m3, 'month').should.be.false
      m2.isSame(m4, 'month').should.be.false
      m3.isSame(m4, 'month').should.be.false
    })

    it('should work correctly for same day', function () {
      var m1 = moment('2016-02-04 06:00')
      var m2 = moment('2016-02-04 07:00')
      var m3 = moment('2016-02-03 06:00')
      var m4 = moment('2016-02-05 06:00')
      m1.isSame(m2, 'day').should.be.true
      m1.isSame(m3, 'day').should.be.false
      m1.isSame(m4, 'day').should.be.false
      m2.isSame(m3, 'day').should.be.false
      m2.isSame(m4, 'day').should.be.false
      m3.isSame(m4, 'day').should.be.false
    })

    it('should work correctly for same jyear', function () {
      var m1 = moment('1394/11/15', 'jYYYY/jMM/jDD')
      var m2 = moment('1394/01/01', 'jYYYY/jMM/jDD')
      var m3 = moment('1393/11/15', 'jYYYY/jMM/jDD')
      var m4 = moment('1395/11/15', 'jYYYY/jMM/jDD')
      m1.isSame(m2, 'jyear').should.be.true
      m1.isSame(m3, 'jyear').should.be.false
      m1.isSame(m4, 'jyear').should.be.false
      m2.isSame(m3, 'jyear').should.be.false
      m2.isSame(m4, 'jyear').should.be.false
      m3.isSame(m4, 'jyear').should.be.false
    })

    it('should work correctly for same jmonth', function () {
      var m1 = moment('1394/11/15', 'jYYYY/jMM/jDD')
      var m2 = moment('1394/11/01', 'jYYYY/jMM/jDD')
      var m3 = moment('1394/10/15', 'jYYYY/jMM/jDD')
      var m4 = moment('1394/12/15', 'jYYYY/jMM/jDD')
      m1.isSame(m2, 'jmonth').should.be.true
      m1.isSame(m3, 'jmonth').should.be.false
      m1.isSame(m4, 'jmonth').should.be.false
      m2.isSame(m3, 'jmonth').should.be.false
      m2.isSame(m4, 'jmonth').should.be.false
      m3.isSame(m4, 'jmonth').should.be.false
    })
  })
})
