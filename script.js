(function (window) {
    'use strict';

    var el = document.getElementById('drawing'),
        ctx = el.getContext('2d'),
        points = [], isDrawing;

    el.width = document.body.clientWidth;
    el.height = document.body.clientHeight;

    ctx.lineWidth = 1.2;
    ctx.lineJoin = ctx.lineCap = 'round';

    el.onmousedown = function (e) {
        points = [];
        isDrawing = true;
        points.push({x: e.clientX, y: e.clientY});
    };

    el.onmousemove = function (e) {
        if (!isDrawing) return;

        points.push({x: e.clientX, y: e.clientY});

        var len = points.length,
            last_point = points[len - 1],
            second_last_point = points[len - 2],
            current_point, d, dx, dy;

        ctx.strokeStyle = 'rgba(255,255,255,0.1)';

        ctx.beginPath();
        ctx.moveTo(second_last_point.x, second_last_point.y);
        ctx.lineTo(last_point.x, last_point.y);
        ctx.stroke();

        while (len--) {
            current_point = points[len];

            dx = current_point.x - last_point.x;
            dy = current_point.y - last_point.y;

            d = dx * dx + dy * dy;

            // nearest neighbor
            if (d < 1000) {
                ctx.beginPath();
                ctx.moveTo(last_point.x + (dx * 0.2), last_point.y + (dy * 0.2));
                ctx.lineTo(current_point.x - (dx * 0.2), current_point.y - (dy * 0.2));
                ctx.stroke();
            }

            // nearest neighbor furry
//            if (d < 2000 && Math.random() > d / 2000) {
//                ctx.beginPath();
//                ctx.moveTo(last_point.x + (dx * 0.5), last_point.y + (dy * 0.5));
//                ctx.lineTo(last_point.x - (dx * 0.5), last_point.y - (dy * 0.5));
//                ctx.stroke();
//            }
        }
    };

    el.onmouseup = function () {
        isDrawing = false;
        points = [];
    };
}(this));
