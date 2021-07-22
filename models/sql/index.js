const { Sequelize, Op } = require('sequelize');
const config = require('../../config/config');
const { generateFakeData } = require('./fakeDataGenerator/index');
const { storeVaccineData } = require('../../api/vaccine/controller/postCDCData');
const sequelize = new Sequelize(config.db.database  , config.db.username , config.db.password , {
    host: config.db.hostName,
    dialect: config.db.service, //mssql
    /*logging : false*/
});
require('./person')(sequelize);
require('./agency')(sequelize);
require('./cdcData')(sequelize);
//exec this function when you init
async function init () {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        //使用sync( {force : true })把資料表砍掉重建
        //使用sync({alter: true})更改資料表內容

        //刪除所有table的外來鍵
        await dropForeignKeyConstraints(sequelize); 
        await sequelize.models['person'].sync({force : true});
        console.log("The table for the `person` model was just (re)created!");

        await sequelize.models['agency'].sync({force : true});
        console.log("The table for the `agency` model was just (re)created!");
        const agencyList = require('./data/agency.json');
        for (let agencyItem of agencyList) {
            await sequelize.models['agency'].create(agencyItem);
        }

        await sequelize.models['cdcData'].sync({ force: true });
        console.log("The table for the `cdcData` model was just (re)created!");
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

async function doFakeData () {
    const generateCount = 1000;
    for (let i = 0 ; i < generateCount ; i++)  {
        let fakeData = generateFakeData();
        let havePerson = await sequelize.models['person'].findOne({
            where : {
                [Op.or] : [
                    {IdNo : fakeData[0].IdNo}
                ]
            }
        });
        for (let fakeVaccineData of fakeData) {
            if (havePerson) {
                i--;
                break;
            }
            await storeVaccineData(sequelize, fakeVaccineData , (e)=> {
                process.exit(1);
            });
        }
    }
    console.log("!!!fake data generated!!!");
}

function dropForeignKeyConstraints(database) {
    //this is a hack for dev only!
    //todo: check status of posted github issue, https://github.com/sequelize/sequelize/issues/7606
    const queryInterface = database.getQueryInterface();
    return queryInterface.showAllTables()
    .then(tableNames => {
        return Promise.all(tableNames.map(tableName => {
            return queryInterface.showConstraint(tableName)
            .then(constraints => {
                return Promise.all(constraints.map(constraint => {
                    if (constraint.constraintType === 'FOREIGN KEY') {
                        return queryInterface.removeConstraint(tableName, constraint.constraintName);
                    }
                }));
            });
        }));
    })
    .then(() => database);
}

/**
 * @type {Sequelize}
 */
module.exports = (async function () {
    try {
        if (config.db.init) {
            await init();
            if (config.db.fakeData) {
                doFakeData();
            }
            return;
        }
        await sequelize.authenticate();

        console.log('Connection has been established successfully.');

        await sequelize.models['person'].sync();
        console.log("The table for the `person` model was just (re)created!");

        
        await sequelize.models['agency'].sync();
        console.log("The table for the `agency` model was just (re)created!")

        
        await sequelize.models['cdcData'].sync();
        console.log("The table for the `cdcData` model was just (re)created!");
        return sequelize;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
})();