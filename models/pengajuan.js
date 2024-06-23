module.exports = (sequelize, DataTypes) => {
  const Pengajuan = sequelize.define('Pengajuan', {
    nama_lengkap: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nim: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tanggal_lahir: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    jenis_kelamin: {
      type: DataTypes.STRING,
      allowNull: false
    },
    alamat: {
      type: DataTypes.STRING,
      allowNull: false
    },
    no_hp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departement: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fakultas: {
      type: DataTypes.STRING,
      allowNull: false
    },
    kendala_bss: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    alasan_berhenti: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    dokumen_pendukung: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Pengajuan.associate = models => {
    Pengajuan.belongsTo(models.User, { foreignKey: 'userId' });
    Pengajuan.hasMany(models.Approval, { foreignKey: 'pengajuanId' });
    Pengajuan.hasMany(models.SuratKeputusan, { foreignKey: 'pengajuanId' });

  };

  return Pengajuan;
};
