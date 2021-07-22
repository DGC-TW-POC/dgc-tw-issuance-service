const _ = require('lodash');
const { removeEmpty } = require('../../apiService');
const { Op } = require('sequelize');
module.exports = async function(req, res) {
    const  sequelize  = await require('../../../models/sql');
    let query = req.query;
    query = removeEmpty(query);
    _.set(query , "isLocked" , 0);
    let page = _.get(query, "page");
    delete query['page'];
    if (_.get(query , 'VaccDoses') == 0) {
        delete query['VaccDoses'];
    }
    let cdcDataQuery = _.cloneDeep(query);
    delete cdcDataQuery['person'];
    let personQuery = _.get(query , 'person') || {};
    let personName = _.get(personQuery , 'Name')
    if (personName) {
        let nameLikeOp = {
            [Op.like] : `%${personName}%`
        }
        _.set(personQuery , 'Name' , nameLikeOp);
    }
    try {
        let findOption = {
            where :  {
                ...cdcDataQuery
            } ,
            attributes : {
                exclude: ["createdAt", "updatedAt","isLocked"]
            },
            include : [
                {
                    model : sequelize.models['person'] ,
                    attributes : {
                        exclude: ["id", "createdAt", "updatedAt","isLocked"]
                    } ,
                    where : {
                        ...personQuery
                    }
                } ,
                {
                    model: sequelize.models['agency'] ,
                    attributes : {
                        exclude: ["id"]
                    }
                }
            ]
        }
        let cdcDataResult = await sequelize.models['cdcData'].findAll({
            ...findOption,
            limit: 10,
            offset: 10 * (page-1)
        });
        let count = await sequelize.models['cdcData'].count(findOption);
        let cdcDataResponse = {
            count : count ,
            rows : [...cdcDataResult]
        }
        return res.json(cdcDataResponse);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}