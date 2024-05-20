const {DataTypes} = require('sequelize')
const sequelize = require('../config/dbConfig')

const user = sequelize.define('user', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
    },
    nama: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    nim: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    role: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    created_at:{
        type:DataTypes.DATE,
        allowNull: false
    },
    updated_at: {
        type:DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'user',
    timeStamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = user