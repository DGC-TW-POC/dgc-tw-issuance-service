const _ = require('lodash');
const Base64 = require('js-base64');
const tough = require('tough-cookie');
const CryptoJS = require('crypto-js');
//https://stackoverflow.com/questions/38275753/how-to-remove-empty-values-from-object-using-lodash
/**
 * remove all empty fields in nestedObj
 * @param {Object} obj 
 * @returns 
 */
function removeEmpty(obj) {
    if (_.isArray(obj)) {
        return _(obj)
            .filter(_.isObject)
            .map(removeEmpty)
            .reject(_.isEmpty)
            .concat(_.reject(obj, _.isObject))
            .value();
    }
    return _(obj)
        .pickBy(_.isObject)
        .mapValues(removeEmpty)
        .omitBy(_.isEmpty)
        .assign(_.pickBy(_.omitBy(obj, _.isObject) , _.identity))
        .value();
}

/**
 * decode base64 encode string and parse to json
 * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>>} req 
 * @param {Response<any, Record<string, any>, number>} res 
 * @param {NextFunction} next 
 * @returns 
 */
function decodebase64Query(req, res, next) {
    try {
        if (!_.isEmpty(req['query'])) {
            console.log(Base64.decode(req['query']['qs']));
            req['query'] = JSON.parse(Base64.decode(req['query']['qs']));
        }
        return next();
    } catch (e) {
        console.error(e);
        return res.status(400).send({
            code: 400,
            message: "Bad request",
            detail: e
        });
    }
}

function getUserVabJar(req) {
    let jar = new tough.CookieJar();
    let sessionVabApp = _.get(req.session, "vabApp");
    if (req && sessionVabApp) {
        req.session.vabApp.split(";").map(function (value) {
            jar.setCookieSync(value, "https://1922.gov.tw");
        })
    }
    return jar;
}

function encryptData(data) {
    let iv = CryptoJS.enc.Base64.parse("2dH'N$<RT!Z.+R3s");//giving empty initialization vector
    let key = CryptoJS.SHA256("RuY&z$_M9NNV!7tj");//hashing the key using SHA256
    let encryptedString = "";
    if (typeof data == "string") {
        data = data.slice();
        encryptedString = CryptoJS.AES.encrypt(data, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    }
    else {
        encryptedString = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    }
    return encryptedString.toString();
}

function decryptData(encrypted){
    let iv = CryptoJS.enc.Base64.parse("2dH'N$<RT!Z.+R3s");//giving empty initialization vector
    let key = CryptoJS.SHA256("RuY&z$_M9NNV!7tj");//hashing the key using SHA256
    let decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        	  iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8)
}

module.exports = {
    removeEmpty: removeEmpty,
    decodebase64Query: decodebase64Query,
    getUserVabJar: getUserVabJar,
    encryptData: encryptData,
    decryptData: decryptData
}