function cekRole(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const userRole = req.session.user.role;
  const allowedRoutesForKaprodiWadek = ['/dashboard','/profile','/daftarPengajuan', '/riwayatpengajuan','/approval','/statusdaftarmahasiswa'];
  const allowedRoutesForMahasiswa = ['/dashboard', '/profile','/pendaftaranBss','/pengajuanTerkirim', '/status', '/riwayatpengajuanmahasiswa', '/periodeBSS' ,'/detailpengajuan/:id', '/panduan', '/suratkeputusan'];
  
  
  const isDetailRoute = req.path.startsWith('/detail/');

  if (userRole === 'kaprodi' || userRole === 'wadek') {
    if (allowedRoutesForKaprodiWadek.includes(req.path) || isDetailRoute) {
      return next();
    } else {
      req.flash('error', 'Anda tidak memiliki izin untuk mengakses halaman ini.');
      return res.redirect('/daftarPengajuan');
    }
  } else if (userRole === 'mahasiswa') {
    if (allowedRoutesForMahasiswa.includes(req.path)) {
      return next();
    } else {
      req.flash('error', 'Anda tidak memiliki izin untuk mengakses halaman ini.');
      return res.redirect('/pendaftaranBss');
    }
  } else {
    req.flash('error', 'Peran tidak dikenali.');
    return res.redirect('/login');
  }
}

module.exports = cekRole;
