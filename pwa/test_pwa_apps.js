"use strict";

var fs = require("fs");
var path = require("path");
var assert = require("assert");

var root = __dirname;
var apps = JSON.parse(fs.readFileSync(path.join(root, "apps.json"), "utf8"));

assert.strictEqual(apps.length, 6, "six user apps");

var ids = apps.map(function (app) { return app.id; });
assert.deepStrictEqual(ids, [
  "price-manager",
  "price-sales",
  "crm",
  "board",
  "serviceman",
  "dashboard"
]);

apps.forEach(function (app) {
  var dir = path.join(root, app.id);
  var html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
  var manifest = JSON.parse(fs.readFileSync(path.join(dir, "manifest.json"), "utf8"));
  var sw = fs.readFileSync(path.join(dir, "sw.js"), "utf8");

  assert.ok(html.indexOf('rel="manifest"') !== -1, app.id + " manifest link");
  assert.ok(html.indexOf("apple-touch-icon") !== -1, app.id + " apple icon");
  assert.ok(html.indexOf("../icons/app-icon-180.png") !== -1, app.id + " 180 icon");
  assert.ok(html.indexOf("../shell.js") !== -1, app.id + " shared shell");
  assert.ok(html.indexOf(app.gas) !== -1, app.id + " gas url");
  assert.ok(html.indexOf("Vazirmatn") !== -1, app.id + " vazirmatn");
  assert.strictEqual(manifest.short_name, app.short);
  assert.strictEqual(manifest.display, "standalone");
  assert.strictEqual(manifest.start_url, "./index.html");
  assert.ok(manifest.icons.length >= 2, app.id + " icons");
  assert.ok(sw.indexOf("skipWaiting") !== -1, app.id + " sw");
  assert.ok(app.gas.indexOf("/exec") !== -1, app.id + " exec");
});

assert.strictEqual(apps.filter(function (app) { return app.fast; }).length, 5);

var hub = fs.readFileSync(path.join(root, "index.html"), "utf8");
apps.forEach(function (app) {
  assert.ok(hub.indexOf("./" + app.id + "/") !== -1, "hub link " + app.id);
});

["app-icon-180.png", "app-icon-192.png", "app-icon-512.png"].forEach(function (name) {
  var file = path.join(root, "icons", name);
  assert.ok(fs.statSync(file).size > 1000, name);
});

console.log("PASS pwa six apps + hub + logos");
