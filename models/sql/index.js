const { Sequelize } = require('sequelize');
const config = require('../../config/config');

const sequelize = new Sequelize(config.db.database  , config.db.username , config.db.password , {
    host: config.db.hostName,
    dialect: config.db.service, //mssql
});
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        require('./cdcData')(sequelize);
        await sequelize.models['cdcData'].sync({ alter: true });
        console.log("The table for the cdcData model was just (re)created!");
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
})();

/**
 * @type {Sequelize}
 */
module.exports = sequelize;