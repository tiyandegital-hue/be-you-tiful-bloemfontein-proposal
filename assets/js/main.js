/* Be you tiful Studio — site interactions. No external requests. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");
  var B = window.BYT || {};

  /* ---- fill [data-cfg] slots + [data-wa] links from the single config ---- */
  function waLink(msg) {
    return "https://wa.me/" + (B.waNumber || "") + (msg ? "?text=" + encodeURIComponent(msg) : "");
  }
  document.querySelectorAll("[data-cfg]").forEach(function (el) {
    var k = el.getAttribute("data-cfg");
    if (B[k] != null) el.textContent = B[k];
  });
  document.querySelectorAll("[data-wa]").forEach(function (el) {
    var msg = el.getAttribute("data-wa-msg") || "";
    el.setAttribute("href", waLink(msg));
  });
  document.querySelectorAll("[data-fb]").forEach(function (el) { el.setAttribute("href", B.facebook || "#"); });
  document.querySelectorAll("[data-fresha]").forEach(function (el) { el.setAttribute("href", B.fresha || "#"); });
  document.querySelectorAll("[data-directions]").forEach(function (el) { el.setAttribute("href", B.directions || "#"); });

  /* ---- marquee: duplicate track content for a seamless loop ---- */
  document.querySelectorAll(".marquee-track").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* ---- mobile nav ---- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { mobileNav.classList.remove("open"); });
    });
  }

  /* ---- scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- category filters (services + gallery) ---- */
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var targetSel = group.getAttribute("data-filter-target");
    var items = document.querySelectorAll(targetSel);
    group.querySelectorAll(".pill").forEach(function (pill) {
      pill.addEventListener("click", function () {
        group.querySelectorAll(".pill").forEach(function (p) { p.setAttribute("aria-pressed", "false"); });
        pill.setAttribute("aria-pressed", "true");
        var f = pill.getAttribute("data-filter");
        items.forEach(function (item) {
          var cats = (item.getAttribute("data-cat") || "").split(" ");
          item.classList.toggle("hidden", f !== "all" && cats.indexOf(f) === -1);
        });
        var count = document.querySelector("[data-filter-count]");
        if (count) {
          var visible = Array.prototype.filter.call(items, function (i) { return !i.classList.contains("hidden"); }).length;
          count.textContent = visible + " look" + (visible === 1 ? "" : "s") + " shown";
        }
      });
    });
  });

  /* ---- before / after sliders ---- */
  document.querySelectorAll(".ba").forEach(function (ba) {
    var range = ba.querySelector('input[type="range"]');
    if (!range) return;
    var setPos = function (v) { ba.style.setProperty("--pos", v + "%"); };
    range.addEventListener("input", function () { setPos(range.value); });
    setPos(range.value || 50);
  });

  /* ---- booking templates ---- */
  var preview = document.getElementById("msg-preview");
  var openWa = document.getElementById("open-wa");
  var copyBtn = document.getElementById("copy-msg");
  var copiedNote = document.getElementById("copied-note");
  function syncWaLink() {
    if (!preview || !openWa) return;
    openWa.setAttribute("href", waLink(preview.value.trim()));
  }
  if (preview) {
    preview.addEventListener("input", syncWaLink);
    syncWaLink();
  }
  document.querySelectorAll("[data-template]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll("[data-template]").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      if (preview) {
        preview.value = btn.getAttribute("data-template");
        preview.focus();
        syncWaLink();
      }
    });
  });
  if (copyBtn && preview) {
    copyBtn.addEventListener("click", function () {
      var done = function () {
        if (copiedNote) copiedNote.textContent = "Message copied — paste it into WhatsApp.";
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(preview.value).then(done, done);
      } else {
        preview.select();
        try { document.execCommand("copy"); } catch (e) {}
        done();
      }
    });
  }
})();
