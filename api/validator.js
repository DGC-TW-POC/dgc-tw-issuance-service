const Joi = require('joi');
const lodash = require('lodash');


/** 
 * @param {Object} paramSchema the valid scheama
 * @param {string} item body , query , param
 * @param {Object} option Joi option
*/
const validateParams = function (paramSchema , item , options) {
    return async (req, res, next) => {
        const schema = Joi.object().keys(paramSchema);
        const paramSchemaKeys = Object.keys(req[item]);
        let requestParamObj = {};
        for (let key of paramSchemaKeys){
            requestParamObj[key] = lodash.get(req[item], key);
        }
        try{
            let value = await schema.validateAsync(requestParamObj , options);
            req[item] = value;
        } catch (err) {
            return res.status(400).send({
                status: 400,
                result: err.details[0].message
            });
        }
        next();
    }
};

module.exports = {
    validateParams: validateParams 
};