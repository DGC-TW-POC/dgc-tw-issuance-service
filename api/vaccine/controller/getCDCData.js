const sequelize = require('../../../models/sql/index');
const _ = require('lodash');
module.exports = async function(req, res) {
    let query = req.query;
    query = _.pickBy(query , _.identity);
    _.set(query , "isLocked" , 0);
    console.log(query);
    if (_.get(query , 'VaccDoses') == 0) {
        delete query['VaccDoses'];
    }
    try {
        let cdcDataResult = await sequelize.models['cdcData'].findAll({
            where :  {
                ...query
            }
        });
        return res.json(cdcDataResult);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}