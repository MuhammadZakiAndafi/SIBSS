const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json');

const sequelize = new Sequelize(config.development);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, DataTypes);
db.Pengajuan = require('./pengajuan')(sequelize, DataTypes);
db.Approval = require('./approval')(sequelize, DataTypes);
db.SuratKeputusan = require('./sk')(sequelize, DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.sync({ force: false }).then(() => {
  console.log('Database & tables created!');
});

module.exports = db;
 