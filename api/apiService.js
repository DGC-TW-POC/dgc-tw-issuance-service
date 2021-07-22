const _ = require('lodash');
const Base64 = require('js-base64');
const tough = require('tough-cookie');
//https://stackoverflow.com/questions/38275753/how-to-remove-empty-values-from-object-using-lodash
/**
 * remove all empty fields in nestedObj
 * @param {Object} obj 
 * @returns 
 */
function removeEmpty(obj) {
    let finalObj = {};
        Object.keys(obj).forEach((key) => {
            if (obj[key] && typeof obj[key] === 'object') {
                const nestedObj = removeEmpty(obj[key]);
                if (Object.keys(nestedObj).length) {
                    finalObj[key] = nestedObj;
                }
            } else if (obj[key] !== '' && obj[key] !== undefined && obj[key] !== null) {
                finalObj[key] = obj[key];
            }
        });
        return finalObj;
}

/**
 * decode base64 encode string and parse to json
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>>} req 
 * @param {Response<any, Record<string, any>, number>} res 
 * @param {NextFunction} next 
 * @returns 
 */
function decodebase64Query(req , res , next) {
    try {
        if (!_.isEmpty(req['query'])) {
            console.log(Base64.decode(req['query']['qs']));
            req['query'] = JSON.parse(Base64.decode(req['query']['qs']));
        }
        return next();
    } catch (e) {
        console.error(e);
        return res.status(400).send({
            code: 400 ,
            message: "Bad request",
            detail: e
        });
    }
}

function getUserVabJar (req) {
    let jar = new tough.CookieJar();
    let sessionVabApp = _.get(req.session , "vabApp");
    if (req && sessionVabApp) {
        req.session.vabApp.split(";").map(function (value) {
            jar.setCookieSync(value, "https://1922.gov.tw");
        })
    }
    return jar;
}

module.exports = {
    removeEmpty : removeEmpty,
    decodebase64Query: decodebase64Query,
    getUserVabJar: getUserVabJar
}