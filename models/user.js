module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nim: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'mahasiswa'
    }
  });

  User.associate = models => {
    User.hasMany(models.Pengajuan, { foreignKey: 'userId' });
  };

  return User;
};
