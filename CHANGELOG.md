## 0.10.5

* Fix `isValid()` wrongly returning `true` for dates outside the supported
  range when running against moment >= 2.30. moment 2.30 stopped memoizing
  `isValid()`, so the internal `_isValid = false` assignment was recomputed
  away on every call; moment's own `userInvalidated` parsing flag is now
  raised alongside it. This also affects the published 0.10.4, whose
  `moment: ^2.29.4` range resolves to 2.30 today.

(Releases 0.8.0 through 0.10.4 are not recorded here; see the git history.)

## 0.7.3

* Fix locale fa loading based on moment documentation (#134)

## 0.7.2

* Fix when formatting using LTS local formatting token (#106)

## 0.7.1

* Support modern persian via dialect option, see [here](https://github.com/jalaali/moment-jalaali/issues/101)

## 0.7.0

* Support persian digits. Disabled by default.
* Drop support for component
* Drop support for bower
* Simplify build process
