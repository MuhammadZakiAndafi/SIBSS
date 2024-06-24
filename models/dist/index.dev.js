"use strict";

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    DataTypes = _require.DataTypes;

var config = require('../config/config.json');

var sequelize = new Sequelize(config.development);
var db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require('./user')(sequelize, DataTypes);
db.Pengajuan = require('./pengajuan')(sequelize, DataTypes);
db.Approval = require('./approval')(sequelize, DataTypes);
db.SuratKeputusan = require('./sk')(sequelize, DataTypes); // Mengatur asosiasi model

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}); // Sinkronisasi model

sequelize.sync({
  force: false
}).then(function () {
  console.log('Database & tables created!');
});
module.exports = db;
//# sourceMappingURL=index.dev.js.map
