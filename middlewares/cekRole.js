function cekRole(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const userRole = req.session.user.role;
  const allowedRoutesForKaprodiWadek = ['/daftarPengajuan', 'riwayatpengajuan','/approval'];
  const allowedRoutesForMahasiswa = ['/pendaftaranBss', '/status', '/riwayatpengajuan', '/panduan', '/suratkeputusan'];
  
  // Allow Kaprodi and Wadek to access detail routes
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
