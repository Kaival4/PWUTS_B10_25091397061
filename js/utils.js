/** Fungsi bantu: escape HTML, format tanggal, modal, dan toast. */
(function (app) {
  'use strict';
  var map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  app.trim = function (s) { return String(s == null ? '' : s).trim(); };
  app.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return map[c]; }); };
  app.fmtDate = function (iso) {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  app.statusLabel = { menunggu: 'Menunggu', disetujui: 'Disetujui', ditolak: 'Ditolak' };
  app.pill = function (s) { return '<span class="pill ' + s + '">' + app.statusLabel[s] + '</span>'; };

  var lastFocus = null;
  app.openModal = function (html) {
    lastFocus = document.activeElement;
    $('#mbody').html(html);
    $('#modal').addClass('on');
    $('#mbody').find('textarea,input,button').first().trigger('focus');
  };
  app.closeModal = function () {
    $('#modal').removeClass('on');
    $('#mbody').empty();
    if (lastFocus) { $(lastFocus).trigger('focus'); }
  };
  var toastTimer;
  app.toast = function (msg, type) {
    $('#toast').attr('class', 'on ' + (type || 'ok')).text(msg);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { $('#toast').removeClass('on'); }, 2800);
  };

  $(function () {
    $('#modal').on('click', function (e) { if (e.target === this) { app.closeModal(); } });
    $('#modal .x').on('click', app.closeModal);
    $(document).on('keydown', function (e) { if (e.key === 'Escape') { app.closeModal(); } });
  });
})(window.DapurAdmin);
