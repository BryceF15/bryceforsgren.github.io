/* =====================================================================
   flow.js — the hero's live flow field with a turbulent wake.

   What you see
   - Light streaks: tracer particles carried by the flow. Each leaves a
     short fading trail, so together they draw the streamlines and move
     smoothly (nothing is re-traced or redrawn from scratch per frame).
   - A small cylinder (the ring) sits on your cursor. The stream parts
     around it and it sheds a von Karman vortex street behind it.
   - Purple / light-blue smoke: dye released at the cylinder's top and
     bottom separation points, rolling up into the shed vortices.

   Physics
   - Potential flow past a cylinder of radius a at z0:
         dw/dz = U (1 - a^2 / (z - z0)^2)
     faded out downstream of the body, where the real flow has separated.
   - Point vortices of alternating sign shed every ~D/(St U) frames
     (Strouhal number St ~ 0.2), each with a soft core, convecting at
     ~0.85 U, interacting with each other, and slowly decaying.
     A fast-moving cursor sheds stronger vortices.

   Behaviour: follows a mouse/trackpad; drifts on its own on touch; pauses
   off screen and in background tabs; reduced motion gets one still frame.
   Tune everything in CONFIG.
   ===================================================================== */
(function () {
  "use strict";
  var canvas = document.querySelector(".flow");
  if (!canvas || !canvas.getContext) return;
  var hero = canvas.closest(".hero");
  var ctx = canvas.getContext("2d");

  var CONFIG = {
    radius: 15,             // cylinder radius in px (the ring around the cursor)
    speed: 2.1,             // free-stream speed, px per frame at 60 fps
    strouhal: 0.21,         // sets how often vortices shed
    vortexStrength: 5.0,    // circulation, in units of radius * speed
    moveBoost: 1.1,         // extra circulation per px/frame of cursor speed
    decay: 0.9975,          // circulation kept per frame
    tracerDensity: 2600,    // one tracer per this many px^2 of hero
    tracerTrail: 7,         // positions kept per tracer (streak length)
    smokeTrail: 12,         // positions kept per dye particle
    smokePerFrame: 2,       // dye particles per frame on each side
    smokeLife: 330,         // frames a dye particle lives
    tracer: "235,242,255",  // tracer streak colour (RGB)
    top: "214,201,255",     // purple dye, top shear layer
    bottom: "168,226,255",  // light-blue dye, bottom shear layer
  };

  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  var W = 0, H = 0, A = CONFIG.radius;
  var body = { x: 0, y: 0, vx: 0, vy: 0 }, target = { x: 0, y: 0 };
  var vortices = [], tracers = [], smoke = [];
  var shedTimer = 0, shedSign = 1, pointerInside = false, visible = true, raf = 0, last = 0;

  // The ring is a DOM element so it never smears into the trails.
  var ring = document.createElement("div");
  ring.className = "flow-body";
  ring.setAttribute("aria-hidden", "true");
  canvas.after(ring);

  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!body.x) { body.x = target.x = W * 0.42; body.y = target.y = H * 0.58; }
    var n = Math.round(W * H / CONFIG.tracerDensity);
    tracers = [];
    for (var i = 0; i < n; i++) tracers.push(spawn(Math.random() * W));
    if (reduced) still();
  }
  function spawn(x) {
    return { x: x, y: Math.random() * H, h: [], age: 0, life: 240 + Math.random() * 520 };
  }

  // Velocity (px per frame) at (x, y).
  function velocity(x, y) {
    var U = CONFIG.speed, dx = x - body.x, dy = y - body.y;
    var r2 = dx * dx + dy * dy, r4 = r2 * r2 || 1e-6, a2 = A * A;
    var w = dx > 0 ? Math.exp(-dx / (1.5 * A)) : 1;        // separated wake: no rear stagnation point
    var u = U * (1 - w * a2 * (dx * dx - dy * dy) / r4);
    var v = U * (-w * a2 * 2 * dx * dy / r4);
    var core2 = (0.8 * A) * (0.8 * A);
    for (var i = 0; i < vortices.length; i++) {
      var V = vortices[i], ex = x - V.x, ey = y - V.y;
      var k = V.g / (2 * Math.PI * (ex * ex + ey * ey + core2));
      u -= k * ey; v += k * ex;
    }
    return [u, v];
  }

  function step(dt) {
    var U = CONFIG.speed;
    // body chases the cursor (critically damped feel), remember its speed
    var px = body.x, py = body.y, f = 1 - Math.pow(1 - 0.2, dt);
    body.x += (target.x - body.x) * f; body.y += (target.y - body.y) * f;
    body.vx = (body.x - px) / dt; body.vy = (body.y - py) / dt;
    var move = Math.hypot(body.vx, body.vy);

    // shed alternating vortices at the Strouhal frequency
    shedTimer += dt;
    var period = (2 * A) / (CONFIG.strouhal * U) / 2;          // two vortices per cycle
    if (shedTimer >= period) {
      shedTimer = 0;
      var g = (CONFIG.vortexStrength + CONFIG.moveBoost * move) * A * U * shedSign;
      vortices.push({ x: body.x + 1.6 * A, y: body.y - shedSign * 0.6 * A, g: g });
      shedSign *= -1;
      if (vortices.length > 36) vortices.shift();
    }
    // vortices convect and interact
    var core2 = (0.8 * A) * (0.8 * A);
    for (var i = 0; i < vortices.length; i++) {
      var V = vortices[i], u = U * 0.85, v = 0;
      for (var j = 0; j < vortices.length; j++) {
        if (i === j) continue;
        var O = vortices[j], ex = V.x - O.x, ey = V.y - O.y;
        var k = O.g / (2 * Math.PI * (ex * ex + ey * ey + core2));
        u -= k * ey; v += k * ex;
      }
      V.x += u * dt; V.y += v * dt; V.g *= Math.pow(CONFIG.decay, dt);
    }
    vortices = vortices.filter(function (V) { return V.x < W + 60 && Math.abs(V.g) > 2; });

    // advect tracers and dye (midpoint rule), keep them out of the body
    function advect(P, keep) {
      P.h.push(P.x, P.y);
      if (P.h.length > keep * 2) P.h.splice(0, 2);
      var v1 = velocity(P.x, P.y);
      var v2 = velocity(P.x + v1[0] * dt * 0.5, P.y + v1[1] * dt * 0.5);
      P.x += v2[0] * dt; P.y += v2[1] * dt; P.age += dt;
      var dx = P.x - body.x, dy = P.y - body.y, r = Math.hypot(dx, dy);
      if (r < A) { P.x = body.x + dx / r * A * 1.05; P.y = body.y + dy / r * A * 1.05; }
    }
    for (var t = 0; t < tracers.length; t++) {
      var T = tracers[t];
      advect(T, CONFIG.tracerTrail);
      if (T.x > W + 4 || T.y < -4 || T.y > H + 4 || T.age > T.life) tracers[t] = spawn(Math.random() < 0.7 ? -2 : Math.random() * W);
    }
    var n = Math.max(1, Math.round(CONFIG.smokePerFrame * dt));
    for (var s = 0; s < n; s++) {
      [-1, 1].forEach(function (side) {
        var th = side * (1.35 + Math.random() * 0.2);        // ~100 deg from the front stagnation point
        var x = body.x + Math.cos(th) * A * 1.08, y = body.y + Math.sin(th) * A * 1.08;
        smoke.push({ x: x, y: y, h: [], age: 0, side: side });
      });
    }
    smoke.forEach(function (P) { advect(P, CONFIG.smokeTrail); });
    smoke = smoke.filter(function (P) { return P.age < CONFIG.smokeLife && P.x < W + 10 && P.y > -10 && P.y < H + 10; });
  }

  // Visibility by height: faint near the top so the text reads first.
  function fade(y) { var s = Math.min(1, Math.max(0, (y / H - 0.12) / 0.5)); return s * s * (3 - 2 * s); }

  // Draw one short polyline per particle from its own recent positions.
  // The canvas is fully cleared every frame, so nothing ghosts or smears.
  function trail(P) {
    var h = P.h; if (h.length < 2) return;
    ctx.moveTo(h[0], h[1]);
    for (var i = 2; i < h.length; i += 2) ctx.lineTo(h[i], h[i + 1]);
    ctx.lineTo(P.x, P.y);
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.lineWidth = 1;
    for (var b = 0; b < 3; b++) {                       // 3 brightness bands = 3 strokes per frame
      ctx.strokeStyle = "rgba(" + CONFIG.tracer + "," + (0.1 + b * 0.14) + ")";
      ctx.beginPath();
      for (var i = 0; i < tracers.length; i++) {
        var T = tracers[i];
        if (Math.min(2, Math.floor(fade(T.y) * 3)) === b) trail(T);
      }
      ctx.stroke();
    }
    ctx.lineWidth = 1.3;
    [[-1, CONFIG.top], [1, CONFIG.bottom]].forEach(function (pair) {
      ctx.strokeStyle = "rgba(" + pair[1] + ",0.8)";
      ctx.beginPath();
      for (var k = 0; k < smoke.length; k++) if (smoke[k].side === pair[0]) trail(smoke[k]);
      ctx.stroke();
    });
    ring.style.transform = "translate3d(" + (body.x - A) + "px," + (body.y - A) + "px,0)";
  }

  // Reduced motion: run the flow forward once and show that single frame.
  function still() {
    for (var i = 0; i < 260; i++) step(1);
    draw();
  }

  function frame(now) {
    raf = 0;
    var dt = last ? Math.min(2.5, (now - last) / 16.67) : 1;
    last = now;
    if (!pointerInside) {             // idle drift: a slow figure-of-eight
      var s = now * 0.001;
      target.x = W * (0.42 + 0.14 * Math.sin(s * 0.17));
      target.y = H * (0.58 + 0.08 * Math.sin(s * 0.29));
    }
    step(dt);
    draw();
    if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    else last = 0;
  }
  function start() { if (!raf && !reduced) raf = requestAnimationFrame(frame); }

  if (finePointer && !reduced) {
    hero.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      target.x = e.clientX - r.left; target.y = e.clientY - r.top; pointerInside = true;
    }, { passive: true });
    hero.addEventListener("pointerleave", function () { pointerInside = false; });
  }
  new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); }).observe(hero);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) { last = 0; start(); } });
  // Only rebuild when the size really changes (mobile URL bars fire resize constantly).
  var lastW = 0, lastH = 0;
  function maybeResize() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (Math.abs(w - lastW) < 2 && Math.abs(h - lastH) < 80) return;
    lastW = w; lastH = h; resize();
  }
  if (window.ResizeObserver) new ResizeObserver(maybeResize).observe(canvas); else addEventListener("resize", maybeResize);
  maybeResize();
  start();
})();
