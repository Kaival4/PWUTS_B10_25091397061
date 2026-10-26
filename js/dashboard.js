/** Ringkasan di halaman Dashboard (2.a). render() dipanggil lagi setiap data berubah. */
(function (app) {
  'use strict';
  app.dash = {
    render: function () {
      var n = app.store.counts(), t = n.total || 1;
      $('#sTotal').text(n.total); $('#sWait').text(n.menunggu); $('#sOk').text(n.disetujui); $('#sNo').text(n.ditolak);
      $('#bWait').css('width', (n.menunggu / t * 100) + '%');
      $('#bOk').css('width', (n.disetujui / t * 100) + '%');
      $('#bNo').css('width', (n.ditolak / t * 100) + '%');
      $('#barTxt').text(n.menunggu + ' menunggu, ' + n.disetujui + ' disetujui, ' + n.ditolak + ' ditolak dari ' + n.total + ' resep.');
      $('#badge').text(n.menunggu).prop('hidden', n.menunggu === 0);

      var latest = app.state.recipes.slice().sort(function (a, b) { return b.date < a.date ? -1 : b.date > a.date ? 1 : b.id - a.id; }).slice(0, 5);
      $('#recent').html(latest.length ? latest.map(function (r) {
        return '<li><div><b>' + app.esc(r.title) + '</b><small>' + app.esc(r.uploader) + ', ' + app.fmtDate(r.date) + '</small></div>' + app.pill(r.status) + '</li>';
      }).join('') : '<li class="muted">Belum ada resep yang masuk.</li>');
    }
  };
})(window.DapurAdmin);
