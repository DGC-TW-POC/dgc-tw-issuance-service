const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const cdcData = sequelize.define('cdcData',
    {
        AgencyCode : {
            type: DataTypes.STRING,
            allowNull: false
        },
        IdNo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        Birthday: {
            //https://stackoverflow.com/questions/16847672/is-there-a-simple-way-to-make-sequelize-return-its-date-time-fields-in-a-partic/17276989
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        InocuDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        VaccID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        VaccDoses: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isLocked : {
            type: DataTypes.BOOLEAN
        }
    },
    {
        freezeTableName: true
        // 这是其他模型参数
    });
    return cdcData;
}