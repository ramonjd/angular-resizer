
angular.module('resizer', [])
    .factory('resizerUtilities', function resizerUtilities(){
            var _utils = {};
            _utils.is = {
                ie10: function () {
                    return document.documentMode && document.documentMode === 10;
                },
                ie8 : function(){
                    return document.documentMode && document.documentMode === 8;
                }
            };

        // support checks
        _utils.supports = {

            getComputedStyle: function () {
                return 'getComputedStyle' in window;
            },

            orientation: function () {
                return 'orientation' in window;
            },

            requestAnimationFrame: function () {
                return window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
            },

            transitions: function () {
                var thisBody = document.body || document.documentElement,
                    thisStyle = thisBody.style,
                    support = thisStyle.transition !== undefined ||
                        thisStyle.WebkitTransition !== undefined ||
                        thisStyle.MozTransition !== undefined ||
                        thisStyle.MsTransition !== undefined ||
                        thisStyle.OTransition !== undefined;
                return support;
            }
        };

        return _utils;
    })
    .factory('resizerService', function ResizerService($document, resizerUtilities) {
        'use strict';

        var id = 'resizer',
            $body = $document.find('body'),
            $html = $document.find('html'),
            // so we can hook window.resize if necessary
            isIE8 = resizerUtilities.is.ie8(),
            $resizeElem = $('<div id="' + id + '"></div>'),
            currentHeight, currentWidth, windowHeight, windowWidth,
            responsiveParams = {
                breakpoint: null,
                orientation: null,
                direction: null
            },
        // an array of objects
            observers = [],
            transEndEventNames = ['webkitTransitionEnd', 'transitionend', 'MSTransitionEnd', 'oTransitionEnd'],
            requestAnimationFrame = resizerUtilities.supports.requestAnimationFrame(),
            running = false,
        // it's your own fault IE.10... you support transition event but don't fire transitionEnd
            supportsTransitionEnd = (resizerUtilities.supports.transitions() && !resizerUtilities.is.ie10()),
            supportsGetComputedStyle = resizerUtilities.supports.getComputedStyle(),
            supportsOrientation = resizerUtilities.supports.orientation(),
            resizeTimeout;

        /**
         * setDirection - checks the resize direction if the width and height of window
         * @returns {object}
         */
        function setDirection() {

            var direction = {
                x : 0,
                y : 0
            };

            windowHeight = $(window).height();
            windowWidth = $(window).width();

            if (currentWidth !== 'undefined' && windowWidth < currentWidth) {
                direction.x = -1;
            }

            if (currentWidth !== 'undefined' && windowWidth > currentWidth) {
                direction.x = 1;
            }

            if (currentHeight !== 'undefined' && windowHeight < currentHeight) {
                direction.y = -1;
            }

            if (currentHeight !== 'undefined' && windowHeight > currentHeight) {
                direction.y = 1;
            }

            responsiveParams.direction = direction;

            currentHeight = windowHeight;
            currentWidth = windowWidth;

            return responsiveParams.direction;

        }

        /**
         * setBreakpoint - return the :after value (see _resize-listener.scss) ie9++
         * @returns {string} xs, sm, md, lg
         */
        function setBreakpoint() {
            var bp = null;
            if (supportsGetComputedStyle) {
                bp = window.getComputedStyle($resizeElem[0], ':after').getPropertyValue('content');
                bp = (bp && bp !== 'none') ? bp.replace(/"/g, '') : null; // Firefox
            } else {
                // this is for you IE8, you piece of crap
                bp = $resizeElem[0].style.fontFamily;
            }
            responsiveParams.breakpoint = bp;
            return bp;
        }

        /**
         * setOrientation - checks the height and length
         * @returns {string} 'portrait' or 'landscape'
         */
        function setOrientation() {
            if (supportsOrientation === false) {
                responsiveParams.orientation = ($(window).width() > $(window).height()) ? 'landscape' : 'portrait';
            } else {
                responsiveParams.orientation = Math.abs(window.orientation) > 0 ? 'landscape' : 'portrait';
            }
            return responsiveParams.orientation;
        }

        /**
         * setResponsiveParams - calls all functions that set params
         * @returns {object} responsiveParams
         */
        function setResponsiveParams() {
            setDirection();
            setOrientation();
            setBreakpoint();
            return responsiveParams;
        }

        // Resize Events

        /**
         * setResizeTimeout - kicks off setTimeout
         */
        function setResizeTimeout() {
            resizeTimeout = setTimeout(function () {
                resizeCallback();
            }, 66);
        }

        /**
         * resizeCallback - called whenever the target $elem is resized and triggers resize event
         */
        function resizeCallback() {
            var i = 0,
                j = observers.length;

            setDirection();
            setBreakpoint();
            setOrientation();
            for (i; i < j; i++) {
                observers[i]['func'].apply(null, [responsiveParams]);
            }

            running = false;
        }

        /**
         * attachTransitionEndEvents - for browsers that support TransitionEnd
         */
        function attachTransitionEndEvents() {
            $resizeElem.on(transEndEventNames.join(' '), function () {
                            console.log(running);

                if (running === false) {
                    running = true;
                    resizeCallback();
                }
            });
        }

        /**
         * attachWindowResize - for browsers that DO NOT support TransitionEnd
         * https://developer.mozilla.org/en-US/docs/Web/Events/resize
         * ie8 fix - http://forum.jquery.com/topic/ie-lt-9-window-resize-infinite-looping
         */


        function attachWindowResize() {
            $(window).bind('resize', function () {
                if (running === false) {
                    running = true;

                    if (requestAnimationFrame) {

                        requestAnimationFrame(resizeCallback);

                    } else if (isIE8) {

                        windowHeight = utils.height(window);
                        windowWidth = utils.width(window);

                        if ((currentHeight === 'undefined' || currentHeight !== windowHeight) || (currentWidth === 'undefined' || currentWidth !== windowWidth)) {
                            currentHeight = windowHeight;
                            currentWidth = windowWidth;
                            setResizeTimeout();
                        } else {
                            running = false;
                        }

                    } else {
                        setResizeTimeout();
                    }
                }

            });
        }


        // Public functions

        /**
         * register - registers a function to be fired on resize
         */
        function register(key, func) {

            if (key && typeof getObserver(key) !== 'object' && typeof func === 'function') {
                observers.push({
                    'key': key,
                    'func': func
                });
            }
        }

        /**
         * deregister - removes registered function
         */
        function deregister(key) {
            var i = observers.length;
            while (i--) {
                if (observers[i].hasOwnProperty('key') && observers[i]['key'] === key) {
                    observers.splice(i, 1);
                }
            }
            return observers;
        }


        /**
         * getObserver - returns registered function
         */
        function getObserver(key) {
            var i = 0,
                j = observers.length,
                o;
            for (i; i < j; i++) {
                if (observers[i]['key'] === key) {
                    o = observers[i];
                    break;
                }
            }
            return o;
        }

        /**
         * getResponsiveParams - returns current responsiveParams
         */

        function getResponsiveParams() {
            return setResponsiveParams();
        }


        // init
        $body.append($resizeElem);
        $resizeElem = $($document[0].getElementById(id));


        // set current values
        setResponsiveParams();

        // attach resize events
        // fork for older browsers
        if (supportsTransitionEnd === true) {
            attachTransitionEndEvents();
        } else {
            attachWindowResize();
        }


        return {
            getParams: getResponsiveParams,
            register: register,
            deregister: deregister,
            observers: observers,
            getObserver: getObserver
        };

    });




