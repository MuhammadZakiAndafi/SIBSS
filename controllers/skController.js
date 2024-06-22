const db = require('../models');

exports.showSk = async (req, res) => {
  try {
    const userId = req.session.user.id; // Ambil userId dari pengguna yang sedang login
    const userlogin = req.session.user;
    const userRole = userlogin.role; // Mendapatkan role user
    // Ambil pengajuan yang terhubung dengan userId
    const pengajuan = await db.Pengajuan.findOne({
      where: { userId: userId }
    });
    const sks = await db.SuratKeputusan.findAll({
      where: { pengajuanId: pengajuan.id },
      include: [{model: db.Pengajuan}]
    });

    res.render('user/suratkeputusan', {
       sks,
       title: 'Surat Keputusan',
       userRole
       });
  } catch (error) {
    console.error('Error fetching surat keputusan:', error);
    res.status(500).send('Internal Server Error');
  }
};