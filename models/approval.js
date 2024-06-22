module.exports = (sequelize, DataTypes) => {
    const Approval = sequelize.define('Approval', {
      statusApprovalKaprodi: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      tanggalApprovalKaprodi: {
        type: DataTypes.DATE
      },
      statusApprovalWadek: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      tanggalApprovalWadek: {
        type: DataTypes.DATE
      }
    });
  
    Approval.associate = models => {
      Approval.belongsTo(models.Pengajuan, { foreignKey: 'pengajuanId' });
    };
  
    return Approval;
  };
  