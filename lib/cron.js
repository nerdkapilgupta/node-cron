(function (root, factory) {
  // Check if AMD is available
  if (typeof define === 'function' && define.amd) {
    // Define module using AMD
    define(['luxon'], factory);
  }
  // Check if CommonJS is available
  else if (typeof exports === 'object') {
    // Export module using CommonJS
    module.exports = factory(require('luxon'), require('child_process'));
  }
  // Default to global object (browser)
  else {
    root.Cron = factory(root.luxon);
  }
})(this, function (luxon, childProcess) {
  // Create exports object
  const exports = {};

  // Check if childProcess is available
  const spawn = childProcess && childProcess.spawn;

  // Require CronTime module
  const CronTime = require('./time')(luxon);

  // Require CronJob module
  const CronJob = require('./job')(CronTime, spawn);

  /**
   * Extend Luxon DateTime
   * Add a method 'getWeekDay' to the prototype of DateTime object.
   * This method returns the weekday (0-6) where Sunday is 0.
   */
  luxon.DateTime.prototype.getWeekDay = function () {
    // Use a ternary operator instead of if-else to determine weekday
    return this.weekday === 7 ? 0 : this.weekday;
  };

  /**
   * Create new CronJob instance using factory function
   * This function creates and returns a new CronJob instance.
   */
  exports.job = function (
    cronTime,
    onTick,
    onComplete,
    startNow,
    timeZone,
    context,
    runOnInit,
    utcOffset,
    unrefTimeout
  ) {
    return new CronJob(
      cronTime,
      onTick,
      onComplete,
      startNow,
      timeZone,
      context,
      runOnInit,
      utcOffset,
      unrefTimeout
    );
  };

  /**
   * Create new CronTime instance using factory function
   * This function creates and returns a new CronTime instance.
   */
  exports.time = function (cronTime, timeZone) {
    return new CronTime(cronTime, timeZone);
  };

  /**
   * Shortcut method to get the sendAt time from CronTime instance
   * This function creates a new CronTime instance and returns the sendAt time.
   */
  exports.sendAt = function (cronTime) {
    return exports.time(cronTime).sendAt();
  };

  /**
   * Shortcut method to get the timeout value from CronTime instance
   * This function creates a new CronTime instance and returns the timeout value.
   */
  exports.timeout = function (cronTime) {
    return exports.time(cronTime).getTimeout();
  };

  // Export CronJob and CronTime constructors
  exports.CronJob = CronJob;
  exports.CronTime = CronTime;

  // Return the exports object as the module's public API
  return exports;
});
