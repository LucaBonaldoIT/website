/**
 * Generative dot fields — a polar log/atan2 interference pattern.
 *
 * Each field is a grid of dots whose radii follow
 *   cos(cos(x - t) + 2 cos((y - t) - |sin(x - t)|))
 * where (x, y) are the log-polar coordinates of the cell relative to a
 * fixed pole, producing a slowly rotating spiral. Negative regions are
 * drawn in the accent color, the rest in the surface's foreground ink.
 *
 * p5 runs in instance mode. Animation pauses off-viewport and when the
 * tab is hidden; prefers-reduced-motion gets a single static frame.
 */
(function () {
    'use strict';

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    var finePointer = window.matchMedia('(pointer: fine)');

    var FIELDS = [
        {
            id: 'hero-field',
            ink: [26, 23, 18, 220],
            accent: [176, 46, 12, 235],
            pole: { x: 0.68, y: 0.62 },
            speed: 0.022,
            pointer: true
        },
        {
            id: 'contact-field',
            ink: [240, 236, 223, 200],
            accent: [224, 82, 45, 235],
            pole: { x: 0.25, y: 0.85 },
            speed: 0.01,
            pointer: false
        }
    ];

    function cellSize(width) {
        return width < 640 ? 30 : 26;
    }

    function makeSketch(cfg, host) {
        return function (p) {
            var cols = 0;
            var rows = 0;
            var cellW = 0;
            var cellH = 0;
            var dia = 0;
            var logs = null;   // per-cell log-polar radius (static per layout)
            var angles = null; // per-cell log-polar angle (static per layout)
            var t = 2.4;       // fixed start also serves as the static frame
            var phase = 0;
            var phaseTarget = 0;
            var inView = true;
            var resizeTimer = 0;

            function rebuild(w, h) {
                var cell = cellSize(w);
                cols = Math.max(6, Math.round(w / cell));
                rows = Math.max(6, Math.round(h / cell));
                // cap the cell count so large screens stay cheap
                while (cols * rows > 3200) {
                    cols = Math.round(cols * 0.92);
                    rows = Math.round(rows * 0.92);
                }
                cellW = w / cols;
                cellH = h / rows;
                dia = Math.min(cellW, cellH) * 0.68;
                var pu = cols * cfg.pole.x;
                var pv = rows * cfg.pole.y;
                logs = new Float32Array(cols * rows);
                angles = new Float32Array(cols * rows);
                for (var i = 0; i < cols; i++) {
                    for (var j = 0; j < rows; j++) {
                        var dx = i - pu;
                        var dy = j - pv;
                        var k = i * rows + j;
                        if (dx === 0 && dy === 0) {
                            logs[k] = 0;
                            angles[k] = 0;
                        } else {
                            logs[k] = 6 * Math.log(Math.sqrt(dx * dx + dy * dy));
                            angles[k] = 6 * Math.atan2(dy, dx);
                        }
                    }
                }
            }

            function running() {
                return inView && !document.hidden && !reducedMotion.matches;
            }

            function sync() {
                if (running()) {
                    p.loop();
                } else {
                    p.noLoop();
                }
            }

            p.setup = function () {
                p.createCanvas(host.clientWidth, host.clientHeight);
                p.pixelDensity(Math.min(window.devicePixelRatio || 1, 2));
                p.noStroke();
                p.frameRate(30);
                rebuild(p.width, p.height);
                p.describe('Grid of dots whose sizes follow a slowly rotating spiral interference pattern.');

                var io = new IntersectionObserver(function (entries) {
                    inView = entries[0].isIntersecting;
                    sync();
                }, { rootMargin: '80px' });
                io.observe(host);

                document.addEventListener('visibilitychange', sync);
                reducedMotion.addEventListener('change', function () {
                    sync();
                    p.redraw();
                });

                new ResizeObserver(function () {
                    clearTimeout(resizeTimer);
                    resizeTimer = setTimeout(function () {
                        var w = host.clientWidth;
                        var h = host.clientHeight;
                        if (w > 0 && h > 0 && (w !== p.width || h !== p.height)) {
                            p.resizeCanvas(w, h);
                            rebuild(w, h);
                            if (!running()) {
                                p.redraw();
                            }
                        }
                    }, 120);
                }).observe(host);

                if (cfg.pointer && finePointer.matches) {
                    // Pointer nudges the pattern's phase, not its geometry:
                    // a subtle scrub, eased in draw().
                    host.parentElement.addEventListener('pointermove', function (e) {
                        var r = host.parentElement.getBoundingClientRect();
                        var nx = (e.clientX - r.left) / r.width - 0.5;
                        var ny = (e.clientY - r.top) / r.height - 0.5;
                        phaseTarget = nx * 0.9 + ny * 0.45;
                    });
                    host.parentElement.addEventListener('pointerleave', function () {
                        phaseTarget = 0;
                    });
                }

                sync();
            };

            p.draw = function () {
                p.clear();
                phase += (phaseTarget - phase) * 0.05;
                var tt = t + phase;
                var pad = dia / 2;
                for (var i = 0; i < cols; i++) {
                    var x = i * cellW + cellW / 2;
                    for (var j = 0; j < rows; j++) {
                        var k = i * rows + j;
                        var a = logs[k] - tt;
                        var pattern = Math.cos(
                            Math.cos(a) +
                            2 * Math.cos((angles[k] - tt) - Math.abs(Math.sin(a)))
                        );
                        var radius = dia * Math.abs(2 / (1 + Math.exp(-5 * pattern)) - 1);
                        if (radius < 0.5) {
                            continue;
                        }
                        var c = pattern < 0 ? cfg.accent : cfg.ink;
                        p.fill(c[0], c[1], c[2], c[3]);
                        p.circle(x, j * cellH + cellH / 2, Math.min(radius, dia + pad));
                    }
                }
                if (running()) {
                    t += cfg.speed;
                }
            };
        };
    }

    function init() {
        FIELDS.forEach(function (cfg) {
            var host = document.getElementById(cfg.id);
            if (!host || host.dataset.fieldInit) {
                return;
            }
            host.dataset.fieldInit = '1';
            if (typeof p5 === 'undefined') {
                host.classList.add('field--fallback');
                return;
            }
            new p5(makeSketch(cfg, host), host);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
