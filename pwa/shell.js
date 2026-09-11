(function () {
  var cfg = window.HK_PWA || {};
  function mergeGasUrl(gas) {
    var u;
    try { u = new URL(gas); } catch (err) { return gas; }
    var extra = new URLSearchParams(location.search || "");
    extra.forEach(function (value, key) {
      if (!u.searchParams.has(key)) u.searchParams.set(key, value);
    });
    return u.toString();
  }
  if (!/\/$|\.html$/i.test(location.pathname)) {
    location.replace(location.pathname + "/" + location.search + location.hash);
    return;
  }
  var frame = document.getElementById("app");
  if (frame) frame.src = mergeGasUrl(cfg.gas || "");
  var hint = document.getElementById("hint");
  var key = "hk_pwa_hint_" + (cfg.id || "app");
  if (hint && localStorage.getItem(key) === "1") hint.style.display = "none";
  var closeBtn = document.getElementById("hintClose");
  if (closeBtn) {
    closeBtn.onclick = function () {
      localStorage.setItem(key, "1");
      if (hint) hint.style.display = "none";
    };
  }
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js");
  }
})();
