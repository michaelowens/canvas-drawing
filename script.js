/*jslint browser: true, plusplus: true, todo: true */
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

    draw.points = [];
    draw.isDrawing = false;

    /**
     * Initialize the canvas
     */
    draw.init = function () {
        draw.getCanvas();
        draw.setCanvasSettings();
        draw.setBindings();
    };

    /**
     * Store the canvas element and context
     */
    draw.getCanvas = function () {
        draw.el = document.getElementById('drawing');
        draw.context = draw.el.getContext('2d');
    };

    /**
     * Sets width, height, default lineWidth and lineJoin for the canvas
     */
    draw.setCanvasSettings = function () {
        draw.el.width = document.body.clientWidth - 50;
        draw.el.height = document.body.clientHeight;

        draw.context.lineWidth = 1.2;
        draw.context.lineJoin = draw.context.lineCap = 'round';
    };

    /**
     * Sets mouse bindings
     */
    draw.setBindings = function () {
        draw.el.onmousedown = draw.onMouseDown;
        draw.el.onmousemove = draw.onMouseMove;
        draw.el.onmouseup = draw.onMouseUp;
    };

    /**
     * On mouse down binding
     * @param e
     */
    draw.onMouseDown = function (e) {
        draw.points = [];
        draw.isDrawing = true;
        draw.points.push({x: e.clientX, y: e.clientY});
    };

    /**
     * On mouse move binding
     * TODO: make this b-e-a-utiful
     * @param e
     */
    draw.onMouseMove = function (e) {
        if (!draw.isDrawing) {
            return;
        }

        draw.points.push({x: e.clientX, y: e.clientY});

        var len = draw.points.length,
            last_point = draw.points[len - 1],
            second_last_point = draw.points[len - 2],
            current_point,
            d,
            dx,
            dy;

        draw.context.globalCompositeOperation = "source-over";
        draw.context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        draw.context.lineWidth = 1;
        if (Toolbar.activeTool === 'pencil') {
            draw.context.strokeStyle = 'rgba(255, 255, 255, 1)';
        }
        if (Toolbar.activeTool === 'eraser') {
            draw.context.globalCompositeOperation = "destination-out";
            draw.context.strokeStyle = "rgba(0, 0, 0, 1)";
            draw.context.lineWidth = 15;
        }

        draw.context.beginPath();
        draw.context.moveTo(second_last_point.x, second_last_point.y);
        draw.context.lineTo(last_point.x, last_point.y);
        draw.context.stroke();

        if (Toolbar.activeTool === 'brush1') {
            while (len--) {
                current_point = draw.points[len];

                dx = current_point.x - last_point.x;
                dy = current_point.y - last_point.y;

                d = dx * dx + dy * dy;

                if (Toolbar.activeTool === 'brush1') {
                    // nearest neighbor
                    if (d < 1000) {
                        draw.context.beginPath();
                        draw.context.moveTo(last_point.x + (dx * 0.2), last_point.y + (dy * 0.2));
                        draw.context.lineTo(current_point.x - (dx * 0.2), current_point.y - (dy * 0.2));
                        draw.context.stroke();
                    }
                }

                // nearest neighbor furry
//                if (d < 2000 && Math.random() > d / 2000) {
//                    draw.context.beginPath();
//                    draw.context.moveTo(last_point.x + (dx * 0.5), last_point.y + (dy * 0.5));
//                    draw.context.lineTo(last_point.x - (dx * 0.5), last_point.y - (dy * 0.5));
//                    draw.context.stroke();
//                }
            }
        }
    };

    /**
     * On mouse up binding
     */
    draw.onMouseUp = function () {
        draw.isDrawing = false;
        draw.points = [];
    };
}(Draw));

/**
 * Toolbar object
 */
(function (toolbar) {
    'use strict';

    var activeButton;

    toolbar.activeTool = 'pencil';

    /**
     * Initialize the toolbar
     */
    toolbar.init = function () {
        this.bindButtons();
    };

    /**
     * Bind toolbar buttons
     */
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

    /**
     * Toolbar button on click
     */
    toolbar.onClick = function () {
        Helpers.removeClass(activeButton, 'active');
        Helpers.addClass(this, 'active');
        activeButton = this;
        toolbar.activeTool = this.getAttribute('tool');
    };
}(Toolbar));

Draw.init();
Toolbar.init();
