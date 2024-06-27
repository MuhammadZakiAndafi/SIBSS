// Model (Sequelize)
module.exports = (sequelize, DataTypes) => {
  const Approval = sequelize.define('Approval', {
      statusApprovalKaprodi: {
          type: DataTypes.ENUM,
          values: ['Diproses', 'Disetujui', 'Ditolak'],
          defaultValue: 'Diproses'
      },
      tanggalApprovalKaprodi: {
          type: DataTypes.DATE
      },
      alasanRejectKaprodi: {
          type: DataTypes.TEXT
      },
      statusApprovalWadek: {
          type: DataTypes.ENUM,
          values: ['Diproses', 'Disetujui', 'Ditolak'],
          defaultValue: 'Diproses'
      },
      tanggalApprovalWadek: {
          type: DataTypes.DATE
      },
      alasanRejectWadek: {
          type: DataTypes.TEXT
      }
  });

  Approval.associate = models => {
      Approval.belongsTo(models.Pengajuan, { foreignKey: 'pengajuanId' });
  };

  return Approval;
};
