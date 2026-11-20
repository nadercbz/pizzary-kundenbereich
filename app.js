/* The Pizzary Dashboard. Reine Oberfläche, alle Inhalte kommen aus data.js (gebaut von build.py). */
(function () {
  "use strict";
  var D = window.PZ;
  if (!D) { document.body.innerHTML = "<p style='padding:40px'>data.js fehlt. Bitte build.py ausführen.</p>"; return; }

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var fmtSize = function (b) { return b >= 1e9 ? (b / 1e9).toFixed(1).replace(".", ",") + " GB" : b >= 1e6 ? Math.round(b / 1e6) + " MB" : b >= 1e3 ? Math.round(b / 1e3) + " KB" : b + " B"; };
  var fmtDur = function (s) { s = Math.round(s); var m = Math.floor(s / 60), r = s % 60; return m + ":" + (r < 10 ? "0" : "") + r; };
  var nf = function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "."); };
  var norm = function (s) { return String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss"); };

  /* ---------- Symbole ---------- */
  var P = {
    home: "M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10", star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
    face: "M12 21a9 9 0 100-18 9 9 0 000 18zM8.5 14.5c1 1.2 2.1 1.8 3.5 1.8s2.5-.6 3.5-1.8M9 9.5v.01M15 9.5v.01",
    book: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19a2 2 0 012-2h13", image: "M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9.5v.01",
    video: "M3 6h12v12H3zM15 10l6-3v10l-6-3", doc: "M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6",
    pizza: "M3 5c6-3 12-3 18 0L12 21zM9 9v.01M14 9v.01M12 14v.01", print: "M7 9V3h10v6M6 17H4v-7h16v7h-2M7 14h10v7H7z",
    flag: "M5 21V4M5 4h11l-2 4 2 4H5", bag: "M5 8h14l-1 12H6zM9 8a3 3 0 016 0", target: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 16a4 4 0 100-8 4 4 0 000 8zM12 12v.01",
    link: "M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1", search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.3-4.3",
    download: "M12 4v11M7 11l5 5 5-5M5 20h14", all: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z", menu: "M4 7h16M4 12h16M4 17h16",
    chev: "M9 6l6 6-6 6", calendar: "M5 5h14v15H5zM5 10h14M9 3v4M15 3v4", frame: "M4 4h16v16H4zM8 8h8v8H8z", ext: "M14 4h6v6M20 4l-9 9M18 13v6H5V6h6",
    sun: "M12 16a4 4 0 100-8 4 4 0 000 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4",
    moon: "M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z", back: "M15 6l-6 6 6 6", folder: "M3 6h7l2 2h9v11H3z", zip: "M5 4h10l4 4v12H5zM10 4v6h2v2h-2v2h2M10 18h2"
  };
  var ic = function (n) { return '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (P[n] || P.doc) + '"/></svg>'; };

  /* ---------- Daten aufbereiten ---------- */
  var IT = D.items;
  var GBY = {}; D.groups.forEach(function (g) { (GBY[g.sec] = GBY[g.sec] || []).push(g); });
  var SEC_OF = {}; D.groups.forEach(function (g) { g.ids.forEach(function (i) { if (!SEC_OF[i]) SEC_OF[i] = [g.sec, g.title]; }); });
  var ZIPS = {}; (D.zips || []).forEach(function (z) { ZIPS[z.id] = z; });
  var ALL_IDS = Object.keys(SEC_OF);
  var TYPE_LABEL = { image: "Bild", video: "Video", pdf: "PDF", text: "Text", web: "Seite", design: "Design", audio: "Audio", data: "Datei" };
  var NAVITEMS = []; D.nav.forEach(function (g) { g.items.forEach(function (i) { NAVITEMS.push({ id: i[0], t: i[1], ic: i[2] }); }); });
  var secCount = function (s) { var n = 0; (GBY[s] || []).forEach(function (g) { n += g.ids.length; }); return n; };

  /* ---------- Theme ---------- */
  function themeMode() { try { var m = localStorage.getItem("pz-theme"); return m === "light" || m === "dark" ? m : "auto"; } catch (e) { return "auto"; } }
  function effTheme() { var m = themeMode(); return m === "auto" ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : m; }
  function applyTheme() {
    var t = effTheme(); document.documentElement.setAttribute("data-theme", t);
    $("#logoImg").src = t === "dark" ? "media/logo-light.webp" : "media/logo-dark.webp";
    $("#themeBtn").innerHTML = ic(t === "dark" ? "sun" : "moon"); $("#themeBtn").setAttribute("aria-label", t === "dark" ? "Zu hell wechseln" : "Zu dunkel wechseln");
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute("content", t === "dark" ? "#141110" : "#F3F2EA");
  }
  $("#themeBtn").addEventListener("click", function () { try { localStorage.setItem("pz-theme", effTheme() === "dark" ? "light" : "dark"); } catch (e) {} applyTheme(); });
  $("#menuBtn").innerHTML = ic("menu"); $("#searchIc").innerHTML = ic("search"); $("#srIc").innerHTML = ic("search"); $("#lbDlI").innerHTML = ic("download");
  $("#menuBtn").addEventListener("click", function () { document.body.classList.toggle("menu"); });
  document.addEventListener("click", function (e) { if (document.body.classList.contains("menu") && !e.target.closest("#side") && !e.target.closest("#menuBtn")) document.body.classList.remove("menu"); });

  function toast(t) { var e = $("#toast"); e.textContent = t; e.classList.add("on"); clearTimeout(toast.h); toast.h = setTimeout(function () { e.classList.remove("on"); }, 1800); }
  function copy(t, msg) {
    var done = function () { toast(msg || "Kopiert"); };
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(t).then(done, fb); } else fb();
    function fb() { var a = document.createElement("textarea"); a.value = t; a.style.position = "fixed"; a.style.opacity = "0"; document.body.appendChild(a); a.select(); try { document.execCommand("copy"); done(); } catch (e) { toast("Kopieren nicht möglich"); } a.remove(); }
  }

  /* ---------- Seitenleiste ---------- */
  function buildSide() {
    var h = '<div class="sb-hd"><span class="sb-logo"><img src="media/seal.webp" alt=""></span><span class="sb-name">The Pizzary</span></div><div class="sb-nav" id="sbNav">';
    D.nav.forEach(function (g) {
      h += '<div class="side-h">' + esc(g.h) + "</div>";
      g.items.forEach(function (i) {
        var c = i[0] === "start" ? "" : (i[0] === "figuren" ? D.figuren.length : i[0] === "logos" ? D.logos.length : i[0] === "kontext" ? D.kontext.length : i[0] === "web" ? D.webapps.length : secCount(i[0]));
        h += '<a class="nav-b" href="#/' + i[0] + '" data-nav="' + i[0] + '"><span class="ic">' + ic(i[2]) + '</span><span class="lb">' + esc(i[1]) + "</span>" + (c !== "" ? '<span class="ct">' + nf(c) + "</span>" : "") + "</a>";
      });
    });
    h += '</div><div class="sb-ft"><a class="nav-b" href="#/alle" data-nav="alle"><span class="ic">' + ic("all") + '</span><span class="lb">Alle Dateien</span><span class="ct">' + nf(D.stats.dateien) + '</span></a>' +
      '<div class="sb-user"><span class="avatar">TP</span><div><b>The Pizzary</b><small>Kunden-Bereich, Stand ' + esc(D.stand) + "</small></div></div></div>";
    $("#side").innerHTML = h;
  }

  /* ---------- Karten ---------- */
  var CTX = {};
  function thumbOf(it) { return it.th ? it.th : ""; }
  function card(it, ctx, opt) {
    opt = opt || {};
    var vid = it.t === "video", doc = it.t === "pdf";
    var th = thumbOf(it);
    var inner = th ? '<img src="' + esc(th) + '" alt="" loading="lazy" decoding="async">' : '<span class="ext">' + esc(it.e) + "</span>";
    if (vid) inner += '<span class="play"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></span>' + (it.d ? '<span class="dur">' + fmtDur(it.d) + "</span>" : "");
    if (doc && it.pg) inner += '<span class="pg">' + it.pg + (it.pg === 1 ? " Seite" : " Seiten") + "</span>";
    var sub = esc(it.e.toUpperCase()) + " · " + fmtSize(it.s);
    if (opt.sec && SEC_OF[it.id]) sub = esc(SEC_OF[it.id][1]) + " · " + sub;
    return '<article class="it"><button class="it-th ' + (doc ? "doc" : "") + '" type="button" data-open="' + it.id + '" data-ctx="' + ctx + '" aria-label="' + esc(it.n) + ' öffnen">' + inner + "</button>" +
      '<div class="it-meta"><b title="' + esc(it.n) + '">' + esc(it.n) + '</b><span class="mono">' + sub + "</span></div>" +
      (it.x ? '<span class="dl off" title="In der Online Fassung nicht enthalten, Download auf Anfrage">' + ic("download") + "</span>" :
        '<a class="dl" href="' + esc(it.p) + '" download' + (it.dn ? '="' + esc(it.dn) + '"' : "") + ' aria-label="' + esc(it.n) + ' herunterladen" title="' + (it.lq ? "Herunterladen (Web Qualität)" : "Herunterladen") + '">' + ic("download") + "</a>") + "</article>";
  }
  function zipBtn(zid, label) {
    var z = ZIPS[zid]; if (!z) return "";
    return '<a class="btn sm or" href="' + esc(z.href) + '" download>' + ic("zip") + esc(label || "Alles als ZIP") + " · " + fmtSize(z.s) + "</a>";
  }

  /* ---------- Bibliothek (Bilder, Videos, ...) ---------- */
  var LIB = {};
  var PAGE = 48;
  function libState(sec) { return LIB[sec] || (LIB[sec] = { q: "", g: "", more: {} }); }
  var famOf = function (g) { return g.title.split(": ")[0]; };
  function libGroups(sec) {
    var st = libState(sec), qs = norm(st.q).split(/\s+/).filter(Boolean);
    return (GBY[sec] || []).filter(function (g) { return !st.g || famOf(g) === st.g; }).map(function (g) {
      var ids = g.ids.filter(function (i) { if (!qs.length) return true; var t = norm(IT[i].n + " " + IT[i].f + " " + g.title); return qs.every(function (q) { return t.indexOf(q) >= 0; }); });
      return { g: g, ids: ids };
    }).filter(function (x) { return x.ids.length; });
  }
  function groupHTML(x, sec) {
    var g = x.g, st = libState(sec), lim = PAGE + (st.more[g.id] || 0), ids = x.ids, ctx = "g" + g.id;
    CTX[ctx] = ids;
    var size = 0; g.ids.forEach(function (i) { size += IT[i].s; });
    var h = '<div class="sec-h"><h2>' + esc(g.title) + '</h2><span class="mono">' + nf(ids.length) + (ids.length !== g.ids.length ? " von " + nf(g.ids.length) : "") + " Dateien · " + fmtSize(size) + '</span><span class="sp"></span>' + (g.zip ? zipBtn(g.zip) : "") + "</div>";
    if (g.desc) h += '<p class="sec-d">' + esc(g.desc) + "</p>";
    h += '<div class="grid ' + (g.ar === "v" ? "v" : "") + '">' + ids.slice(0, lim).map(function (i) { return card(IT[i], ctx); }).join("") + "</div>";
    if (ids.length > lim) h += '<div class="more"><button class="btn" type="button" data-more="' + g.id + '" data-sec="' + sec + '">Mehr anzeigen (' + nf(ids.length - lim) + ")</button></div>";
    return h;
  }
  function libBody(sec) {
    var gs = libGroups(sec);
    return gs.length ? gs.map(function (x) { return groupHTML(x, sec); }).join("") : '<div class="empty glass">Nichts gefunden. Anderen Suchbegriff probieren oder den Filter zurücksetzen.</div>';
  }
  function head(kicker, title, desc, actions) {
    return '<div class="vh"><div><p class="mono hot">' + esc(kicker) + "</p><h1>" + esc(title) + "</h1>" + (desc ? "<p>" + esc(desc) + "</p>" : "") + "</div>" + (actions ? '<div class="vh-actions">' + actions + "</div>" : "") + "</div>";
  }
  function viewLib(sec, before) {
    var m = D.sec[sec] || [sec, ""], st = libState(sec), gs = GBY[sec] || [];
    var packs = gs.filter(function (g) { return g.zip && ZIPS[g.zip]; });
    var h = head("Material", m[0], m[1]);
    if (before) h += before;
    h += '<div class="toolbar"><input type="search" id="libQ" placeholder="In ' + esc(m[0]) + ' suchen" value="' + esc(st.q) + '" aria-label="Suchen"></div>';
    var fams = [], fc = {}; gs.forEach(function (g) { var f = famOf(g); if (!(f in fc)) { fc[f] = 0; fams.push(f); } fc[f] += g.ids.length; });
    if (fams.length > 1) {
      h += '<div class="chips" id="libChips"><button class="chip" type="button" data-g="" aria-pressed="' + (!st.g) + '">Alle <em>' + nf(secCount(sec)) + "</em></button>" +
        fams.map(function (f) { return '<button class="chip" type="button" data-g="' + esc(f) + '" aria-pressed="' + (st.g === f) + '">' + esc(f) + " <em>" + nf(fc[f]) + "</em></button>"; }).join("") + "</div>";
    }
    h += '<div id="libBody">' + libBody(sec) + "</div>";
    return h;
  }
  function bindLib(sec) {
    var q = $("#libQ"), t;
    if (q) q.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { libState(sec).q = q.value; libState(sec).more = {}; $("#libBody").innerHTML = libBody(sec); }, 140); });
    var ch = $("#libChips");
    if (ch) ch.addEventListener("click", function (e) {
      var b = e.target.closest("[data-g]"); if (!b) return; libState(sec).g = b.getAttribute("data-g"); libState(sec).more = {};
      $$("[data-g]", ch).forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); $("#libBody").innerHTML = libBody(sec);
    });
  }

  /* ---------- Alle Dateien ---------- */
  var ALL = { q: "", type: "", sec: "", sort: "name", n: 80 };
  function allList() {
    var qs = norm(ALL.q).split(/\s+/).filter(Boolean);
    var l = ALL_IDS.filter(function (i) {
      var it = IT[i]; if (ALL.type && it.t !== ALL.type) return false;
      if (ALL.sec && SEC_OF[i][0] !== ALL.sec) return false;
      if (!qs.length) return true; var t = norm(it.n + " " + it.f + " " + SEC_OF[i][1]); return qs.every(function (q) { return t.indexOf(q) >= 0; });
    });
    l.sort(function (a, b) { return ALL.sort === "neu" ? IT[b].m - IT[a].m : ALL.sort === "gross" ? IT[b].s - IT[a].s : IT[a].n.localeCompare(IT[b].n, "de"); });
    return l;
  }
  function allBody() {
    var l = allList(); CTX.alle = l;
    var h = '<div class="sec-h"><h2>' + nf(l.length) + ' Dateien</h2><span class="mono">' + fmtSize(l.reduce(function (s, i) { return s + IT[i].s; }, 0)) + "</span></div>";
    h += l.length ? '<div class="grid">' + l.slice(0, ALL.n).map(function (i) { return card(IT[i], "alle", { sec: 1 }); }).join("") + "</div>" : '<div class="empty glass">Nichts gefunden.</div>';
    if (l.length > ALL.n) h += '<div class="more"><button class="btn" type="button" id="allMore">Mehr anzeigen (' + nf(l.length - ALL.n) + ")</button></div>";
    return h;
  }
  function viewAlle() {
    var types = {}; ALL_IDS.forEach(function (i) { types[IT[i].t] = (types[IT[i].t] || 0) + 1; });
    var h = head("Überblick", "Alle Dateien", "Jede Datei im Dashboard an einem Ort. Filtern, sortieren, vergrößern, herunterladen.");
    h += '<div class="toolbar"><input type="search" id="alQ" placeholder="Alle Dateien durchsuchen" value="' + esc(ALL.q) + '" aria-label="Suchen">' +
      '<select id="alSec" aria-label="Bereich"><option value="">Alle Bereiche</option>' + D.nav.reduce(function (a, g) { return a.concat(g.items); }, []).filter(function (i) { return GBY[i[0]]; }).concat([["marke", "Logos und CI"]]).map(function (i) { return '<option value="' + i[0] + '"' + (ALL.sec === i[0] ? " selected" : "") + ">" + esc(i[1]) + "</option>"; }).join("") + "</select>" +
      '<select id="alSort" aria-label="Sortierung"><option value="name"' + (ALL.sort === "name" ? " selected" : "") + '>Nach Name</option><option value="neu"' + (ALL.sort === "neu" ? " selected" : "") + '>Neueste zuerst</option><option value="gross"' + (ALL.sort === "gross" ? " selected" : "") + ">Größte zuerst</option></select></div>";
    h += '<div class="chips" id="alTypes"><button class="chip" type="button" data-t="" aria-pressed="' + (!ALL.type) + '">Alle <em>' + nf(ALL_IDS.length) + "</em></button>" +
      Object.keys(types).sort(function (a, b) { return types[b] - types[a]; }).map(function (t) { return '<button class="chip" type="button" data-t="' + t + '" aria-pressed="' + (ALL.type === t) + '">' + (TYPE_LABEL[t] || t) + " <em>" + nf(types[t]) + "</em></button>"; }).join("") + "</div>";
    h += '<div id="alBody">' + allBody() + "</div>";
    return h;
  }
  function bindAlle() {
    var t, upd = function () { ALL.n = 80; $("#alBody").innerHTML = allBody(); };
    $("#alQ").addEventListener("input", function (e) { clearTimeout(t); t = setTimeout(function () { ALL.q = e.target.value; upd(); }, 140); });
    $("#alSec").addEventListener("change", function (e) { ALL.sec = e.target.value; upd(); });
    $("#alSort").addEventListener("change", function (e) { ALL.sort = e.target.value; upd(); });
    $("#alTypes").addEventListener("click", function (e) { var b = e.target.closest("[data-t]"); if (!b) return; ALL.type = b.getAttribute("data-t"); $$("#alTypes [data-t]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); upd(); });
    $("#alBody").addEventListener("click", function (e) { if (e.target.closest("#allMore")) { ALL.n += 160; $("#alBody").innerHTML = allBody(); } });
  }

  /* ---------- Start ---------- */
  var TILE_DESC = {
    logos: "Alle Logos in jedem Format, Farben, Schriften und das CI Handbuch.", figuren: "Sam, Moni, Reni, Malik, Yuki, Günni, Mustafa und alle anderen.",
    kontext: "Fakten, Preise, Marketing Richtung und Regeln zum Nachlesen.", bilder: "Produktfotos, Food, Getränke, Menü und Fotos vom Laden.",
    videos: "Gepostete Videos, fertige Schnitte, Reels, Stories und Animationen.", skripte: "Reel Skripte, Drehpläne, Shootingpläne und Schnittlisten.",
    karte: "Speisekarte, Allergene, Mittagsdeal und Aktions Flyer.", print: "Flyer, Fensterbeklebung, TV Screens, Vorlagen und Druckdaten.",
    aktionen: "Hall of Pizzary, GTA 6 Gewinnspiel, Stempelkarte und Schilder.", plattformen: "Echte Produktfotos für Lieferando, Wolt und Uber Eats.",
    strategie: "Strategie, Content Plan, Analysen und Creator Briefing.", web: "Bestellshop, App, Website Entwürfe, Analysen und Spiele."
  };
  function tileCount(id) {
    if (id === "logos") return D.logos.length + " Logos · " + D.colors.length + " Farben";
    if (id === "figuren") return D.figuren.length + " Figuren";
    if (id === "kontext") return D.kontext.length + " Themen";
    if (id === "web") return D.webapps.length + " Links";
    var n = secCount(id), g = (GBY[id] || []).length; return nf(n) + " Dateien · " + g + " Gruppen";
  }
  function viewStart() {
    var s = D.stats;
    var h = '<section class="hero"><div><p class="mono hot">Willkommen</p><h1>Alles zu The Pizzary.<br>An einem Ort.</h1><p>Marke, Logos, Figuren, Bilder, Videos, Skripte und Druckdaten. Alles zum Ansehen und Herunterladen, dazu der komplette Kontext zum Nachlesen.</p>' +
      '<div class="vh-actions"><button class="btn or" type="button" data-act="search">' + ic("search") + 'Alles durchsuchen</button><a class="btn" href="#/logos">' + ic("star") + 'Logos laden</a><a class="btn" href="#/figuren">' + ic("face") + "Figuren ansehen</a></div></div>" +
      '<img class="bird" src="media/bird.webp" alt="Die Berliner Taube, die Bildmarke von The Pizzary" width="300" height="314"></section>';
    if (D.online) h += '<div class="online glass"><b>Online Fassung.</b> Enthalten sind alle Vorschauen, Logos, Figuren, Skripte, Dokumente und Bilder in Web Qualität. Videos (bis auf die sechs vom Dreh 16.11. in Web Qualität) und sehr große Originaldateien (Druckdaten, Footage) sind hier nicht enthalten und kommen auf Anfrage.</div>';
    h += '<div class="stats">' + [[s.dateien, "Dateien"], [s.bilder, "Bilder"], [s.videos, "Videos"], [s.dokumente, "Dokumente"], [(s.bytes / 1e9).toFixed(1).replace(".", ","), "GB Material"]].map(function (x) { return '<div class="stat glass"><b>' + (typeof x[0] === "number" ? nf(x[0]) : x[0]) + "</b><span>" + x[1] + "</span></div>"; }).join("") + "</div>";
    h += '<div class="sec-h"><h2>Bereiche</h2></div><div class="tiles">';
    NAVITEMS.filter(function (n) { return n.id !== "start"; }).forEach(function (n) {
      var cls = n.id === "figuren" ? "t-or" : n.id === "videos" ? "t-ink" : "";
      h += '<a class="tile ' + cls + '" href="#/' + n.id + '"><span class="ti">' + ic(n.ic) + '</span><span class="mono">' + esc(tileCount(n.id)) + "</span><b>" + esc(n.t) + '</b><span class="td">' + esc(TILE_DESC[n.id] || "") + "</span></a>";
    });
    h += "</div>";
    var fresh = ALL_IDS.filter(function (i) { return ["image", "video", "pdf"].indexOf(IT[i].t) >= 0 && IT[i].th; }).sort(function (a, b) { return IT[b].m - IT[a].m; }).slice(0, 14);
    CTX.neu = fresh;
    h += '<div class="sec-h"><h2>Zuletzt bearbeitet</h2><span class="mono">die neuesten Dateien</span></div><div class="strip">' + fresh.map(function (i) { return card(IT[i], "neu", { sec: 1 }); }).join("") + "</div>";
    h += '<div class="sec-h"><h2>Die Farben der Marke</h2><span class="sp"></span><a class="btn sm" href="#/logos">Alle Details</a></div><div class="swatches">' + D.colors.map(swatch).join("") + "</div>";
    h += '<div class="sec-h"><h2>Direkt zum Bestellen</h2></div><div class="qlinks">' +
      D.webapps.filter(function (w) { return w.tag === "Live" }).map(function (w) { return '<a class="qlink glass" href="' + esc(w.live) + '" target="_blank" rel="noopener"><span class="ti" style="width:38px;height:38px;border-radius:12px;background:var(--card-2);display:grid;place-items:center">' + ic("ext") + "</span><div><b>" + esc(w.t) + "</b><small>" + esc(w.d.split(".")[0]) + "</small></div></a>"; }).join("") + "</div>";
    return h;
  }
  function swatch(c) {
    var dark = c.hex === "#000000" || c.hex === "#DC142A" || c.hex === "#677FD8";
    return '<button class="sw" type="button" data-copy="' + c.hex + '" title="Klicken zum Kopieren"><i style="background:' + c.hex + '"></i><div><b>' + esc(c.n) + '</b><span class="mono">' + c.hex + (c.pantone ? " · PANTONE " + esc(c.pantone) : "") + '</span><span class="mono">RGB ' + esc(c.rgb) + " · CMYK " + esc(c.cmyk) + "</span></div></button>";
  }

  /* ---------- Logos und CI ---------- */
  function viewLogos() {
    var h = head("Marke", "Logos und CI", "Alle Logos in allen Formaten, die Farbwelt, die Schriften und das Handbuch. Wichtig laut Handbuch: Logos nur einfarbig verwenden, schwarz auf hell und weiß auf dunkel, nie verändern.",
      zipBtn("Markenkit_komplett", "Markenkit komplett") + zipBtn("Logos_PNG_und_SVG", "Logos PNG und SVG"));
    h += '<div class="sec-h"><h2>Logos</h2><span class="mono">' + D.logos.length + " Varianten · PNG, SVG, PDF, EPS, JPG</span></div><div class='logos'>";
    D.logos.forEach(function (l) {
      var it = IT[l.id];
      h += '<article class="lg glass"><button class="lg-pv ' + (l.dark ? "dk" : "") + '" type="button" data-open="' + l.id + '" data-ctx="logos" aria-label="' + esc(l.title) + ' vergrößern">' + (it && it.th ? '<img src="' + esc(it.th) + '" alt="' + esc(l.title) + '" loading="lazy">' : "") + "</button>" +
        '<div class="lg-in"><div><span class="pill soft">' + esc(l.kind) + "</span></div><b>" + esc(l.title) + '</b><div class="lg-fm">' + l.files.map(function (f) { return '<a class="chip" href="' + esc(f.p) + '" download title="' + fmtSize(f.s) + '">' + esc(f.l) + "</a>"; }).join("") + "</div></div></article>";
    });
    CTX.logos = D.logos.map(function (l) { return l.id; }).filter(Boolean);
    h += "</div>";
    h += '<div class="sec-h"><h2>Farbwelt</h2><span class="mono">Klick kopiert den HEX Wert</span></div><div class="swatches">' + D.colors.map(swatch).join("") + "</div>";
    h += '<div class="sec-h"><h2>Schriften</h2></div><div class="fonts">' + D.fonts.map(function (f, i) {
      return '<div class="font-c glass"><span class="pill soft" style="justify-self:start">' + esc(f.rolle) + '</span><div class="spec ' + (i ? "bd" : "ar") + '">Deine Pizza. Deine Regeln.</div><b>' + esc(f.n) + "</b><p>" + esc(f.d) + "</p>" + (f.file ? '<div><a class="btn sm" href="' + esc(f.file) + '" download>' + ic("download") + "Schrift laden</a></div>" : "") + "</div>";
    }).join("") + "</div>";
    h += '<div class="sec-h"><h2>Handbuch und Quelldateien</h2></div>';
    h += (GBY.marke || []).map(function (g) { var ids = g.ids; CTX["g" + g.id] = ids; var size = ids.reduce(function (s, i) { return s + IT[i].s; }, 0);
      return '<div class="sec-h" style="margin-top:20px"><h2 style="font-size:19px">' + esc(g.title) + '</h2><span class="mono">' + ids.length + " Dateien · " + fmtSize(size) + "</span></div>" + (g.desc ? '<p class="sec-d">' + esc(g.desc) + "</p>" : "") + '<div class="grid">' + ids.map(function (i) { return card(IT[i], "g" + g.id); }).join("") + "</div>"; }).join("");
    return h;
  }

  /* ---------- Figuren ---------- */
  function figCover(f) {
    var by = function (re) { for (var k = 0; k < f.ids.length; k++) if (re.test(IT[f.ids[k]].n)) return f.ids[k]; return null; };
    return by(/Kopf 01|Kopf 1\b/i) || by(/Kopf/i) || by(/Ganzk/i) || f.ids[0] || null;
  }
  var tint = function (hex) { return hex + "33"; };
  function viewFiguren(id) {
    var f = id && D.figuren.filter(function (x) { return x.id === id; })[0];
    if (!f) {
      var h = head("Marke", "Figuren", "Die Berliner Tauben und ihre Crew: Köpfe, Ganzkörper, Schwarzweiß und Varianten. Klicken für den Steckbrief und alle Bilder.", zipBtn("Illustrationen_Figuren", "Alle Figuren als ZIP"));
      h += '<div class="figs">' + D.figuren.map(function (x) { var c = figCover(x); var it = c && IT[c];
        return '<a class="fig" href="#/figuren/' + x.id + '" style="--fc:' + tint(x.farbe) + '"><div class="fig-im">' + (it && it.th ? '<img src="' + esc(it.th) + '" alt="" loading="lazy">' : "") + '</div><div class="fig-in"><b>' + esc(x.name) + "</b><span>" + esc(x.spruch || x.rolle) + '</span><span class="mono" style="margin-top:6px">' + x.ids.length + " Bilder</span></div></a>"; }).join("") + "</div>";
      return h;
    }
    var c = figCover(f), it = c && IT[c];
    var h2 = '<a class="back" href="#/figuren">' + ic("back") + "Alle Figuren</a>";
    h2 += '<div class="fig-hero"><div class="fig-im" style="--fc:' + tint(f.farbe) + ';background:' + tint(f.farbe) + '">' + (it && (it.pv || it.th) ? '<img src="' + esc(it.pv || it.th) + '" alt="' + esc(f.name) + '">' : "") + '</div><div class="fig-box glass"><span class="pill soft" style="justify-self:start">' + esc(f.rolle) + "</span>" +
      '<h1 style="margin:0;font-family:var(--display);font-weight:400;font-size:clamp(44px,5vw,78px);line-height:.9;text-transform:uppercase">' + esc(f.name) + "</h1>" + (f.spruch ? '<div class="q">' + esc(f.spruch) + "</div>" : "") + "<p>" + esc(f.text) + "</p>" +
      '<div class="vh-actions">' + zipBtn("Illustrationen_Figuren", "Alle Figuren als ZIP") + '<a class="btn sm" href="#/figuren">Weitere Figuren</a></div></div></div>';
    var ctx = "f" + f.id; CTX[ctx] = (f.pizza ? [f.pizza] : []).concat(f.ids);
    if (f.pizza) h2 += '<div class="sec-h"><h2>Die Pizza</h2></div><div class="grid">' + card(IT[f.pizza], ctx) + "</div>";
    h2 += '<div class="sec-h"><h2>Bilder von ' + esc(f.name) + '</h2><span class="mono">' + f.ids.length + " Dateien</span></div><div class='grid'>" + f.ids.map(function (i) { return card(IT[i], ctx); }).join("") + "</div>";
    return h2;
  }

  /* ---------- Kontext ---------- */
  function ctxText(k) {
    var t = k.title + "\n" + k.lead + "\n\n";
    k.blocks.forEach(function (b) {
      if (b.title) t += b.title + "\n";
      if (b.t === "p" || b.t === "note") t += b.x + "\n\n";
      if (b.t === "list") t += b.items.map(function (x) { return "• " + x; }).join("\n") + "\n\n";
      if (b.t === "facts") t += b.rows.map(function (r) { return r[0] + ": " + r[1]; }).join("\n") + "\n\n";
      if (b.t === "table") t += b.head.join(" | ") + "\n" + b.rows.map(function (r) { return r.join(" | "); }).join("\n") + "\n\n";
    });
    return t.trim();
  }
  function linkify(s) { return esc(s).replace(/(https?:\/\/[^\s)]+)/g, function (u) { return '<a href="' + u + '" target="_blank" rel="noopener">' + u + "</a>"; }); }
  function blockHTML(b) {
    if (b.t === "p") return "<p>" + linkify(b.x) + "</p>";
    if (b.t === "note") return '<div class="note">' + linkify(b.x) + "</div>";
    if (b.t === "list") return (b.title ? "<h3>" + esc(b.title) + "</h3>" : "") + "<ul>" + b.items.map(function (x) { return "<li>" + linkify(x) + "</li>"; }).join("") + "</ul>";
    if (b.t === "facts") return "<dl>" + b.rows.map(function (r) { return "<dt>" + esc(r[0]) + "</dt><dd>" + linkify(r[1]) + "</dd>"; }).join("") + "</dl>";
    if (b.t === "table") return '<div class="tw"><table><thead><tr>' + b.head.map(function (x) { return "<th>" + esc(x) + "</th>"; }).join("") + "</tr></thead><tbody>" + b.rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + linkify(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>";
    return "";
  }
  var KQ = "";
  function kxList(open) {
    var qs = norm(KQ).split(/\s+/).filter(Boolean);
    var l = D.kontext.filter(function (k) { if (!qs.length) return true; var t = norm(ctxText(k)); return qs.every(function (q) { return t.indexOf(q) >= 0; }); });
    if (!l.length) return '<div class="empty glass">Nichts gefunden.</div>';
    return l.map(function (k) {
      return '<details class="glass" id="k-' + k.id + '"' + (open === k.id || qs.length ? " open" : "") + '><summary><span class="ti">' + ic(k.icon) + "</span>" + esc(k.title) + '<span class="chev">' + ic("chev") + '</span></summary><div class="kb"><p class="lead">' + esc(k.lead) + "</p>" + k.blocks.map(blockHTML).join("") +
        '<div class="row"><button class="btn sm" type="button" data-copyk="' + k.id + '">Als Text kopieren</button></div></div></details>';
    }).join("");
  }
  function viewKontext(open) {
    var h = head("Marke", "Kontext und Fakten", "Alles Wichtige zum Nachlesen: Laden, Marke, Produkt, Preise, Marketing Richtung und Regeln. Stand der Zahlen steht jeweils dabei.");
    h += '<div class="toolbar"><input type="search" id="kxQ" placeholder="Im Kontext suchen" value="' + esc(KQ) + '" aria-label="Suchen"></div><div class="kx" id="kxList" style="margin-top:12px">' + kxList(open) + "</div>";
    return h;
  }
  function bindKontext(open) {
    var t; $("#kxQ").addEventListener("input", function (e) { clearTimeout(t); t = setTimeout(function () { KQ = e.target.value; $("#kxList").innerHTML = kxList(null); }, 140); });
    if (open) { var el = $("#k-" + open); if (el) setTimeout(function () { el.scrollIntoView({ block: "start", behavior: "smooth" }); }, 60); }
  }

  /* ---------- Web und Apps ---------- */
  function viewWeb() {
    var h = head("Projekte", "Web und Apps", "Bestellshop, App, Website Entwürfe, Analysen und kleine Spiele. Lokale Entwürfe öffnen sich nur auf dem Rechner mit dem Projektordner.");
    h += '<div class="apps">' + D.webapps.map(function (w) {
      return '<div class="app glass"><div><span class="pill ' + (w.tag === "Live" ? "or" : "soft") + '">' + esc(w.tag) + "</span></div><b>" + esc(w.t) + "</b><p>" + esc(w.d) + '</p><div class="row">' +
        (w.live ? '<a class="btn sm inv" href="' + esc(w.live) + '" target="_blank" rel="noopener">Öffnen ' + ic("ext") + "</a>" : "") +
        (w.local ? '<a class="btn sm" href="dateien/' + w.local.split("/").map(encodeURIComponent).join("/") + '" target="_blank" rel="noopener">' + (w.live ? "Lokale Fassung" : "Öffnen") + " " + ic("ext") + "</a>" : "") + "</div></div>";
    }).join("") + "</div>";
    return h;
  }

  /* ---------- Router ---------- */
  var TITLES = {}; NAVITEMS.forEach(function (n) { TITLES[n.id] = n.t; }); TITLES.alle = "Alle Dateien";
  function route() {
    var hash = location.hash.replace(/^#\/?/, ""), parts = hash.split("/"), id = parts[0] || "start", sub = parts[1] || "";
    var v = $("#view"), html = "", after = null;
    if (id === "start") html = viewStart();
    else if (id === "logos") html = viewLogos();
    else if (id === "figuren") html = viewFiguren(sub);
    else if (id === "kontext") { html = viewKontext(sub); after = function () { bindKontext(sub); }; }
    else if (id === "web") html = viewWeb();
    else if (id === "alle") { html = viewAlle(); after = bindAlle; }
    else if (GBY[id] && id !== "marke") { html = viewLib(id); after = function () { bindLib(id); }; }
    else { id = "start"; html = viewStart(); }
    v.innerHTML = html; if (after) after();
    $$("[data-nav]").forEach(function (a) { if (a.getAttribute("data-nav") === id) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    document.title = (TITLES[id] && id !== "start" ? TITLES[id] + " · " : "") + "The Pizzary Dashboard";
    document.body.classList.remove("menu");
    if (!(id === "kontext" && sub)) window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  /* ---------- Klicks im Inhalt ---------- */
  $("#view").addEventListener("click", function (e) {
    var o = e.target.closest("[data-open]");
    if (o) { openLb(o.getAttribute("data-open"), o.getAttribute("data-ctx")); return; }
    var m = e.target.closest("[data-more]");
    if (m) { var s = m.getAttribute("data-sec"), g = m.getAttribute("data-more"); libState(s).more[g] = (libState(s).more[g] || 0) + 96; $("#libBody").innerHTML = libBody(s); return; }
    var c = e.target.closest("[data-copy]"); if (c) { copy(c.getAttribute("data-copy"), c.getAttribute("data-copy") + " kopiert"); return; }
    var k = e.target.closest("[data-copyk]"); if (k) { var kk = D.kontext.filter(function (x) { return x.id === k.getAttribute("data-copyk"); })[0]; if (kk) copy(ctxText(kk), "Text kopiert"); return; }
    if (e.target.closest("[data-act=search]")) openSearch();
  });

  /* ---------- Lightbox ---------- */
  var lb = $("#lb"), LB = { list: [], i: 0 };
  function mdToHtml(src) {
    var lines = src.replace(/\r/g, "").split("\n"), out = [], i = 0;
    var inl = function (t) { return esc(t).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<i>$2</i>").replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>'); };
    var cells = function (l) { return l.replace(/^\||\|$/g, "").split("|").map(function (x) { return x.trim(); }); };
    while (i < lines.length) {
      var l = lines[i], m;
      if (/^\s*$/.test(l)) { i++; continue; }
      if ((m = l.match(/^(#{1,4})\s+(.*)/))) { var n = Math.min(m[1].length, 3); out.push("<h" + n + ">" + inl(m[2]) + "</h" + n + ">"); i++; continue; }
      if (/^-{3,}\s*$/.test(l)) { out.push("<hr>"); i++; continue; }
      if (/^\|/.test(l) && /^\|?\s*:?-{2,}/.test(lines[i + 1] || "")) {
        var hd = cells(l); i += 2; var rows = []; while (i < lines.length && /^\|/.test(lines[i])) { rows.push(cells(lines[i])); i++; }
        out.push('<div class="tw"><table><thead><tr>' + hd.map(function (x) { return "<th>" + inl(x) + "</th>"; }).join("") + "</tr></thead><tbody>" + rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + inl(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>"); continue;
      }
      if (/^\s*[-*]\s+/.test(l)) { var li = []; while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { li.push("<li>" + inl(lines[i].replace(/^\s*[-*]\s+/, "")) + "</li>"); i++; } out.push("<ul>" + li.join("") + "</ul>"); continue; }
      if (/^\s*\d+\.\s+/.test(l)) { var lo = []; while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { lo.push("<li>" + inl(lines[i].replace(/^\s*\d+\.\s+/, "")) + "</li>"); i++; } out.push("<ol>" + lo.join("") + "</ol>"); continue; }
      if (/^>\s?/.test(l)) { var q = []; while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, "")); i++; } out.push("<blockquote>" + inl(q.join(" ")) + "</blockquote>"); continue; }
      var p = []; while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^(#{1,4}\s|\||\s*[-*]\s|\s*\d+\.\s|>|-{3,})/.test(lines[i])) { p.push(lines[i]); i++; }
      if (!p.length) { p.push(lines[i]); i++; }
      out.push("<p>" + inl(p.join(" ")) + "</p>");
    }
    return out.join("\n");
  }
  function stageHTML(it) {
    var src = esc(it.p);
    if (it.x) return '<div class="lb-info glass">' + (it.th ? '<img src="' + esc(it.th) + '" alt="">' : "") + "<b>" + esc(it.n) + "</b><p>Diese Datei (" + esc(it.e.toUpperCase()) + ", " + fmtSize(it.s) + ") ist in der Online Fassung nicht enthalten. Das Original gibt es auf Anfrage, sie liegt im Projektordner.</p></div>";
    if (it.t === "image") return '<img src="' + esc(it.pv || it.p) + '" alt="' + esc(it.n) + '">';
    if (it.t === "video") return '<video controls autoplay playsinline preload="metadata" src="' + src + '"' + (it.th ? ' poster="' + esc(it.th) + '"' : "") + ' onerror="this.outerHTML=\'<div class=lb-err>Dieses Videoformat spielt der Browser nicht ab. Bitte herunterladen.</div>\'"></video>';
    if (it.t === "audio") return '<div class="lb-info"><b>' + esc(it.n) + '</b><audio controls autoplay src="' + src + '" style="width:100%"></audio></div>';
    if (it.t === "pdf") return '<iframe src="' + src + '#view=FitH" title="' + esc(it.n) + '"></iframe>';
    if (it.t === "web") return '<iframe src="' + src + '" title="' + esc(it.n) + '"></iframe>';
    if (it.t === "text") { var tx = D.texts[it.id]; if (tx != null) return '<div class="doc md glass">' + (it.e === "md" ? mdToHtml(tx) : "<pre style='white-space:pre-wrap;font:inherit'>" + esc(tx) + "</pre>") + "</div>"; }
    return '<div class="lb-info glass">' + (it.th ? '<img src="' + esc(it.th) + '" alt="">' : "") + "<b>" + esc(it.n) + "</b><p>Dieses Format zeigt der Browser nicht an (" + esc(it.e.toUpperCase()) + "). Lade die Datei herunter und öffne sie im passenden Programm.</p></div>";
  }
  function showLb() {
    var id = LB.list[LB.i], it = IT[id]; if (!it) return;
    $("#lbT").textContent = it.n;
    var dir = it.f.split("/").slice(0, -1).join(" / ");
    $("#lbS").textContent = it.e.toUpperCase() + " · " + fmtSize(it.s) + (it.w ? " · " + it.w + " x " + it.h : "") + (it.d ? " · " + fmtDur(it.d) : "") + " · " + dir + (LB.list.length > 1 ? "  (" + (LB.i + 1) + " von " + LB.list.length + ")" : "");
    var dl = $("#lbDl"); dl.href = it.p; dl.setAttribute("download", it.dn || it.f.split("/").pop());
    $("#lbTab").href = it.p; dl.hidden = $("#lbTab").hidden = !!it.x;
    if (it.lq) $("#lbS").textContent += " · Web Qualität";
    $("#lbStage").innerHTML = stageHTML(it);
    $("#lbPrev").disabled = LB.i <= 0; $("#lbNext").disabled = LB.i >= LB.list.length - 1;
    $("#lbPrev").hidden = $("#lbNext").hidden = LB.list.length < 2;
  }
  function openLb(id, ctx) {
    var list = CTX[ctx] && CTX[ctx].indexOf(id) >= 0 ? CTX[ctx] : [id];
    LB.list = list; LB.i = list.indexOf(id);
    if (!lb.open) lb.showModal();
    showLb();
  }
  function stopMedia() { $$("video,audio", lb).forEach(function (m) { m.pause(); }); $("#lbStage").innerHTML = ""; }
  $("#lbX").addEventListener("click", function () { lb.close(); });
  lb.addEventListener("close", stopMedia);
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
  $("#lbPrev").addEventListener("click", function () { if (LB.i > 0) { LB.i--; showLb(); } });
  $("#lbNext").addEventListener("click", function () { if (LB.i < LB.list.length - 1) { LB.i++; showLb(); } });
  document.addEventListener("keydown", function (e) {
    if (lb.open && (e.key === "ArrowLeft" || e.key === "ArrowRight") && !e.target.closest("video,audio,input,iframe")) { e.preventDefault(); if (e.key === "ArrowLeft") $("#lbPrev").click(); else $("#lbNext").click(); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); }
  });

  /* ---------- Suche ---------- */
  var sr = $("#srch"), SR = { sel: 0, hits: [] };
  var KIDX = D.kontext.map(function (k) { return { k: k, t: norm(ctxText(k)) }; });
  var WIDX = D.webapps.map(function (w) { return { w: w, t: norm(w.t + " " + w.d) }; });
  function runSearch(q) {
    var qs = norm(q).split(/\s+/).filter(Boolean), res = $("#srRes");
    if (!qs.length) { res.innerHTML = '<div class="sr-h">Beispiele</div>' + ["Mustafa", "Logo", "Speisekarte", "Reel Skripte", "Flyer", "Lieferando"].map(function (x) { return '<button class="sr-r" type="button" data-q="' + x + '"><div><b>' + x + "</b><small>Suchen</small></div></button>"; }).join(""); SR.hits = []; return; }
    var items = ALL_IDS.map(function (i) { var it = IT[i], n = norm(it.n), t = n + " " + norm(it.f + " " + SEC_OF[i][1]);
      if (!qs.every(function (x) { return t.indexOf(x) >= 0; })) return null; return { i: i, sc: (qs.every(function (x) { return n.indexOf(x) >= 0; }) ? 0 : 1) * 1e9 + n.length }; }).filter(Boolean).sort(function (a, b) { return a.sc - b.sc; });
    var ks = KIDX.filter(function (x) { return qs.every(function (q) { return x.t.indexOf(q) >= 0; }); });
    var ws = WIDX.filter(function (x) { return qs.every(function (q) { return x.t.indexOf(q) >= 0; }); });
    var h = "", hits = [];
    if (ks.length) { h += '<div class="sr-h">Kontext</div>'; ks.slice(0, 5).forEach(function (x) { hits.push({ href: "#/kontext/" + x.k.id }); h += '<a class="sr-r" href="#/kontext/' + x.k.id + '" data-hit="' + (hits.length - 1) + '"><span class="th">' + ic(x.k.icon) + "</span><div><b>" + esc(x.k.title) + "</b><small>" + esc(x.k.lead) + "</small></div></a>"; }); }
    if (ws.length) { h += '<div class="sr-h">Web und Apps</div>'; ws.slice(0, 4).forEach(function (x) { var u = x.w.live || ("dateien/" + x.w.local); hits.push({ href: u, ext: 1 }); h += '<a class="sr-r" href="' + esc(u) + '" target="_blank" rel="noopener" data-hit="' + (hits.length - 1) + '"><span class="th">' + ic("link") + "</span><div><b>" + esc(x.w.t) + "</b><small>" + esc(x.w.d) + "</small></div></a>"; }); }
    if (items.length) {
      var top = items.slice(0, 40).map(function (x) { return x.i; }); CTX.srch = items.map(function (x) { return x.i; });
      h += '<div class="sr-h">Dateien (' + nf(items.length) + ")</div>";
      top.forEach(function (i) { var it = IT[i]; hits.push({ open: i }); h += '<button class="sr-r" type="button" data-hit="' + (hits.length - 1) + '"><span class="th">' + (it.th ? '<img src="' + esc(it.th) + '" alt="" loading="lazy">' : esc(it.e)) + "</span><div><b>" + esc(it.n) + "</b><small>" + esc(SEC_OF[i][1]) + " · " + it.e.toUpperCase() + " · " + fmtSize(it.s) + "</small></div></button>"; });
    }
    res.innerHTML = h || '<div class="empty">Nichts gefunden.</div>'; SR.hits = hits; SR.sel = 0; mark();
  }
  function mark() { $$(".sr-r[data-hit]", sr).forEach(function (e, k) { e.classList.toggle("on", k === SR.sel); }); var on = $(".sr-r.on", sr); if (on) on.scrollIntoView({ block: "nearest" }); }
  function openSearch() { if (!sr.open) sr.showModal(); $("#srQ").focus(); $("#srQ").select(); runSearch($("#srQ").value); }
  function pickHit(k) {
    var h = SR.hits[k]; if (!h) return; sr.close();
    if (h.open) openLb(h.open, "srch"); else if (h.ext) window.open(h.href, "_blank", "noopener"); else location.hash = h.href;
  }
  $("#searchBtn").addEventListener("click", openSearch);
  $("#srX").addEventListener("click", function () { sr.close(); });
  sr.addEventListener("click", function (e) { if (e.target === sr) sr.close(); });
  $("#srQ").addEventListener("input", function (e) { runSearch(e.target.value); });
  $("#srQ").addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); SR.sel = Math.min(SR.sel + 1, SR.hits.length - 1); mark(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); SR.sel = Math.max(SR.sel - 1, 0); mark(); }
    else if (e.key === "Enter") { e.preventDefault(); pickHit(SR.sel); }
  });
  $("#srRes").addEventListener("click", function (e) {
    var q = e.target.closest("[data-q]"); if (q) { $("#srQ").value = q.getAttribute("data-q"); runSearch(q.getAttribute("data-q")); return; }
    var h = e.target.closest("[data-hit]"); if (h) { e.preventDefault(); pickHit(+h.getAttribute("data-hit")); }
  });

  /* ---------- Start ---------- */
  buildSide(); applyTheme(); route();
  if (window.matchMedia) matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { if (themeMode() === "auto") applyTheme(); });
})();
