/** Login admin simulasi dengan validasi jQuery. Tidak ada server, jadi sesi disimpan di sessionStorage. */
(function (app) {
  'use strict';
  var r = app.config.rules;
  app.auth = {
    isLoggedIn: function () { return sessionStorage.getItem(app.config.sessionKey) === '1'; },
    logout: function () { sessionStorage.removeItem(app.config.sessionKey); },
    init: function (onSuccess) {
      function check() {
        var u = app.trim($('#user').val()), p = $('#pass').val(), ok = true;
        $('#eUser, #ePass').text(''); $('#loginErr').prop('hidden', true);
        $('#user, #pass').removeClass('invalid');
        if (!u) { $('#eUser').text('Username wajib diisi.'); ok = false; }
        else if (u.length < r.userMin) { $('#eUser').text('Username minimal ' + r.userMin + ' karakter.'); ok = false; }
        if (!p) { $('#ePass').text('Kata sandi wajib diisi.'); ok = false; }
        else if (p.length < r.passMin) { $('#ePass').text('Kata sandi minimal ' + r.passMin + ' karakter.'); ok = false; }
        if ($('#eUser').text()) { $('#user').addClass('invalid'); }
        if ($('#ePass').text()) { $('#pass').addClass('invalid'); }
        return ok;
      }
      $('#formLogin').on('submit', function (e) {
        e.preventDefault();
        if (!check()) { return; }
        var d = app.config.demoAccount;
        if (app.trim($('#user').val()) === d.user && $('#pass').val() === d.pass) {
          sessionStorage.setItem(app.config.sessionKey, '1');
          $('#pass').val('');
          onSuccess();
        } else {
          $('#loginErr').text('Username atau kata sandi salah. Coba akun demo di bawah form.').prop('hidden', false);
        }
      });
    }
  };
})(window.DapurAdmin);
