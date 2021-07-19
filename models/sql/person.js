const { Sequelize, DataTypes, Model } = require('sequelize');

/**
 * 
 * @param {Sequelize} sequelize 
 * @returns {Model}
 */
module.exports = (sequelize) => {
    const person = sequelize.define('person',
    {
        NHIId : {
            type: DataTypes.STRING
        },
        IdNo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        Name: { //姓名
            type: DataTypes.STRING,
            allowNull: false
        },
        Birthday: { //生日
            //https://stackoverflow.com/questions/16847672/is-there-a-simple-way-to-make-sequelize-return-its-date-time-fields-in-a-partic/17276989
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        isLocked : {
            type: DataTypes.BOOLEAN
        }
    },
    {
        freezeTableName: true ,
        indexes : [
            {
                fields: ["IdNo"],
                unique : true
            } ,
            {
                fields: ["Birthday"]
            } ,
            {
                fields : ["Name"]
            }
        ]
    });
    return person;
}