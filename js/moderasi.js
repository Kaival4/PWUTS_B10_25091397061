/** Halaman 2.b: moderasi resep (cari, filter status, setujui, tolak, hapus, detail). */
(function (app) {
  'use strict';
  var f = { q: '', s: '' };

  function render() {
    var q = f.q.toLowerCase();
    var list = app.state.recipes.filter(function (r) {
      return (!f.s || r.status === f.s) && (!q || (r.title + ' ' + r.uploader).toLowerCase().indexOf(q) > -1);
    }).sort(function (a, b) { return b.date < a.date ? -1 : b.date > a.date ? 1 : b.id - a.id; });

    $('#mtable tbody').html(list.map(function (r) {
      var act = '<button class="btn sm ghost" data-a="lihat" data-id="' + r.id + '">Detail</button>';
      if (r.status !== 'disetujui') { act += ' <button class="btn sm ok" data-a="setuju" data-id="' + r.id + '">Setujui</button>'; }
      if (r.status !== 'ditolak') { act += ' <button class="btn sm no" data-a="tolak" data-id="' + r.id + '">Tolak</button>'; }
      act += ' <button class="btn sm ghost" data-a="hapus" data-id="' + r.id + '">Hapus</button>';
      return '<tr><td data-l="Judul"><b>' + app.esc(r.title) + '</b></td><td data-l="Pengunggah">' + app.esc(r.uploader) +
        '</td><td data-l="Kategori">' + app.esc(app.store.catName(r.categoryId)) + '</td><td data-l="Tanggal">' + app.fmtDate(r.date) +
        '</td><td data-l="Status">' + app.pill(r.status) + '</td><td data-l="Aksi" class="act">' + act + '</td></tr>';
    }).join(''));
    $('#mempty').prop('hidden', list.length > 0);
    $('#mtable').prop('hidden', list.length === 0);

    var n = app.store.counts();
    $('#mtabs button').each(function () {
      var s = $(this).data('s');
      $(this).find('i').text(s ? n[s] : n.total);
    });
  }

  function setStatus(id, status, reason) {
    var r = app.store.byId(id);
    r.status = status;
    if (status === 'ditolak') { r.rejectReason = reason; } else { delete r.rejectReason; }
    app.store.save();
    app.dash.render();
    render();
    app.toast('Resep "' + r.title + '" ' + app.statusLabel[status].toLowerCase() + '.', status === 'ditolak' ? 'bad' : 'ok');
  }

  function showDetail(id) {
    var r = app.store.byId(id);
    var html = '<h2>' + app.esc(r.title) + '</h2><p class="muted">' + app.esc(r.uploader) + ' | ' + app.esc(app.store.catName(r.categoryId)) +
      ' | ' + r.cookTime + ' menit | ' + app.esc(r.difficulty) + ' | ' + app.fmtDate(r.date) + '</p><p>' + app.pill(r.status) + '</p><p>' + app.esc(r.description) + '</p>' +
      '<h3>Bahan</h3><ul>' + r.ingredients.map(function (x) { return '<li>' + app.esc(x) + '</li>'; }).join('') + '</ul>' +
      '<h3>Langkah</h3><ol>' + r.steps.map(function (x) { return '<li>' + app.esc(x) + '</li>'; }).join('') + '</ol>';
    if (r.status === 'ditolak' && r.rejectReason) { html += '<p class="alert">Alasan penolakan: ' + app.esc(r.rejectReason) + '</p>'; }
    app.openModal(html);
  }

  function askReject(id) {
    var r = app.store.byId(id), min = app.config.rules.rejectMin;
    app.openModal('<h2>Tolak resep</h2><p>"' + app.esc(r.title) + '" dari ' + app.esc(r.uploader) + '</p>' +
      '<div class="fg"><label for="alasan">Alasan penolakan</label><textarea id="alasan" rows="3"></textarea><span class="err" id="eAlasan"></span></div>' +
      '<div class="right"><button class="btn ghost" type="button" id="batal">Batal</button> <button class="btn no" type="button" id="kirimTolak">Tolak resep</button></div>');
    $('#batal').on('click', app.closeModal);
    $('#kirimTolak').on('click', function () {
      var v = app.trim($('#alasan').val());
      if (v.length < min) {
        $('#alasan').addClass('invalid'); $('#eAlasan').text(v ? 'Alasan minimal ' + min + ' karakter.' : 'Alasan wajib diisi.'); return;
      }
      app.closeModal(); setStatus(id, 'ditolak', v);
    });
  }

  function askDelete(id) {
    var r = app.store.byId(id);
    app.openModal('<h2>Hapus resep?</h2><p>"' + app.esc(r.title) + '" akan dihapus dari daftar moderasi dan tidak bisa dikembalikan.</p>' +
      '<div class="right"><button class="btn ghost" type="button" id="batal">Batal</button> <button class="btn no" type="button" id="yaHapus">Hapus resep</button></div>');
    $('#batal').on('click', app.closeModal);
    $('#yaHapus').on('click', function () {
      app.state.recipes = app.state.recipes.filter(function (x) { return x.id !== id; });
      app.store.save(); app.closeModal(); app.dash.render(); render(); app.toast('Resep dihapus.', 'bad');
    });
  }

  app.moderasi = {
    init: function () {
      f = { q: '', s: '' };
      $('#mq').on('input', function () { f.q = this.value; render(); });
      $('#mtabs').on('click', 'button', function () {
        f.s = $(this).data('s'); $('#mtabs button').removeClass('on'); $(this).addClass('on'); render();
      });
      $('#mtable').on('click', 'button', function () {
        var id = +$(this).data('id'), a = $(this).data('a');
        if (a === 'lihat') { showDetail(id); }
        else if (a === 'setuju') { setStatus(id, 'disetujui'); }
        else if (a === 'tolak') { askReject(id); }
        else if (a === 'hapus') { askDelete(id); }
      });
      render();
    }
  };
})(window.DapurAdmin);
