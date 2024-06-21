module.exports = (sequelize, DataTypes) => {
  const SuratKeputusan = sequelize.define('SuratKeputusan', {
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

  SuratKeputusan.associate = models => {
    SuratKeputusan.belongsTo(models.Pengajuan, { foreignKey: 'pengajuanId' });
  };

  return SuratKeputusan;
};
