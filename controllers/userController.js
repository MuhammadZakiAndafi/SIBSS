const bcrypt = require('bcryptjs');
const db = require('../models');

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
  const userRole = userlogin.role; // Mendapatkan role user
    // Render halaman status dengan data approvals dan pengguna yang sedang login
    res.render('user/profile', {
      title: 'Profile',
      user: req.session.user, // Data pengguna yang sedang login
      user: user,
      userRole
    });
  };
  
exports.profile = async (req, res) => {
   // Ambil data pengguna yang sedang login
   const userId = req.session.user.id;

   // Ambil pengajuanId dari model Pengajuan berdasarkan userId
   try {
    const user = await db.User.findOne({
      where: { userId: userId },
      include: [{ model: db.User }]
    }); 
    req.session.user = user;
    res.redirect('/profile');
  }  catch (error) {
    console.error('Error fetching approvals:', error);
    res.status(500).send('Internal Server Error');
  }
};