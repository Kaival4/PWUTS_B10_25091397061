/**
 * Titik masuk (item 2.a): login, layout dashboard, navigasi hash (#dashboard, #moderasi, #kategori),
 * dan pemuatan halaman konten lewat Ajax ($.load).
 */
(function (app) {
  'use strict';
  var cfg = app.config, seed = null;
  var initPage = { moderasi: function () { app.moderasi.init(); }, kategori: function () { app.kategori.init(); } };

  function pageName() {
    var n = (location.hash || '#' + cfg.defaultPage).slice(1);
    return cfg.titles[n] ? n : cfg.defaultPage;
  }

  function closeSide() { $('#side').removeClass('open'); $('#scrim').removeClass('on'); $('#burger').attr('aria-expanded', false); }

  function showPage() {
    var n = pageName();
    $('#nav a').removeClass('on').filter('[href="#' + n + '"]').addClass('on');
    $('#judul').text(cfg.titles[n]);
    document.title = cfg.titles[n] + ' - Dapur Admin';
    closeSide(); window.scrollTo(0, 0);
    if (n === cfg.defaultPage) {
      $('#konten').prop('hidden', true).empty(); $('#dash').prop('hidden', false); app.dash.render();
      return;
    }
    $('#dash').prop('hidden', true);
    // Teknik Ajax: memuat pages/<nama>.html ke area konten tanpa memuat ulang sidebar.
    $('#konten').prop('hidden', false).html('<p class="empty">Memuat halaman...</p>').load(cfg.pagesPath + n + '.html', function (res, status) {
      if (status === 'error') { $('#konten').html('<p class="empty">Halaman gagal dimuat. Jalankan lewat server lokal (lihat README).</p>'); return; }
      initPage[n]();
    });
  }

  function enter() {
    $('#login').prop('hidden', true); $('#app').prop('hidden', false);
    app.dash.render(); showPage();
  }

  function leave() {
    app.auth.logout(); $('#app').prop('hidden', true); $('#login').prop('hidden', false);
    $('#user').trigger('focus');
  }

  $(function () {
    $.getJSON(cfg.dataUrl).done(function (data) {
      seed = data; app.store.init(data);
      app.auth.init(enter);
      $(window).on('hashchange', function () { if (app.auth.isLoggedIn()) { showPage(); } });
      $('#logout').on('click', leave);
      $('#burger').on('click', function () {
        var open = $('#side').toggleClass('open').hasClass('open');
        $('#scrim').toggleClass('on', open); $(this).attr('aria-expanded', open);
      });
      $('#scrim').on('click', closeSide);
      $('#reset').on('click', function () { app.store.reset(seed); app.dash.render(); app.toast('Data demo dikembalikan.'); });
      if (app.auth.isLoggedIn()) { enter(); } else { $('#login').prop('hidden', false); }
    }).fail(function () {
      $('#login').prop('hidden', false).find('form').prepend('<p class="alert">Data gagal dimuat. Jalankan lewat server lokal (lihat README).</p>');
    });
  });
})(window.DapurAdmin);
