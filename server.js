const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const app = express();
const port = 3000;
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');
const pengajuanRoutes = require('./routes/pengajuanRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const skRoutes = require('./routes/skRoutes');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Pastikan secure diatur ke true di production
}));

// Middleware untuk flash messages
app.use(flash());

// Middleware untuk mengatur flash messages ke res.locals
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

app.get('/', (req, res) => {
  res.render('auth/login');
});

// routes
app.use('/', userRoutes);
app.use('/', pengajuanRoutes);
app.use('/', approvalRoutes);
app.use('/', skRoutes);

sequelize.sync({ force: false })  // Set to true if you want to drop and recreate tables
  .then(() => {
    console.log('Database synced');
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
