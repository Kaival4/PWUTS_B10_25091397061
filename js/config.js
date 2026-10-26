/** Konfigurasi dan state bersama Dapur Admin. Modul lain memakai window.DapurAdmin. */
window.DapurAdmin = {
  config: {
    dataUrl: 'data/resep-masuk.json',
    pagesPath: 'pages/',
    storeKey: 'dapuradmin_state',
    sessionKey: 'dapuradmin_login',
    defaultPage: 'dashboard',
    titles: { dashboard: 'Dashboard', moderasi: 'Moderasi Resep', kategori: 'Kelola Kategori' },
    demoAccount: { user: 'admin', pass: 'admin123' },
    rules: { userMin: 4, passMin: 6, rejectMin: 10, catNameMin: 3, catNameMax: 30, catDescMin: 10, catDescMax: 120 },
    colors: ['#0E7C7B', '#2F6DB5', '#7A4FB5', '#C0392B', '#B7791F', '#5B6B7A']
  },
  state: null
};
