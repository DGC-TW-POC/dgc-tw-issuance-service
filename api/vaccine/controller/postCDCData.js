const sequelize = require('../../../models/sql/index');
const _ = require('lodash');
module.exports = async function(req, res) {
    let item = req.body;
    _.set(item , "isLocked" , 0);
    try {
        let cdcDataResult = await sequelize.models['cdcData'].create(item);
        return res.json(cdcDataResult.toJSON());
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}