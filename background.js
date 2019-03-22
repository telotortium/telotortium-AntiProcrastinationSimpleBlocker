/*! simple-blocker 2016-08-21 */
function first_time_setup_check() {
  void 0 === localStorage.sbisinstalled &&
    ((localStorage.sbisinstalled = "true"),
    chrome.tabs.create({ url: chrome.extension.getURL("options.html") }));
}
function local_storage_check() {
  void 0 === localStorage.activated && (localStorage.activated = "true"),
    void 0 === localStorage.blocklist &&
      (localStorage.blocklist = JSON.stringify({})),
    void 0 === localStorage.blockextensions &&
      (localStorage.blockextensions = "false"),
    void 0 === localStorage.locked && (localStorage.locked = "false"),
    void 0 === localStorage.password &&
      (localStorage.password = JSON.stringify(null)),
    void 0 === localStorage.flippoweroff &&
      (localStorage.flippoweroff = "false"),
    void 0 === localStorage.timeron && (localStorage.timeron = "false"),
    void 0 === localStorage.timerend &&
      (localStorage.timerend = JSON.stringify(0)),
    void 0 === localStorage.blockcount &&
      (localStorage.blockcount = JSON.stringify(0)),
    version_check();
}
function version_check() {
  var a = chrome.runtime.getManifest(),
    b = a.version;
  localStorage.version = JSON.stringify(b);
}
function checktime() {
  if ("true" === localStorage.timeron) {
    var a = new Date(),
      b = a.getTime(),
      c = JSON.parse(localStorage.timerend);
    b > c &&
      ((localStorage.timeron = !1),
      (localStorage.activated = (localStorage.activated === "false" ? !0 : !1)),
      (localStorage.flippoweroff = !0));
  }
}
function checkUrl(a, b) {
  if (null !== b) {
    for (
      var c = JSON.parse(localStorage.blocklist),
        d = new RegExp("chrome://extensions", "i"),
        e = new RegExp(chrome.extension.getURL(""), "i"),
        f = 0;
      f < c.length;
      f++
    ) {
      var g = new RegExp(c[f], "i");
      g.test(b) && !e.test(b) && block(a, b);
    }
    "true" === localStorage.blockextensions && d.test(b) && block(a, b);
  }
}
function block(a) {
  "true" === localStorage.activated &&
    chrome.tabs.update(a, { url: chrome.extension.getURL("blocked.html") });
}
function checkAllTabs() {
  chrome.tabs.query({}, function(a) {
    for (var b = 0; b < a.length; b++) checkUrl(a[b].id, a[b].url);
  });
}
var scanFreq = 5e3;
local_storage_check(),
  first_time_setup_check(),
  setInterval(local_storage_check, 3e4),
  setInterval(checktime, 1e3),
  checkAllTabs(),
  setInterval(checkAllTabs, scanFreq),
  chrome.tabs.onUpdated.addListener(function(a, b, c) {
    checkUrl(a, c.url);
  }),
  chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({ url: "options.html" });
  }),
  (function(a, b, c, d, e, f, g) {
    (a.GoogleAnalyticsObject = e),
      (a[e] =
        a[e] ||
        function() {
          (a[e].q = a[e].q || []).push(arguments);
        }),
      (a[e].l = 1 * new Date()),
      (f = b.createElement(c)),
      (g = b.getElementsByTagName(c)[0]),
      (f.async = 1),
      (f.src = d),
      g.parentNode.insertBefore(f, g);
  })(
    window,
    document,
    "script",
    "https://www.google-analytics.com/analytics.js",
    "ga"
  ),
  ga("create", "UA-39146256-6", "auto"),
  ga("set", "checkProtocolTask", null),
  ga("send", "pageview", "/background");

