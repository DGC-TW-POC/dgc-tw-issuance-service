const { Sequelize, DataTypes, Model } = require('sequelize');

/**
 * 
 * @param {Sequelize} sequelize 
 * @returns {Model}
 */
module.exports = (sequelize) => {
    const agency = sequelize.define('agency',
    {
        AgencyCode: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        Name: { 
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        freezeTableName: true ,
        timestamps: false,
        indexes : [
            {
                fields: ["AgencyCode"]
            },
            {
                fields: ["Name"]
            } 
        ]
    });
    return agency;
}