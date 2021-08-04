const _ = require('lodash');

const personFields = ["NHIId", "IdNo", "Name", "Birthday", "isLocked"];
const vaccineFields = ["IdNo", "AgencyCode", "InocuDate", "VaccID", "VaccDoses", "qrcode", "dgci_hash", "isLocked"];
module.exports = async function (req, res) {
    const  sequelize  = await require('../../../models/sql');
    storeVaccineData(req.body, (e)=> {
        return res.status(500).send(e);
    }).then((result)=> {
        return res.json(result);
    });
}

async function storeVaccineData(item, onError = (e) => { }) {
    try {
        const  sequelize  = await require('../../../models/sql');
        _.set(item, "isLocked", 0);
        item.AgencyCode = _.last(item.AgencyCode.split('-'));
        let query = {
            IdNo: item.IdNo,
            VaccDoses: item.VaccDoses
        }
        let personQuery = {
            IdNo: item.IdNo
        }

        let storedPerson = await sequelize.models['person'].findOne({
            where: {
                ...personQuery
            }
        });
        if (!storedPerson) {
            let personData = {};
            for (let field of personFields) {
                personData[field] = item[field];
            }
            await sequelize.models['person'].create(personData);
        }
        let storedData = await sequelize.models['cdcData'].findOne({
            where: {
                ...query
            }
        });
        if (storedData) {
            let updateResult = await storedData.update(item);
            return updateResult.toJSON();
        } else {
            let insertResult = await sequelize.models['cdcData'].create(item);
            return insertResult.toJSON();
        }
    } catch (e) {
        console.error(e);
        onError(e);
        return false;
    }
}

module.exports.storeVaccineData = storeVaccineData;