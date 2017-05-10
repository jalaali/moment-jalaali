});

if (typeof exports == "object") {
  module.exports = require("moment-jalaali");
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return require("moment-jalali"); });
} else {
  this["moment"] = require("moment-jalali");
}
})();
