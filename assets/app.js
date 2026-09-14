/* Xtro Group — no framework, no build step.
   Three things: the hero globe, the mobile menu, the copyright year. */
(function () {
  "use strict";

  /* ======================================================================
     Mobile navigation
     ====================================================================== */
  var navToggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");

  if (navToggle && mobileNav) {
    var setNav = function (open) {
      mobileNav.hidden = !open;
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    };

    navToggle.addEventListener("click", function () {
      setNav(mobileNav.hidden);
    });

    mobileNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !mobileNav.hidden) {
        setNav(false);
        navToggle.focus();
      }
    });
  }

  /* ======================================================================
     Copyright year
     ====================================================================== */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ======================================================================
     Hero globe

     The logo is a wireframe globe, and the business is international
     marketplace accounts run out of one office. So: a real sphere, the
     marketplace geographies we actually operate in, and routes back to
     Multan. Orthographic projection, depth-sorted by z, drawn on canvas.
     ====================================================================== */
  var canvas = document.getElementById("globe");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var stage = canvas.parentElement;

  var LIME = [191, 255, 19];
  var GRID = [20, 125, 45];
  var TILT = -0.42;          /* radians, tips the north pole toward the viewer */
  var SPIN = 0.028;          /* degrees per millisecond-ish; deliberately slow */

  /* Marketplace geographies we run accounts in, plus the office they run from. */
  var HOME = { name: "Multan", lat: 30.2, lon: 71.5 };
  var HUBS = [
    { name: "Seattle",     lat: 47.6,  lon: -122.3 },
    { name: "Bentonville", lat: 36.4,  lon: -94.2 },
    { name: "Toronto",     lat: 43.7,  lon: -79.4 },
    { name: "London",      lat: 51.5,  lon: -0.1 },
    { name: "Berlin",      lat: 52.5,  lon: 13.4 },
    { name: "Dubai",       lat: 25.2,  lon: 55.3 },
    { name: "Tokyo",       lat: 35.7,  lon: 139.7 },
    { name: "Sydney",      lat: -33.9, lon: 151.2 }
  ];

  var W = 0, H = 0, R = 0, CX = 0, CY = 0, dpr = 1;

  function resize() {
    var rect = stage.getBoundingClientRect();
    var size = Math.max(240, Math.min(rect.width, rect.height || rect.width));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = size; H = size;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    CX = W / 2; CY = H / 2;
    R = size * 0.375;
  }

  /* Unit-sphere vector for a lat/lon, spun about the polar axis. */
  function vec(lat, lon, spin) {
    var p = lat * Math.PI / 180;
    var l = (lon + spin) * Math.PI / 180;
    return [Math.cos(p) * Math.sin(l), Math.sin(p), Math.cos(p) * Math.cos(l)];
  }

  /* Tilt about X, then drop to screen space. z is kept for depth cueing. */
  function project(v, scale) {
    var s = scale || 1;
    var y = v[1] * Math.cos(TILT) - v[2] * Math.sin(TILT);
    var z = v[1] * Math.sin(TILT) + v[2] * Math.cos(TILT);
    return { x: CX + v[0] * R * s, y: CY - y * R * s, z: z };
  }

  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }

  /* Spherical linear interpolation, so routes follow great circles. */
  function slerp(a, b, t) {
    var dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    var w = Math.acos(dot);
    if (w < 1e-6) return a.slice();
    var s = Math.sin(w);
    var k1 = Math.sin((1 - t) * w) / s;
    var k2 = Math.sin(t * w) / s;
    return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
  }

  function drawLine(points, colour, baseAlpha, width) {
    ctx.lineWidth = width;
    for (var i = 1; i < points.length; i++) {
      var p = points[i - 1], q = points[i];
      var depth = (p.z + q.z) / 2;
      /* Front of the sphere reads bright, the far side stays as a ghost. */
      var a = baseAlpha * (depth > 0 ? 0.22 + 0.78 * depth : 0.14);
      ctx.strokeStyle = rgba(colour, a);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(q.x, q.y);
      ctx.stroke();
    }
  }

  function drawGlobe(spin, t) {
    ctx.clearRect(0, 0, W, H);

    /* Sphere body: a soft interior so the wireframe sits on volume, not a hole. */
    var body = ctx.createRadialGradient(
      CX - R * 0.35, CY - R * 0.4, R * 0.1,
      CX, CY, R * 1.05
    );
    body.addColorStop(0, "rgba(11,107,34,0.20)");
    body.addColorStop(0.55, "rgba(6,40,18,0.16)");
    body.addColorStop(1, "rgba(3,8,5,0)");
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(CX, CY, R * 1.02, 0, Math.PI * 2);
    ctx.fill();

    var lat, lon, pts;

    /* Meridians, every 30 degrees. */
    for (lon = 0; lon < 360; lon += 30) {
      pts = [];
      for (lat = -90; lat <= 90; lat += 4) pts.push(project(vec(lat, lon, spin)));
      drawLine(pts, GRID, lon === 0 ? 0.85 : 0.5, 1);
    }

    /* Parallels. The equator carries a touch more weight. */
    for (lat = -60; lat <= 60; lat += 30) {
      pts = [];
      for (lon = 0; lon <= 360; lon += 4) pts.push(project(vec(lat, lon, spin)));
      drawLine(pts, GRID, lat === 0 ? 0.85 : 0.45, 1);
    }

    /* Limb. */
    ctx.strokeStyle = rgba(GRID, 0.55);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(CX, CY, R, 0, Math.PI * 2);
    ctx.stroke();

    /* Routes from every hub back to the office. */
    var home = vec(HOME.lat, HOME.lon, spin);
    for (var h = 0; h < HUBS.length; h++) {
      var hub = HUBS[h];
      var target = vec(hub.lat, hub.lon, spin);
      var arc = [];
      var steps = 42;
      for (var s = 0; s <= steps; s++) {
        var k = s / steps;
        var lift = 1 + Math.sin(Math.PI * k) * 0.26;
        arc.push(project(slerp(home, target, k), lift));
      }
      drawLine(arc, LIME, 0.30, 1);

      /* A shipment moving down the route. Staggered so they never pulse in unison. */
      var phase = (t * 0.00016 + h / HUBS.length) % 1;
      var idx = Math.floor(phase * steps);
      var dot = arc[idx];
      if (dot && dot.z > -0.15) {
        var glow = dot.z > 0 ? 1 : 0.35;
        ctx.shadowBlur = 12 * glow;
        ctx.shadowColor = rgba(LIME, 0.85);
        ctx.fillStyle = rgba(LIME, 0.95 * glow);
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      /* Hub marker: a diamond, matching the channel rail's bullets. */
      var hp = project(target);
      var front = hp.z > 0;
      ctx.save();
      ctx.translate(hp.x, hp.y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = rgba(LIME, front ? 0.9 : 0.22);
      ctx.fillRect(-2.1, -2.1, 4.2, 4.2);
      ctx.restore();
    }

    /* The office. Larger, with a breathing ring — the one thing that pulses. */
    var hp2 = project(home);
    if (hp2.z > -0.1) {
      var vis = hp2.z > 0 ? 1 : 0.3;
      var breathe = 0.5 + 0.5 * Math.sin(t * 0.0016);

      ctx.strokeStyle = rgba(LIME, 0.30 * vis * (1 - breathe * 0.7));
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(hp2.x, hp2.y, 5 + breathe * 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowBlur = 16 * vis;
      ctx.shadowColor = rgba(LIME, 0.9);
      ctx.fillStyle = rgba(LIME, vis);
      ctx.beginPath();
      ctx.arc(hp2.x, hp2.y, 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (hp2.z > 0.1 && W > 300) {
        ctx.font = "500 10px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillStyle = rgba(LIME, 0.92 * vis);
        ctx.textBaseline = "middle";
        ctx.fillText("MULTAN", hp2.x + 11, hp2.y - 0.5);
        ctx.fillStyle = "rgba(155,176,162,0.8)";
        ctx.fillText("HQ", hp2.x + 11 + ctx.measureText("MULTAN ").width, hp2.y - 0.5);
      }
    }
  }

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var raf = null;
  var start = 0;
  var visible = true;

  function frame(now) {
    if (!start) start = now;
    var t = now - start;
    drawGlobe(t * SPIN, t);
    raf = visible ? requestAnimationFrame(frame) : null;
  }

  function run() {
    if (reduced.matches) {
      /* Still a complete picture, just held still. */
      drawGlobe(28, 2600);
      return;
    }
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
  }

  resize();
  run();

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      if (reduced.matches) drawGlobe(28, 2600);
    }, 150);
  });

  /* Don't burn a phone battery animating something nobody is looking at. */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) { start = 0; run(); } else { stop(); }
    }, { threshold: 0.05 }).observe(canvas);
  }

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { stop(); }
    else if (visible) { start = 0; run(); }
  });

  reduced.addEventListener("change", function () {
    stop();
    start = 0;
    run();
  });
})();
