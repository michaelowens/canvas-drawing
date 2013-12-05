/*jslint browser: true, plusplus: true */
var Helpers = {},
    Draw = {},
    Toolbar = {};

/**
 * Helpers
 */
(function (helpers) {
    'use strict';
    /**
     * Checks if an element has a class
     * @source http://rockycode.com/blog/addremove-classes-raw-javascript/
     * @param el
     * @param className
     * @returns {boolean}
     */
    helpers.hasClass = function (el, className) {
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    };

    /**
     * Adds a class to an element
     * @param el
     * @param className
     * @returns {boolean}
     */
    helpers.addClass = function (el, className) {
        if (this.hasClass(el, className)) {
            return true;
        }

        el.className += ' ' + className;
        return true;
    };

    /**
     * Removes a class from an element
     * @source http://rockycode.com/blog/addremove-classes-raw-javascript/
     * @param el
     * @param className
     * @returns {boolean}
     */
    helpers.removeClass = function (el, className) {
        if (!this.hasClass(el, className)) {
            return false;
        }

        el.className = el.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ');
        return true;
    };
}(Helpers));

/**
 * Draw object
 */
(function (draw) {
    'use strict';

    var el = document.getElementById('drawing'),
        ctx = el.getContext('2d'),
        points = [],
        isDrawing;

    draw.init = function () {
        el.width = document.body.clientWidth - 50;
        el.height = document.body.clientHeight;
    };

    ctx.lineWidth = 1.2;
    ctx.lineJoin = ctx.lineCap = 'round';

    el.onmousedown = function (e) {
        points = [];
        isDrawing = true;
        points.push({x: e.clientX, y: e.clientY});
    };

    el.onmousemove = function (e) {
        if (!isDrawing) {
            return;
        }

        points.push({x: e.clientX, y: e.clientY});

        var len = points.length,
            last_point = points[len - 1],
            second_last_point = points[len - 2],
            current_point,
            d,
            dx,
            dy;

        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        if (Toolbar.activeTool === 'pencil') {
            ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        }
        if (Toolbar.activeTool === 'eraser') {
            ctx.globalCompositeOperation = "destination-out";
            ctx.strokeStyle = "rgba(0, 0, 0, 1)";
            ctx.lineWidth = 15;
        }

        ctx.beginPath();
        ctx.moveTo(second_last_point.x, second_last_point.y);
        ctx.lineTo(last_point.x, last_point.y);
        ctx.stroke();

        if (Toolbar.activeTool === 'brush1') {
            while (len--) {
                current_point = points[len];

                dx = current_point.x - last_point.x;
                dy = current_point.y - last_point.y;

                d = dx * dx + dy * dy;

                if (Toolbar.activeTool === 'brush1') {
                    // nearest neighbor
                    if (d < 1000) {
                        ctx.beginPath();
                        ctx.moveTo(last_point.x + (dx * 0.2), last_point.y + (dy * 0.2));
                        ctx.lineTo(current_point.x - (dx * 0.2), current_point.y - (dy * 0.2));
                        ctx.stroke();
                    }
                }

                // nearest neighbor furry
//                if (d < 2000 && Math.random() > d / 2000) {
//                    ctx.beginPath();
//                    ctx.moveTo(last_point.x + (dx * 0.5), last_point.y + (dy * 0.5));
//                    ctx.lineTo(last_point.x - (dx * 0.5), last_point.y - (dy * 0.5));
//                    ctx.stroke();
//                }
            }
        }
    };

    el.onmouseup = function () {
        isDrawing = false;
        points = [];
    };
}(Draw));

/**
 * Toolbar object
 */
(function (toolbar) {
    'use strict';

    var activeButton;

    toolbar.activeTool = 'pencil';

    toolbar.init = function () {
        this.bindButtons();
    };

    toolbar.bindButtons = function () {
        var buttons = document.querySelectorAll('.toolbar .btn'),
            buttonsIteration = buttons.length,
            button;

        while (buttonsIteration--) {
            button = buttons[buttonsIteration];
            button.addEventListener('click', this.onClick);

            if (Helpers.hasClass(button, 'active')) {
                activeButton = button;
                this.activeTool = button.getAttribute('tool');
            }
        }
    };

    toolbar.onClick = function () {
        Helpers.removeClass(activeButton, 'active');
        Helpers.addClass(this, 'active');
        activeButton = this;
        toolbar.activeTool = this.getAttribute('tool');
    };
}(Toolbar));

Draw.init();
Toolbar.init();
