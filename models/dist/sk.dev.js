"use strict";

module.exports = function (sequelize, DataTypes) {
  var SuratKeputusan = sequelize.define('SuratKeputusan', {
    nomor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false
    },
    keterangan: {
      type: DataTypes.TEXT
    },
    lampiran: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  SuratKeputusan.associate = function (models) {
    SuratKeputusan.belongsTo(models.Pengajuan, {
      foreignKey: 'pengajuanId'
    });
  };

  return SuratKeputusan;
};
//# sourceMappingURL=sk.dev.js.map
