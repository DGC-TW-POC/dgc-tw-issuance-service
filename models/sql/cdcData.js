const { Sequelize, DataTypes, Model } = require('sequelize');
/**
 * 
 * @param {Sequelize} sequelize 
 * @returns {Model}
 */
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
        qrcode: {
            type: DataTypes.BLOB
        },
        dgci_hash : {
            type: DataTypes.STRING(512)
        },
        isLocked : {
            type: DataTypes.BOOLEAN
        }
    },
    {
        freezeTableName: true,
        indexes : [
            {
                fields : ["IdNo"]
            } ,
            {
                fields: ["AgencyCode"]
            }
        ]
    });
    const person = require('./person')(sequelize);
    const agency = require('./agency')(sequelize);
    cdcData.belongsTo(person , {
        foreignKey: "IdNo" ,
        targetKey: "IdNo"
    });
    cdcData.belongsTo(agency , {
        foreignKey: "AgencyCode" ,
        targetKey: "AgencyCode"
    })
    return cdcData;
}