/** Halaman 2.c: form kelola kategori dengan validasi jQuery sebelum data disimpan. */
(function (app) {
  'use strict';
  var r = app.config.rules;

  function recipeCount(id) { return app.state.recipes.filter(function (x) { return x.categoryId === id; }).length; }

  function renderSwatches() {
    $('#swatches').html(app.config.colors.map(function (c, i) {
      return '<label class="sw"><input type="radio" name="warna" value="' + c + '"' + '><span style="background:' + c + '" title="Warna ' + (i + 1) + '"></span></label>';
    }).join(''));
  }

  function renderTable() {
    $('#ktable tbody').html(app.state.categories.map(function (c) {
      return '<tr><td data-l="Kategori"><span class="dot" style="background:' + app.esc(c.color) + '"></span><b>' + app.esc(c.name) + '</b></td><td data-l="Deskripsi">' + app.esc(c.description) +
        '</td><td data-l="Resep">' + recipeCount(c.id) + '</td><td data-l="Aksi" class="act"><button class="btn sm ghost" data-a="ubah" data-id="' + c.id +
        '">Ubah</button> <button class="btn sm ghost" data-a="hapus" data-id="' + c.id + '">Hapus</button></td></tr>';
    }).join(''));
  }

  function field(sel, err, msg) {
    $(sel).toggleClass('invalid', !!msg); $(err).text(msg || ''); return !msg;
  }

  function validate() {
    var id = +$('#kId').val() || 0, nama = app.trim($('#kNama').val()), desk = app.trim($('#kDesk').val()), warna = $('input[name=warna]:checked').val();
    var eNama = '';
    if (!nama) { eNama = 'Nama kategori wajib diisi.'; }
    else if (nama.length < r.catNameMin) { eNama = 'Nama minimal ' + r.catNameMin + ' karakter.'; }
    else if (nama.length > r.catNameMax) { eNama = 'Nama maksimal ' + r.catNameMax + ' karakter.'; }
    else if (!/^[A-Za-z\s&-]+$/.test(nama)) { eNama = 'Nama hanya boleh berisi huruf, spasi, & dan -.'; }
    else if (app.state.categories.some(function (c) { return c.id !== id && c.name.toLowerCase() === nama.toLowerCase(); })) { eNama = 'Kategori "' + nama + '" sudah ada.'; }
    var eDesk = '';
    if (!desk) { eDesk = 'Deskripsi wajib diisi.'; }
    else if (desk.length < r.catDescMin) { eDesk = 'Deskripsi minimal ' + r.catDescMin + ' karakter (sekarang ' + desk.length + ').'; }
    else if (desk.length > r.catDescMax) { eDesk = 'Deskripsi maksimal ' + r.catDescMax + ' karakter.'; }
    var a = field('#kNama', '#eNama', eNama), b = field('#kDesk', '#eDesk', eDesk), c = field('#swatches', '#eWarna', warna ? '' : 'Pilih satu warna label.');
    return a && b && c;
  }

  function resetForm() {
    $('#formKat')[0].reset(); $('#kId').val('');
    $('#kJudul').text('Tambah kategori'); $('#kSimpan').text('Simpan kategori'); $('#kBatal').prop('hidden', true);
    $('#kNama, #kDesk, #swatches').removeClass('invalid'); $('.err').text('');
  }

  app.kategori = {
    init: function () {
      renderSwatches(); renderTable();
      $('#kNama, #kDesk').on('blur', function () { if (app.trim(this.value)) { validate(); } });
      $('#swatches').on('change', 'input', function () { field('#swatches', '#eWarna', ''); });

      $('#formKat').on('submit', function (e) {
        e.preventDefault();
        if (!validate()) { $('.invalid').first().find('input').addBack().first().trigger('focus'); return; }
        var id = +$('#kId').val() || 0;
        var data = { name: app.trim($('#kNama').val()), description: app.trim($('#kDesk').val()), color: $('input[name=warna]:checked').val() };
        // Pada sistem sungguhan, data dikirim ke server di sini, misalnya dengan $.post('/api/kategori', data).
        if (id) {
          var c = app.state.categories.filter(function (x) { return x.id === id; })[0];
          $.extend(c, data);
          app.toast('Kategori "' + data.name + '" diperbarui.');
        } else {
          data.id = app.store.nextCatId(); app.state.categories.push(data);
          app.toast('Kategori "' + data.name + '" ditambahkan.');
        }
        app.store.save(); resetForm(); renderTable();
      });

      $('#kBatal').on('click', resetForm);

      $('#ktable').on('click', 'button', function () {
        var id = +$(this).data('id'), c = app.state.categories.filter(function (x) { return x.id === id; })[0];
        if ($(this).data('a') === 'ubah') {
          resetForm();
          $('#kId').val(c.id); $('#kNama').val(c.name); $('#kDesk').val(c.description);
          $('input[name=warna]').filter(function () { return this.value === c.color; }).prop('checked', true);
          $('#kJudul').text('Ubah kategori'); $('#kSimpan').text('Simpan perubahan'); $('#kBatal').prop('hidden', false);
          $('#kNama').trigger('focus');
        } else {
          var n = recipeCount(id);
          if (n > 0) { app.toast('Kategori "' + c.name + '" masih dipakai ' + n + ' resep, pindahkan dulu.', 'bad'); return; }
          app.openModal('<h2>Hapus kategori?</h2><p>Kategori "' + app.esc(c.name) + '" akan dihapus.</p><div class="right"><button class="btn ghost" type="button" id="batal">Batal</button> <button class="btn no" type="button" id="yaHapus">Hapus kategori</button></div>');
          $('#batal').on('click', app.closeModal);
          $('#yaHapus').on('click', function () {
            app.state.categories = app.state.categories.filter(function (x) { return x.id !== id; });
            app.store.save(); app.closeModal(); resetForm(); renderTable(); app.toast('Kategori dihapus.', 'bad');
          });
        }
      });
    }
  };
})(window.DapurAdmin);
