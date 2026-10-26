/** Penyimpanan data: data awal dari JSON, perubahan admin disimpan di localStorage. */
(function (app) {
  'use strict';
  var key = app.config.storeKey;
  app.store = {
    init: function (seed) {
      var saved = null;
      try { saved = JSON.parse(localStorage.getItem(key)); } catch (e) { saved = null; }
      app.state = (saved && saved.recipes && saved.categories) ? saved : JSON.parse(JSON.stringify(seed));
    },
    save: function () {
      try { localStorage.setItem(key, JSON.stringify(app.state)); } catch (e) { app.toast('Penyimpanan browser penuh atau diblokir.', 'bad'); }
    },
    reset: function (seed) { localStorage.removeItem(key); app.store.init(seed); },
    byId: function (id) { return app.state.recipes.filter(function (r) { return r.id === id; })[0]; },
    catName: function (id) {
      var c = app.state.categories.filter(function (x) { return x.id === id; })[0];
      return c ? c.name : 'Tanpa kategori';
    },
    counts: function () {
      var n = { total: app.state.recipes.length, menunggu: 0, disetujui: 0, ditolak: 0 };
      app.state.recipes.forEach(function (r) { n[r.status]++; });
      return n;
    },
    nextCatId: function () {
      return app.state.categories.reduce(function (m, c) { return Math.max(m, c.id); }, 0) + 1;
    }
  };
})(window.DapurAdmin);
