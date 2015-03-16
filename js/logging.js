// Avoid `console` errors in browsers that lack a console.
// Disable console logging in production
(function() {
    var method
        , noop = function () {}
        , methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ]
        , length = methods.length
        , console = (window.console = window.console || {})
        , disableLogging = !(typeof IS_LOGGING_ENABLED !== 'undefined' ? IS_LOGGING_ENABLED : false);

    while (length--) {
        method = methods[length];

        if (disableLogging || !console[method]) {
            console[method] = noop;
        }

    }
}());
