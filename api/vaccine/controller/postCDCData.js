const sequelize = require('../../../models/sql/index');
const _ = require('lodash');
const person = require('../../../models/sql/person');

const personFields = ["NHIId", "IdNo", "Name", "Birthday", "isLocked"];
const vaccineFields = ["IdNo", "AgencyCode", "InocuDate", "VaccID", "VaccDoses", "qrcode", "dgci_hash", "isLocked"];
module.exports = async function (req, res) {
    storeVaccineData(sequelize ,req.body, res.status(500).send);
}

async function storeVaccineData(iSequelize=sequelize , item, onError = (e) => { }) {
    try {
        _.set(item, "isLocked", 0);
        item.AgencyCode = _.last(item.AgencyCode.split('-'));
        let query = {
            IdNo: item.IdNo,
            VaccDoses: item.VaccDoses
        }
        let personQuery = {
            IdNo: item.IdNo
        }

        let storedPerson = await iSequelize.models['person'].findOne({
            where: {
                ...personQuery
            }
        });
        if (!storedPerson) {
            let personData = {};
            for (let field of personFields) {
                personData[field] = item[field];
            }
            await iSequelize.models['person'].create(personData);
        }
        let storedData = await iSequelize.models['cdcData'].findOne({
            where: {
                ...query
            }
        });
        if (storedData) {
            let updateResult = await storedData.update(item);
            return updateResult.toJSON();
        } else {
            let insertResult = await iSequelize.models['cdcData'].create(item);
            return insertResult.toJSON();
        }
    } catch (e) {
        console.error(e);
        onError(e);
        return false;
    }
}

module.exports.storeVaccineData = storeVaccineData;