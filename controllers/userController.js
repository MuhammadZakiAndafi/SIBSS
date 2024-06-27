const bcrypt = require('bcryptjs');
const db = require('../models');
const { Op } = require('sequelize'); 

exports.showDashboard = (req, res) => {
  res.render('user/dashboard', { title: 'Dashboard' });
};

exports.ubahPassword = async (req, res) => {
  const userId = req.session.user.id; 
  const userRole = req.session.user.role; 
  res.render('user/ubahpassword', {
     title: 'Ubah password',
     userRole
     });
};
exports.updatePassword = async (req, res) => {
const userRole = req.session.user.role;
const { current_password, new_password, confirm_password } = req.body;

if (new_password !== confirm_password) {
  req.flash('error', 'Kata sandi baru dan konfirmasi kata sandi tidak cocok');
  return res.redirect('/ubahpassword');
}

try {
  const userId = req.session.user.id;
  const user = await db.User.findByPk(userId);

  if (!user) {
    req.flash('error', 'Pengguna tidak ditemukan');
    return res.redirect('/ubahpassword');
  }

  const isMatch = await bcrypt.compare(current_password, user.password);

  if (!isMatch) {
    req.flash('error', 'Kata sandi lama salah');
    return res.redirect('/ubahpassword');
  }

  const hashedPassword = await bcrypt.hash(new_password, 10);
  user.password = hashedPassword;
  await user.save();

  req.flash('success', 'Kata sandi berhasil diperbarui');
  res.redirect('/pendaftaranBSS');
} catch (error) {
  console.error('Error updating password:', error);
  req.flash('error', 'Gagal memperbarui kata sandi');
  res.redirect('/ubahpassword');
}
};


exports.showNotifications = async (req, res) => {
  try {
    const userRole = req.session.user.role;
    if (!req.session.user || !req.session.user.id) {
      return res.status(401).send('User not authenticated');
    }

    const userId = req.session.user.id;

    const pengajuanList = await db.Pengajuan.findAll({
      where: { userId: userId },
      include: [{
        model: db.Approval,
        where: {
          [Op.or]: [
            { statusApprovalKaprodi: 'Disetujui' },
            { statusApprovalWadek: 'Disetujui' },
            { statusApprovalKaprodi: 'Ditolak' },
            { statusApprovalWadek: 'Ditolak' },
            { statusApprovalKaprodi: 'Diproses' },
            { statusApprovalWadek: 'Diproses' }
          ]
        }
      }]
    });

    res.render('user/notifications', {
      title: 'Notifikasi Pengajuan',
      user: req.session.user,
      pengajuanList: pengajuanList,
      userRole
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Internal Server Error');
  }
};


exports.showLoginForm = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.User.findOne({ where: { email } });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      res.redirect('/pendaftaranBss');
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

exports.showRegisterForm = (req, res) => {
  res.render('auth/register', { title: 'Register' });
};

exports.register = async (req, res) => {
  const { nim, name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({ nim, name, email, password: hashedPassword, role });
    req.session.user = user;
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(400).send('User already exists');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error logging out');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};

exports.showProfile = async (req, res) => {
  const userRole = req.session.user.role; // Mendapatkan role user
    // Render halaman status dengan data approvals dan pengguna yang sedang login
    res.render('user/profile', {
      title: 'Profile',
      user: req.session.user, 
      userRole
    }); 
  };

exports.profile = async (req, res) => {
   // Ambil data pengguna yang sedang login
   const userId = req.session.user.id;

   // Ambil pengajuanId dari model Pengajuan berdasarkan userId
   try {
    const user = await db.User.findOne({
      where: { id: userId },
      include: [{ model: db.User }]
    }); 
    req.session.user = user;
    res.redirect('/profile');
  }  catch (error) {
    console.error('Error fetching approvals:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.session.user.id; // Ambil ID pengguna dari sesi
    const { name, nim, email } = req.body; // Ambil data dari body request

    // Pastikan pengguna ditemukan
    const user = await db.User.findOne({
      where: {
        id: userId
      }
    });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update profil berdasarkan ID pengguna
    const [updatedRows] = await db.User.update({
      name,
      nim,
      email
    }, {
      where: {
        id: userId
      }
    });

    if (updatedRows === 0) {
      return res.status(404).send('User not found or not updated');
    }

    // Perbarui data pengguna dalam sesi setelah berhasil diupdate
    req.session.user = await db.User.findOne({
      where: {
        id: userId
      }
    });

    res.redirect('/profile'); // Redirect setelah berhasil update

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Internal Server Error');
  }
};

