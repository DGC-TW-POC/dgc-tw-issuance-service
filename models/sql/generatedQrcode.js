const { Sequelize , DataTypes } = require('sequelize');
//TBD
module.exports = (sequelize) => {
    const cdcData = sequelize.define('generatedQrCode',
    {
        IdNo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        qrcode : {
            type: DataTypes.STRING.BINARY
        } ,
        isScanned : {
            type: DataTypes.BOOLEAN
        }
    },
    {
        freezeTableName: true
    });
    return cdcData;
}