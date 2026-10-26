/* =====================================================================
   site.js — builds the page from js/data.js and runs the interactions.
   You normally edit js/data.js, not this file.

   Sections:
     A. Small helpers + icons
     B. Theme (light/dark), menu, nav colour over the photo
     C. Home page: hero title, statement, work, building, experience,
        photos, resume, contact
     D. Case study page (project.html)
     E. Motion: scroll reveals
   ===================================================================== */
(function () {
  "use strict";
  var S = window.SITE;
  var root = document.documentElement;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) root.dataset.motion = "off";

  /* ------------------------- A. Helpers ------------------------------ */
  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  // Escape text from data.js before putting it into HTML.
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  // One icon set, drawn as 1.5px strokes on a 24px grid.
  var ICONS = {
    arrow: '<path d="M7 17 17 7M8 7h9v9"/>',
    back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    menu: '<path d="M4 8h16M4 16h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
    chevL: '<path d="M15 6l-6 6 6 6"/>', chevR: '<path d="M9 6l6 6-6 6"/>',
    down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  };
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  }
  function fillIcons(scope) {
    $$("[data-icon]", scope).forEach(function (el) {
      var n = el.getAttribute("data-icon");
      if (n === "theme") n = root.dataset.theme === "dark" ? "sun" : "moon";
      el.innerHTML = icon(n);
    });
  }

  // The BF mark (built from Archivo Expanded; see assets/brand/bf-mark.svg).
  var MARK_PATH = null;
  function fillMarks() {
    var targets = $$("svg[data-mark]");
    if (!targets.length) return;
    fetch("assets/brand/bf-mark.svg").then(function (r) { return r.text(); }).then(function (txt) {
      var m = txt.match(/ d="([^"]+)"/); if (!m) return;
      MARK_PATH = m[1];
      targets.forEach(function (svg) {
        svg.setAttribute("fill", "currentColor"); svg.setAttribute("fill-rule", "evenodd");
        svg.innerHTML = '<path d="' + MARK_PATH + '"/>';
      });
    }).catch(function () {});
  }

  // An image slot: a labelled placeholder with the real <img> on top.
  // If the file does not exist yet, the <img> removes itself.
  function slot(img, extraStyle) {
    img = img || {};
    return '<div class="ph"' + (extraStyle ? ' style="' + extraStyle + '"' : "") + '>' +
      '<span class="ph-label"><b>Photo</b>' + esc(img.label || img.alt || "") + "</span>" +
      (img.src ? '<img src="' + esc(img.src) + '" alt="' + esc(img.alt || "") + '" loading="lazy" decoding="async" onerror="this.remove()">' : "") +
      "</div>";
  }
  function projectUrl(p) { return "project.html?p=" + encodeURIComponent(p.slug); }
  function statusChip(st) {
    var label = { active: "In progress", starting: "Starting", done: "Complete" }[st] || st;
    var cls = st === "starting" ? "starting" : st === "done" ? "done" : "";
    return '<span class="chip ' + cls + '">' + esc(label) + "</span>";
  }

  /* ------------- B. Theme, menu, nav colour over the photo ------------ */
  function initTheme() {
    $$("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = root.dataset.theme === "dark" ? "light" : "dark";
        root.classList.add("theme-shift");
        if (next === "dark") root.dataset.theme = "dark"; else delete root.dataset.theme;
        try { localStorage.setItem("bf-theme", next); } catch (e) {}
        fillIcons(btn);
        setTimeout(function () { root.classList.remove("theme-shift"); }, 600);
      });
    });
  }

  function initMenu() {
    var btn = $("[data-menu-btn]"), menu = $("#mobile-menu");
    if (!btn || !menu) return;
    function set(open) {
      menu.classList.toggle("open", open);
      root.classList.toggle("menu-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      $("[data-icon]", btn).innerHTML = icon(open ? "close" : "menu");
      var nav = $("#topnav");
      if (open) { nav.dataset.was = nav.className; nav.classList.remove("on-photo"); nav.classList.add("on-paper"); }
      else if (nav.dataset.was) { nav.className = nav.dataset.was; }
    }
    btn.addEventListener("click", function () { set(!menu.classList.contains("open")); });
    $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) set(false); });
  }

  // White nav over the dark hero, solid paper bar once the hero has scrolled away.
  function initNavState() {
    var nav = $("#topnav"), hero = $(".hero, .case-head");
    if (!nav || !hero) return;
    var ticking = false;
    function update() {
      ticking = false;
      if (root.classList.contains("menu-open")) return;
      var onHero = hero.getBoundingClientRect().bottom > nav.offsetHeight;
      nav.classList.toggle("on-photo", onHero);
      nav.classList.toggle("on-paper", !onHero);
    }
    addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();

    // Highlight the section you are reading. One rule, evaluated on scroll:
    // the current section is the last nav target whose top has passed 40%
    // of the screen. Sections not in the nav (like "about") never clear it,
    // which is what made the highlight jump before.
    var links = $$(".nav-sections a");
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute("href").replace(/^.*#/, "")); });
    var current = null;
    function spy() {
      var line = innerHeight * 0.4, idx = -1;
      targets.forEach(function (sec, i) { if (sec && sec.getBoundingClientRect().top <= line) idx = i; });
      var next = idx >= 0 ? links[idx] : null;
      if (next === current) return;
      if (current) current.removeAttribute("aria-current");
      if (next) next.setAttribute("aria-current", "true");
      current = next;
    }
    if (links.length && targets[0]) {
      addEventListener("scroll", function () { requestAnimationFrame(spy); }, { passive: true });
      spy();
    }
  }

  /* ----------------------------- C. Home ------------------------------ */
  // Splits the hero name into letters (for the entrance) and fits it so the
  // longest line spans the full content width. Re-fits on resize only.
  function initHeroTitle() {
    var h1 = $(".hero-title"), inner = $(".hero-title-inner");
    if (!h1 || !inner) return;
    var n = 0;
    $$(".line", inner).forEach(function (line) {
      var txt = line.textContent; line.textContent = "";
      Array.prototype.forEach.call(txt, function (ch) {
        var s = document.createElement("span"); s.className = "ch"; s.style.setProperty("--n", n++); s.textContent = ch; line.appendChild(s);
      });
    });
    function fit() {
      var cs = getComputedStyle(h1);
      var avail = h1.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      h1.style.setProperty("--fit", "100px");
      // On phones the two names stack, so fit the longest line instead.
      var w = 0;
      if (matchMedia("(max-width: 720px)").matches) $$(".line", inner).forEach(function (l) { w = Math.max(w, l.offsetWidth); });
      else w = inner.offsetWidth;
      if (w > 0 && avail > 0) h1.style.setProperty("--fit", Math.floor(100 * avail / w * 100) / 100 + "px");
    }
    var raf = 0;
    function schedule() { if (!raf) raf = requestAnimationFrame(function () { raf = 0; fit(); }); }
    fit();
    if (window.ResizeObserver) new ResizeObserver(schedule).observe(h1);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
  }

  // Splits the statement into words whose ink fills in as you scroll.
  function initInk() {
    var p = $("[data-ink]"); if (!p) return;
    var words = p.textContent.trim().split(/\s+/), n = words.length;
    p.innerHTML = words.map(function (w, i) {
      return '<span class="ink-word" style="--a:' + (6 + i / n * 36).toFixed(2) + "%;--b:" + (14 + i / n * 36).toFixed(2) + '%">' + esc(w) + "</span>";
    }).join(" ");
  }

  function renderHome() {
    var P = S.person;
    var line = $("[data-person-line]"); if (line) line.textContent = P.line;

    var featured = S.projects.filter(function (p) { return p.group === "featured"; });
    $("[data-featured]").innerHTML = featured.map(function (p, i) {
      return '<article class="feature reveal' + (i % 2 ? " flip" : "") + '">' +
        '<a class="feature-media" href="' + projectUrl(p) + '" tabindex="-1" aria-hidden="true">' + slot(p.images[0]) + "</a>" +
        '<div class="feature-body">' +
          '<p class="meta">' + esc(p.where) + " · " + esc(p.when) + "</p>" +
          '<h3><a href="' + projectUrl(p) + '">' + esc(p.title) + "</a></h3>" +
          '<p class="result">' + esc(p.result) + "</p>" +
          '<ul class="did">' + p.did.slice(0, 3).map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul>" +
          '<p class="tags">' + p.tags.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</p>" +
          '<p><a class="text-link" href="' + projectUrl(p) + '">Read the case study' + icon("arrow") + "</a></p>" +
        "</div></article>";
    }).join("");

    var also = S.projects.filter(function (p) { return p.group === "also"; });
    $("[data-also]").innerHTML = also.map(function (p) {
      return '<a class="list-row" data-peek-slug="' + esc(p.slug) + '" href="' + projectUrl(p) + '"><div><strong>' + esc(p.title) + "</strong><em>" + esc(p.where) + " · " + esc(p.when) + "</em></div><span>" + esc(p.short) + "</span>" + icon("arrow") + "</a>";
    }).join("");

    var building = S.projects.filter(function (p) { return p.group === "building"; });
    $("[data-building]").innerHTML = building.map(function (p) {
      return '<a class="ledger-row" href="' + projectUrl(p) + '">' +
        "<div><h3>" + esc(p.title) + '</h3><span class="where">' + esc(p.where) + "</span></div>" +
        '<span class="disc">' + esc(p.discipline) + "</span>" +
        '<p class="now">' + esc(p.now) + "</p>" +
        '<div class="next">' + statusChip(p.status) + "<b>" + esc(p.next) + '</b><time class="tnum">' + esc(p.nextDate) + "</time></div>" +
        icon("arrow") + "</a>";
    }).join("");

    $("[data-experience]").innerHTML = S.experience.map(function (x) {
      return '<div class="xp-row reveal"><p class="xp-when">' + esc(x.when) + '</p><div class="xp-org"><h3>' + esc(x.org) + "</h3><p>" + esc(x.role) + '</p></div><ul class="did">' +
        x.did.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul></div>";
    }).join("");

    initPeek();
    var teach = $("[data-teaching]");
    if (teach && S.teaching) teach.innerHTML = S.teaching.map(function (x) {
      return '<div class="teach-row reveal"><div><h3>' + esc(x.role) + "</h3><p>" + esc(x.where) + '</p></div><div><p class="what">' + esc(x.what) + "</p>" +
        (x.subjects && x.subjects.length ? '<p class="tags">' + x.subjects.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</p>" : "") + "</div></div>";
    }).join("");
    renderPhotos();

    $("[data-resume]").innerHTML = S.resume.map(function (r) { return "<div><dt>" + esc(r.k) + "</dt><dd>" + r.v + "</dd></div>"; }).join("");
    $$("[data-resume-link], [data-resume-view]").forEach(function (a) { a.href = P.resumePdf; });

    var links = [];
    if (P.linkedin) links.push('<a class="pill" href="' + esc(P.linkedin) + '" target="_blank" rel="noopener">LinkedIn' + icon("arrow") + "</a>");
    if (P.instagram) links.push('<a class="pill" href="' + esc(P.instagram) + '" target="_blank" rel="noopener">Instagram' + icon("arrow") + "</a>");
    links.push('<a class="pill solid" href="#resume">Resume</a>');
    $("[data-contact-links]").innerHTML = links.join("");
  }

  // A small preview of each project's photo trails the cursor over the
  // "Also built" list (mouse and trackpad only).
  function initPeek() {
    var peek = $("[data-peek]");
    if (!peek || reduced || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var x = 0, y = 0, tx = 0, ty = 0, raf = 0, active = false;
    function loop() {
      x += (tx - x) * 0.18; y += (ty - y) * 0.18;
      peek.style.left = x + "px"; peek.style.top = y + "px";
      raf = active || Math.abs(tx - x) > .5 ? requestAnimationFrame(loop) : 0;
    }
    $$("[data-peek-slug]").forEach(function (row) {
      var p = S.projects.find(function (q) { return q.slug === row.getAttribute("data-peek-slug"); });
      row.addEventListener("pointerenter", function (e) {
        peek.innerHTML = slot(p && p.images && p.images[0]);
        if (!active) { x = tx = e.clientX + 170; y = ty = e.clientY; }
        active = true; peek.classList.add("on");
        if (!raf) raf = requestAnimationFrame(loop);
      });
      row.addEventListener("pointermove", function (e) { tx = e.clientX + 170; ty = e.clientY; });
      row.addEventListener("pointerleave", function () { active = false; peek.classList.remove("on"); });
    });
  }

  function renderPhotos() {
    var grid = $("[data-photos]"), dlg = $("[data-lightbox]");
    grid.innerHTML = S.photos.map(function (ph, i) {
      return '<figure class="photo reveal" style="--delay:' + (i % 3) * 70 + 'ms"><button type="button" data-photo="' + i + '" aria-label="View ' + esc(ph.title) + ' large">' +
        slot({ src: ph.src, alt: ph.title, label: ph.title }, "aspect-ratio:" + ph.ratio) +
        "</button><figcaption><span>" + esc(ph.title) + "</span><span>" + esc(ph.place || "") + "</span></figcaption></figure>";
    }).join("");

    // Lightbox with arrow-key and button navigation.
    var cur = 0;
    function show(i) {
      cur = (i + S.photos.length) % S.photos.length;
      var ph = S.photos[cur];
      dlg.innerHTML = slot({ src: ph.src, alt: ph.title, label: ph.title }, "aspect-ratio:" + ph.ratio) +
        '<div class="lightbox-bar"><span>' + esc(ph.title) + ' <span class="tnum">· ' + (cur + 1) + " / " + S.photos.length + "</span></span>" +
        '<span style="display:flex;gap:8px"><button class="pill icon" data-lb="-1" aria-label="Previous photo">' + icon("chevL") + '</button><button class="pill icon" data-lb="1" aria-label="Next photo">' + icon("chevR") +
        '</button><button class="pill" data-lb="close">Close</button></span></div>';
    }
    grid.addEventListener("click", function (e) {
      var b = e.target.closest("[data-photo]"); if (!b) return;
      show(+b.getAttribute("data-photo")); dlg.showModal();
    });
    dlg.addEventListener("click", function (e) {
      var b = e.target.closest("[data-lb]");
      if (b) { var v = b.getAttribute("data-lb"); if (v === "close") dlg.close(); else show(cur + +v); return; }
      if (e.target === dlg) dlg.close(); // click on the backdrop
    });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") show(cur + 1);
      if (e.key === "ArrowLeft") show(cur - 1);
    });

    // Before / after editing comparison.
    var E = S.edit, box = $("[data-edit]");
    if (E && box) {
      box.innerHTML = "<div><h3>" + esc(E.title) + "</h3><p>" + esc(E.note) + "</p></div>" +
        '<div class="ba">' + slot({ src: E.before, alt: "Unedited photo", label: "Before · straight out of camera" }) +
        '<div class="ph after">' + '<span class="ph-label" style="left:auto;text-align:right"><b>Photo</b>After · final edit</span>' +
        '<img src="' + esc(E.after) + '" alt="Edited photo" loading="lazy" onerror="this.remove()"></div>' +
        '<span class="ba-tag l">Before</span><span class="ba-tag r">After</span>' +
        '<input type="range" min="0" max="100" value="50" aria-label="Compare before and after">' +
        '<span class="ba-handle" aria-hidden="true"></span></div>';
      var ba = $(".ba", box), range = $("input", ba);
      range.addEventListener("input", function () { ba.style.setProperty("--pos", range.value + "%"); });
    }
  }

  function renderContact() {
    var P = S.person;
    $$("[data-email-link]").forEach(function (a) {
      a.href = "mailto:" + P.email;
      if (!a.textContent.trim()) a.textContent = P.email;
    });
    $$("[data-year]").forEach(function (y) { y.textContent = new Date().getFullYear(); });
  }

  /* ----------------------- D. Case study page ------------------------- */
  function renderCase() {
    var slug = new URLSearchParams(location.search).get("p");
    var list = S.projects, i = list.findIndex(function (p) { return p.slug === slug; });
    var main = $("[data-case]");
    if (i < 0) {
      main.innerHTML = '<header class="case-head"><div class="container"><a class="back" href="index.html#work">' + icon("back") + 'All work</a><h1 class="case-title">Project not found</h1><p class="meta" style="margin-top:18px">That link does not match a project. Pick one from the home page.</p></div></header>';
      return;
    }
    var p = list[i], next = list[(i + 1) % list.length];
    document.title = p.title + " · Bryce Forsgren";
    var backHref = p.group === "building" ? "index.html#building" : "index.html#work";
    var meta = [["Role", p.role], ["Team", p.team], ["When", p.when || p.nextDate], ["Where", p.where]];
    var figs = (p.images || []).slice(1);
    var outcome = p.result || p.now;

    // Dark title band, photo straddling the edge, then the reading column.
    var html =
      '<header class="case-head"><div class="container">' +
        '<a class="back" href="' + backHref + '">' + icon("back") + (p.group === "building" ? "Now building" : "All work") + "</a>" +
        '<h1 class="case-title">' + esc(p.title) + "</h1>" +
        '<div class="case-status">' + statusChip(p.status) + '<span class="tags">' + (p.tags || []).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</span></div>" +
        '<dl class="case-meta">' + meta.filter(function (m) { return m[1]; }).map(function (m) { return "<div><dt>" + m[0] + "</dt><dd>" + esc(m[1]) + "</dd></div>"; }).join("") + "</dl>" +
      "</div></header>" +
      '<div class="case-hero-wrap"><div class="container"><div class="case-hero">' + slot(p.images && p.images[0], "height:100%") + "</div></div></div>" +
      '<div class="container">' +
      section(p.group === "building" ? "Where it stands" : "Outcome", '<p class="case-outcome">' + esc(outcome) + "</p>" +
        (p.next ? '<p style="margin-top:18px"><b>Next:</b> ' + esc(p.next) + " · " + esc(p.nextDate) + "</p>" : "")) +
      (p.did && p.did.length ? section("What I did", '<ul class="did">' + p.did.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul>") : "") +
      (p.why ? section("Why it matters", "<p>" + esc(p.why) + "</p>") : "") +
      ((p.how && p.how.length) || figs.length ? section("How it works",
        (p.how || []).map(function (h) { return "<p>" + esc(h) + "</p>"; }).join("") +
        (figs.length ? '<div class="figs">' + figs.map(function (f) { return "<figure>" + slot(f) + "<figcaption>" + esc(f.label || f.alt) + "</figcaption></figure>"; }).join("") + "</div>" : "") +
        (p.paperNote ? '<p class="note">' + esc(p.paperNote) + ' <a class="text-link" data-email-link href="#">Ask by email</a></p>' : "")) : "") +
      "</div>" +
      '<a class="next-case" href="' + projectUrl(next) + '"><div><span>Next project</span><strong>' + esc(next.title) + "</strong></div></a>";
    main.innerHTML = html;
    $$(".case-body", main).forEach(function (el) { el.classList.add("reveal"); });
    $$("[data-email-link]", main).forEach(function (a) { a.textContent = "Ask by email"; });

    function section(title, body) { return '<section class="case-body"><h2>' + title + "</h2><div>" + body + "</div></section>"; }
  }

  /* ------------------------- E. Scroll reveals ------------------------ */
  // Content is visible by default. Only elements still below the fold are
  // hidden (.pre) and then eased in, so nothing is ever stuck invisible.
  function initReveal() {
    if (reduced || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    $$(".reveal").forEach(function (el) {
      if (el.getBoundingClientRect().top > innerHeight * 0.92) { el.classList.add("pre"); io.observe(el); }
    });
  }

  /* ------------------------------ Boot -------------------------------- */
  var page = document.body.getAttribute("data-page");
  if (page === "home") { initHeroTitle(); initInk(); renderHome(); }
  if (page === "project") renderCase();
  renderContact();
  fillIcons(document);
  fillMarks();
  initTheme();
  initMenu();
  initNavState();
  initReveal();
})();
