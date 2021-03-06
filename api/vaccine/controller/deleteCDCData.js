const _ = require('lodash');
module.exports = async function(req, res) {
    const  sequelize  = await require('../../../models/sql');
    let query = req.params;
    console.log(query);
    try {
        let cdcDataResult = await sequelize.models['cdcData'].findOne(
            {
                where :  {
                    ...query
                }
            }
        );
        let cdcDataUpdation = await cdcDataResult.update(
            {
                isLocked : 1
            } ,
            {
                returning : true
            }
        );
        return res.json(cdcDataUpdation);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}